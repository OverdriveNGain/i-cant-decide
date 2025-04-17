import useResize from "../hooks/useResize";
import { maxChoices, maxFactors } from "../helpers/constants";
import Sketch from "react-p5";
import { GenerateArray, Pd, Tern } from "../helpers/func";
import { useEffect, useRef, useState } from "react";
import ResultCardsSection from "../components/ResultCardsSection";

// Helper function to prevent form submission when Enter key is pressed
const preventEnterKeySubmission = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};

const LandingBg = (props) => {
    const setup = (p5) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent("LandingBgParent");
        p5.rectMode(p5.CORNERS)
        p5.ellipseMode(p5.CORNERS)
        p5.noStroke()
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    const draw = (p5) => {
        const w = p5.width;
        const h = p5.height;
        const rows = Math.ceil(w / 150);
        const cols = Math.ceil(h / 150);
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                let noise = p5.noise(p5.frameCount * 0.01, x, y);
                let colV = p5.lerp(235, 250, noise)
                p5.fill(colV, colV, 255);
                p5.rect((x / rows) * w, (y / cols) * h, ((x + 1) / rows) * w, ((y + 1) / cols) * h)

                noise = p5.noise(p5.frameCount * 0.01 + 100, x, y);
                colV = p5.lerp(235, 250, noise)
                p5.fill(colV, colV, 255);
                p5.ellipse((x / rows) * w, (y / cols) * h, ((x + 1) / rows) * w, ((y + 1) / cols) * h)
            }
        }

        // p5.background(200, p5.lerp(100, 240, noise), 255);
    };

    return (
        <div id="LandingBgParent">
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </div>
    );
};

const LandingForm1 = ({ onChangeForm, currentStep, upperSetChoices }) => {
    const { breakpointSelector } = useResize();

    // Initialize with choices from props or default empty values
    const [choices, setChoices] = useState(() => {
        // Get choices from localStorage via Home component
        const existingChoices = window.localStorage.getItem('icd_choices');
        if (existingChoices) {
            try {
                const parsedChoices = JSON.parse(existingChoices);
                return parsedChoices.length > 0 ? parsedChoices : ["", ""];
            } catch (e) {
                console.error("Error parsing choices from localStorage", e);
                return ["", ""];
            }
        }
        return ["", ""];
    });
    const [errorMessage, setErrorMessage] = useState("")

    const onChoiceRemove = (e, i) => { Pd(e, () => { setChoices(choices.filter((v, j) => j !== i)) }) }
    const onChoiceNew = (e) => { Pd(e, () => { setChoices([...choices, ""]) }) }
    const onChoiceChange = (e, index) => { setChoices(choices.map((v, i) => Tern(i === index, e.target.value, choices[i]))); }

    const nextStepClick = (e) => {
        const duplicatesExist = () => {
            const tester = {};
            for (let choice of choices) {
                if (tester[choice] == null)
                    tester[choice] = true;
                else
                    return true;
            }
            return false;
        }
        e.preventDefault();
        if (choices.some((v, i) => v.length === 0))
            setErrorMessage("Please fill out all blank fields")
        else if (duplicatesExist())
            setErrorMessage("Remove any duplicate choices")
        else {
            setErrorMessage("")
            upperSetChoices(choices);
            onChangeForm(e, 2);
        }
    }
    return (
        <form className="d-block card rounded shadow border-0 mb-3">
            <div className="bg-secondary rounded-top py-2 px-3 text-center">
                <span className="text-white">Step 1: Enter your choices</span>
            </div>
            <div className="p-3">
                <div className="container">
                    <p className="text-muted text-center o-50">These can be different brands that you're planning to buy, or different colleges that you're planning to get into.</p>
                    <div className="row justify-content-center">
                        <div className={`p-0 ${breakpointSelector("col", null, "col-6")}`}>
                            {
                                GenerateArray(
                                    choices.length,
                                    (index) => {
                                        const optional = index > 1;
                                        return <div key={index} className="d-flex flex-row py-1 position-relative">
                                            <input disabled={currentStep !== 1} className="d-inline-block form-control form-control rounded-1" style={{ paddingRight: Tern(optional, "2.2em", "0em") }} value={choices[index]} placeholder={`Enter choice ${index + 1}`} onChange={(e) => onChoiceChange(e, index)} onKeyDown={preventEnterKeySubmission} />
                                            {
                                                Tern(optional,
                                                    <button disabled={currentStep !== 1} className="rounded-circle btn position-absolute py-auto" style={{ right: "0px" }} onClick={(e) => { onChoiceRemove(e, index); }} >
                                                        <i className="bi bi-x-lg" />
                                                    </button>,
                                                    null,
                                                )
                                            }
                                        </div>
                                    }
                                )
                            }
                        </div>
                    </div>
                    <p className="text-center text-danger my-3">{errorMessage}</p>
                    <div className="row">
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button className={`w-100 btn rounded-1 btn-outline-secondary${Tern(choices.length < maxChoices, "", " disabled")}`} disabled={currentStep !== 1} onClick={onChoiceNew}><i className="bi bi-plus-lg me-2"></i> Add Choice</button>
                        </div>
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button className={"w-100 btn rounded-1 btn-primary text-white"} disabled={currentStep !== 1} onClick={nextStepClick}><i className="bi bi-arrow-right me-2"></i>Next Step</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

const LandingForm2 = ({ upperSetFactors, onChangeForm, currentStep, existingFactors }) => {
    const { breakpointSelector } = useResize();

    // Initialize with factors from localStorage or default empty values
    const [factors, setFactors] = useState(() => {
        // First check if we have existingFactors from props
        if (existingFactors && existingFactors.length > 0) {
            return existingFactors.map(factor => factor.name);
        }
        
        // Otherwise check localStorage
        const storedFactors = window.localStorage.getItem('icd_factors');
        if (storedFactors) {
            try {
                const parsedFactors = JSON.parse(storedFactors);
                if (parsedFactors && parsedFactors.length > 0) {
                    return parsedFactors.map(factor => factor.name);
                }
            } catch (e) {
                console.error("Error parsing factors from localStorage", e);
            }
        }
        
        // Default empty values
        return ["", ""];
    });
    const [errorMessage, setErrorMessage] = useState("")

    const onFactorRemove = (e, i) => { Pd(e, () => { setFactors(factors.filter((v, j) => j !== i)) }) }
    const onFactorNew = (e) => { Pd(e, () => { setFactors([...factors, ""]) }) }
    const onFactorChange = (e, index) => { setFactors(factors.map((v, i) => Tern(i === index, e.target.value, factors[i]))); }

    const nextStepClick = (e) => {
        const duplicatesExist = () => {
            const tester = {};
            for (let choice of factors) {
                if (tester[choice] == null)
                    tester[choice] = true;
                else
                    return true;
            }
            return false;
        }

        e.preventDefault();
        if (factors.some((v, i) => v.length === 0))
            setErrorMessage("Please fill out all blank fields")
        else if (duplicatesExist())
            setErrorMessage("Remove any duplicate factors")
        else {
            setErrorMessage("")
            const updatedFactors = factors.map((factorName) => {
                const existingFactor = existingFactors?.find(f => f.name === factorName);
                return { 
                    name: factorName, 
                    rating: existingFactor ? existingFactor.rating : 3 
                };
            });
            upperSetFactors(updatedFactors);
            onChangeForm(e, 3);
        }
    }

    return (
        <form disabled={currentStep !== 2} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 2: Enter your factors</span>
            </div>
            <div className="p-3">
                <div className="container">
                    <p className="text-muted text-center o-50">These can be things that vary among your choices. e.g. Price, Location, Battery-life, etc.</p>
                    <div className="row justify-content-center mt-3">
                        <div className={`p-0 ${breakpointSelector("col", null, "col-6")}`}>
                            {
                                GenerateArray(
                                    factors.length,
                                    (index) => {
                                        const optional = index > 1;
                                        return <div key={index} className="d-flex flex-row py-1 position-relative">
                                            <input disabled={currentStep !== 2} className="d-inline-block form-control form-control rounded-1" style={{ paddingRight: Tern(optional, "2.2em", "0em") }} value={factors[index]} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorChange(e, index)} onKeyDown={preventEnterKeySubmission} />
                                            {
                                                Tern(index > 1,
                                                    <button disabled={currentStep !== 2} className="rounded-circle btn position-absolute py-auto" style={{ right: "0px" }} onClick={(e) => { onFactorRemove(e, index); }} >
                                                        <i className="bi bi-x-lg" />
                                                    </button>,
                                                    null,
                                                )
                                            }
                                        </div>
                                    }
                                )
                            }
                        </div>
                    </div>
                    <p className="text-center text-danger my-3">{errorMessage}</p>
                    <div className="row">
                        <div className="mt-2 col-12 col-md-4 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 2} className="w-100 btn rounded-1 btn-outline-secondary" onClick={(e) => onChangeForm(e, 1)}><i className="bi bi-arrow-left me-2" />Previous Step</button>
                        </div>
                        <div className="mt-2 col-12 col-md-4 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 2} className={`w-100 btn rounded-1 btn-outline-secondary${Tern(factors.length < maxFactors, "", " disabled")}`} onClick={onFactorNew}><i className="bi bi-plus-lg me-2" />Add Factor</button>
                        </div>
                        <div className="mt-2 col-12 col-md-4 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 2} className="w-100 btn rounded-1 btn-primary text-white" onClick={nextStepClick}><i className="bi bi-arrow-right me-2" />Next Step</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
}

const LandingForm3 = ({ initialFactors, onChangeForm, currentStep, upperSetFactors }) => {
    const lastFactors = useRef(null);
    
    // Initialize factors from props or localStorage
    const [factors, setFactors] = useState(() => {
        // First check if we have initialFactors from props
        if (initialFactors && initialFactors.length > 0) {
            return initialFactors;
        }
        
        // Otherwise check localStorage
        const storedFactors = window.localStorage.getItem('icd_factors');
        if (storedFactors) {
            try {
                const parsedFactors = JSON.parse(storedFactors);
                if (parsedFactors && parsedFactors.length > 0) {
                    return parsedFactors;
                }
            } catch (e) {
                console.error("Error parsing factors from localStorage", e);
            }
        }
        
        return [];
    })

    const onFactorRatingChange = (e, factor) => {
        const newFactors = factors.map((v) => {
            return v.name === factor ? { ...v, rating: parseInt(e.target.value, 10) } : v;
        });
        setFactors(newFactors);
    }

    const nextStepClick = (e) => {
        e.preventDefault();
        // Save to localStorage directly as well as updating parent state
        window.localStorage.setItem('icd_factors', JSON.stringify(factors));
        upperSetFactors(factors);
        onChangeForm(e, 4);
    }

    const lastStepClick = (e) => {
        e.preventDefault();
        // Save current factors state before navigating back
        lastFactors.current = factors;
        window.localStorage.setItem('icd_factors', JSON.stringify(factors));
        onChangeForm(e, 2);
    }

    const ratingToWords = (rating) => {
        const ratings = [
            "...is not that important",
            "...is a little important",
            "...is somewhat important",
            "...is important",
            "...is very important"];
        return (
            <span>{ratings[parseInt(rating) - 1]}</span>
        )
    }

    // Save factor ratings whenever they change
    useEffect(() => {
        if (factors.length > 0) {
            window.localStorage.setItem('icd_factors', JSON.stringify(factors));
        }
    }, [factors]);
    
    // Initialize factors from various sources
    useEffect(() => {
        // If we already have factors, don't reset them
        if (factors.length > 0) {
            return;
        }
        
        // If we have lastFactors from previous navigation, use those
        if (lastFactors.current !== null) {
            const temp = [];
            for (const initialFactor of initialFactors) {
                const factorName = initialFactor.name;
                const oldIndex = lastFactors.current.findIndex((v) => v.name === factorName);
                if (oldIndex !== -1)
                    temp.push({...lastFactors.current[oldIndex]});
                else
                    temp.push({...initialFactor});
            }
            setFactors(temp);
            return;
        }
        
        // Otherwise, use initialFactors
        if (initialFactors && initialFactors.length > 0) {
            setFactors(initialFactors);
        }
    }, [initialFactors, factors.length])

    if (initialFactors.length === 0)
        return null

    return (
        <form disabled={currentStep !== 3} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 3: Rate your factors' importance</span>
            </div>
            <div className="p-3">
                <div className="container">
                    <p className="text-muted text-center o-50">You might value CPU quality over battery life, for example.</p>
                    <div>
                        {
                            GenerateArray(
                                factors.length,
                                (index) => <div key={index} className="row align-items-center text-muted mb-2">
                                    <span className="col-6 col-md-3 px-2">
                                        <div className="p-0 w-100 text-end text-center rounded-1" style={{ backgroundColor: "rgb(240, 240, 240)" }}> <span className="fw-bold">{factors[index].name}</span>...</div>
                                    </span>
                                    <input className="px-2-0 col-6 col-md-3" type="range" min="1" max="5" disabled={currentStep !== 3} value={factors[index].rating} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorRatingChange(e, factors[index].name)} onKeyDown={preventEnterKeySubmission} />
                                    <span className="col-12 col-md-6 px-2 pt-2 pb-3 py-md-0">
                                        <div className="p-0 text-center w-100 rounded-1" style={{ backgroundColor: "rgb(240, 240, 240)" }}>{ratingToWords(factors[index].rating)}</div>
                                    </span>
                                </div>
                            )
                        }
                    </div>
                    <div className="row">
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button className="w-100 btn rounded-1 btn-outline-secondary" onClick={lastStepClick}><i className="bi bi-arrow-left me-2" />Previous Step</button>
                        </div>
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button className="w-100 btn rounded-1 btn-primary text-white" onClick={nextStepClick}><i className="bi bi-arrow-right me-2" />Next Step</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
}

const getRatingMatrix = (choices, factors, oldRatingMatrix) => {
    const newRatingMatrix = {}
    for (const choice of choices) {
        const map = {};
        for (const factor of factors) {
            const factorName = factor.name;
            const b1 = oldRatingMatrix[choice] != null
            const b2 = b1 ? oldRatingMatrix[choice][factorName] != null : false;
            map[factorName] = b1 && b2 ? oldRatingMatrix[choice][factorName] : 3;
        }

        newRatingMatrix[choice] = map
    }
    return newRatingMatrix;
}
const LandingForm4 = ({ choices, factors, onChangeForm, currentStep, upperSetRatingMatrix }) => {
    // Initialize oldRatingMatrix from localStorage if available
    const oldRatingMatrix = useRef({});
    
    // Load saved rating matrix from localStorage on component mount
    useEffect(() => {
        const storedMatrix = window.localStorage.getItem('icd_rating_matrix');
        if (storedMatrix) {
            try {
                oldRatingMatrix.current = JSON.parse(storedMatrix);
            } catch (e) {
                console.error("Error parsing rating matrix from localStorage", e);
            }
        }
    }, []);
    
    const [ratingMatrix, setRatingMatrix] = useState({})
    const { breakpointSelector } = useResize();

    const modifyRatingMatrix = (choice, factorName, rating) => {
        const copiedRatingMatrix = {};
        for (const property in ratingMatrix) {
            copiedRatingMatrix[property] = ({ ...ratingMatrix[property] });
        }
        copiedRatingMatrix[choice][factorName] = parseInt(rating);
        setRatingMatrix(copiedRatingMatrix);
        
        // Save to localStorage immediately when ratings change
        window.localStorage.setItem('icd_rating_matrix', JSON.stringify(copiedRatingMatrix));
    }
    const nextStepClick = (e) => {
        e.preventDefault();
        oldRatingMatrix.current = ratingMatrix;
        // Save to localStorage before proceeding to next step
        window.localStorage.setItem('icd_rating_matrix', JSON.stringify(ratingMatrix));
        upperSetRatingMatrix(ratingMatrix);
        onChangeForm(e, 5);
    }
    const previousStepClick = (e) => {
        e.preventDefault(e);
        oldRatingMatrix.current = ratingMatrix;
        // Save to localStorage before going back
        window.localStorage.setItem('icd_rating_matrix', JSON.stringify(ratingMatrix));
        onChangeForm(e, 3);
    }
    const ratingMatrixIsUpdated = () => {
        const ratingMatrixKeys = Object.keys(ratingMatrix);
        if (ratingMatrixKeys.length !== choices.length)
            return false;
        for (let i = 0; i < choices.length; i++) {
            if (ratingMatrixKeys[i] !== choices[i])
                return false;
        }
        if (ratingMatrixKeys.length === 0)
            return false;
        const ratingMatrixFactorKeys = Object.keys(ratingMatrix[ratingMatrixKeys[0]])
        if (ratingMatrixFactorKeys.length !== factors.length)
            return false;
        for (let i = 0; i < factors.length; i++) {
            if (ratingMatrixFactorKeys[i] !== factors[i].name)
                return false;
        }
        return true;
    }
    const ratingToWords = (rating) => {
        const emojis = ["🤮", "😒", "😐", "😋", "🤩"];
        const ratings = [
            "Very Bad ",
            "Bad",
            "Neutral",
            "Good",
            "Excellent"];
        if (breakpointSelector(true, null, false))
            return (<span className="text-muted">{emojis[parseInt(rating) - 1]}</span>)
        return (
            <span>{`${emojis[parseInt(rating) - 1]} ${ratings[parseInt(rating) - 1]}`}</span>
        )
    }

    useEffect(() => {
        // First try to get matrix from localStorage
        const storedMatrix = window.localStorage.getItem('icd_rating_matrix');
        if (storedMatrix) {
            try {
                const parsedMatrix = JSON.parse(storedMatrix);
                // Check if the stored matrix is compatible with current choices and factors
                let isCompatible = true;
                
                // Check if all current choices exist in the stored matrix
                for (const choice of choices) {
                    if (!parsedMatrix[choice]) {
                        isCompatible = false;
                        break;
                    }
                    
                    // Check if all current factors exist for this choice
                    for (const factor of factors) {
                        if (parsedMatrix[choice][factor.name] === undefined) {
                            isCompatible = false;
                            break;
                        }
                    }
                    
                    if (!isCompatible) break;
                }
                
                if (isCompatible) {
                    // If stored matrix is compatible, use it
                    setRatingMatrix(parsedMatrix);
                    return;
                }
            } catch (e) {
                console.error("Error parsing rating matrix from localStorage", e);
            }
        }
        
        // Fall back to generating a new matrix if localStorage data isn't usable
        setRatingMatrix(getRatingMatrix(choices, factors, oldRatingMatrix.current));
    }, [choices, factors])

    if (!ratingMatrixIsUpdated())
        return null

    return (
        <form disabled={currentStep !== 4} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 4: Rate your choices</span>
            </div>
            <div className="p-3">
                <div className="alert alert-info mb-3">
                    <p className="mb-1"><strong>How your ratings will be calculated:</strong></p>
                    <p className="mb-0 small">For each factor, your ratings will be normalized to range from 0.0 to 1.0, where 1.0 is assigned to the highest-rated choice for that factor. This ensures that factors with naturally higher scores don't dominate the results.</p>
                </div>
                <div>
                    {
                        GenerateArray(factors.length, (factorI) => {
                            return <div key={factorI}>
                                <h6 className="text-center text-muted">{factors[factorI].name}</h6>
                                <div className="row justify-content-center mt-3">
                                    {
                                        GenerateArray(
                                            choices.length,
                                            (choiceI) => {
                                                const sliderVal = ratingMatrix[choices[choiceI]][factors[factorI].name];
                                                const onChangeVal = (e) => modifyRatingMatrix(choices[choiceI], factors[factorI].name, e.target.value);
                                                return (
                                                    <div key={choiceI} className="d-flex flex-row align-items-center mb-2 text-muted">
                                                        <div className="container p-0 ">
                                                            <div className="row m-0 align-items-center">
                                                                <span className="col-6 px-2">
                                                                    <div className="fw-bold text-center rounded-1" style={{ backgroundColor: "rgb(240, 240, 240)" }}>{choices[choiceI]}</div>
                                                                </span>
                                                                <input type="range" className="col-6 px-2" min="1" max="5" disabled={currentStep !== 4} value={sliderVal} placeholder={`Enter factor ${choiceI + 1}`} onChange={onChangeVal} onKeyDown={preventEnterKeySubmission} />
                                                            </div>
                                                        </div>
                                                        <span className={breakpointSelector("px-2", null, "w-50 text-center px-2")} >
                                                            {breakpointSelector(
                                                                <div>{ratingToWords(sliderVal)}</div>, null,
                                                                <div className="text-center rounded-1" style={{ backgroundColor: "rgb(240, 240, 240)" }}>{ratingToWords(sliderVal)}</div>
                                                            )}
                                                        </span>
                                                    </div>);
                                            }
                                        )
                                    }
                                </div>
                                <hr className="my-2" />
                            </div>
                        })
                    }
                </div>
                <div className="container">
                    <div className="row">
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 4} className="w-100 btn rounded-1 btn-outline-secondary" onClick={previousStepClick}><i className="bi bi-arrow-left me-2"></i>Previous Step</button>
                        </div>
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 4} className="w-100 btn rounded-1 btn-primary text-white" onClick={nextStepClick}><i className="bi bi-gear-fill me-2"></i>Calculate</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
}

const Results = ({ ratingMatrix, factors, onChangeForm, currentStep }) => {
    const previousRatingMatrix = useRef(null);
    const previousFactors = useRef(null);
    const optionsArray = Object.keys(ratingMatrix);

    const { breakpointSelector } = useResize();

    if (currentStep !== 5) {
        if (previousFactors.current == null)
            return null
        ratingMatrix = previousRatingMatrix.current;
        factors = previousFactors.current;
    }

    const factorsArray = Object.keys(ratingMatrix[optionsArray[0]]);
    
    // Calculate raw values first (rating * importance)
    const rawValues = GenerateArray(factorsArray.length, (factorI) =>
        GenerateArray(optionsArray.length, (optionI) =>
            ratingMatrix[optionsArray[optionI]][factorsArray[factorI]] * factors.find((v) => v.name === factorsArray[factorI]).rating)
    );
    
    // Normalize values for each factor (row)
    const normalizedValues = rawValues.map(factorScores => {
        // Find min and max for this factor across all choices
        const min = Math.min(...factorScores);
        const max = Math.max(...factorScores);
        const range = max - min;
        
        // If all values are the same, return array of 1s (all choices are equally good for this factor)
        if (range === 0) {
            return factorScores.map(() => 1);
        }
        
        // Otherwise normalize between 0 and 1
        return factorScores.map(score => (score - min) / range);
    });
    
    // Calculate display values (normalized value * importance)
    const values = normalizedValues.map((factorScores, factorI) => {
        const factorName = factorsArray[factorI];
        const factor = factors.find(v => v.name === factorName);
        const importance = factor ? factor.rating : 1;
        
        // Multiply each normalized score by the factor importance
        return factorScores.map(score => score * importance);
    });
    const onPreviousStep = (e) => {
        previousRatingMatrix.current = ratingMatrix;
        previousFactors.current = factors;
        onChangeForm(e, 4);
    }

    // Calculate weighted sums using normalized values and factor importance
    // Calculate the simple sum for each option
    let sums = GenerateArray(optionsArray.length, (optionI) => {
        let sum = 0;
        for (let factorI = 0; factorI < factorsArray.length; factorI++) {
            // Simply add up the values (which are already normalized * importance)
            sum += values[factorI][optionI];
        }
        return Math.round(sum * 10) / 10; // Round to 1 decimal place
    });
    
    // Calculate scores on a scale where highest is 100
    const rawMax = Math.max(...sums);
    
    // Scale scores proportionally so highest is 100
    let normalizedSums = sums.map(score => {
        // If all scores are the same or max is 0, return 100 for all
        if (rawMax === 0 || sums.every(s => s === sums[0])) return 100;
        // Otherwise scale proportionally where highest is 100
        return Math.round((score / rawMax) * 100);
    });

    let max = sums[0];
    let maxIndices = [0];
    for (let i = 1; i < sums.length; i++) {
        if (sums[i] > max) {
            max = sums[i];
            maxIndices = [i];
        }
        else if (sums[i] === max) {
            maxIndices.push(i);
        }
    }

    return (
        <form className="d-block bg-white shadow border-0 mb-3 mt-5">
            <div className="p-3 p-md-5 text-center">
                {(() => {
                    if (maxIndices.length === 1)
                        return <div>
                            <p className="mt-2">Results say you should go for...</p>
                            <h1 className="display-1 font-title text-primary">{Object.keys(ratingMatrix)[maxIndices[0]]}!</h1>
                        </div>

                    const allMax = maxIndices.length === optionsArray.length
                    return <div>
                        <p className="mt-2">Results say you should go for {Tern(allMax, "all", maxIndices.length)} of your options.</p>
                        <p className="mt-2 fw-bold">{Tern(allMax, "All", "Some")} of your options got the same score. Trying reassessing some of your factors?</p>
                    </div>
                })()}
                <div className="container"><hr />
                    {/* Standard table for medium screens and up */}
                    <div className="table-responsive d-none d-md-block">
                        <table className="w-100 table table-striped table-hover">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-start">Factors</th>
                                    <th className="text-center">Importance</th>
                                    {GenerateArray(optionsArray.length, (i => {
                                        return <th key={i} className="text-center">
                                            <span className={`${Tern(maxIndices.some((v) => i === v && maxIndices.length === 1), "text-success fw-bold", "")}`}>
                                                {optionsArray[i]}
                                            </span>
                                        </th>
                                    }))}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    GenerateArray(factors.length, (factorI) =>
                                        <tr key={factorI}>
                                            <td className="text-start">{factors[factorI].name}</td>
                                            <td className="text-center">
                                                {factors[factorI].rating}
                                            </td>
                                            {GenerateArray(optionsArray.length, (optionI) => {
                                                return (
                                                    <td key={optionI} className="text-center">
                                                        <div className="mb-0">{values[factorI][optionI].toFixed(1)}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.7rem', lineHeight: '1', marginTop: '-2px' }}>
                                                            {normalizedValues[factorI][optionI].toFixed(1)} × {factors[factorI].rating}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                }
                            </tbody>
                            <tfoot className="border-top border-dark">
                                <tr>
                                    <td className="text-start text-muted">Raw Score</td>
                                    <td className="text-center">-</td>
                                    {GenerateArray(optionsArray.length, (optionI) => {
                                        return (
                                            <td key={optionI} className="text-center text-muted">
                                                {sums[optionI]}
                                            </td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    <td className="text-start fw-bold">Final Score</td>
                                    <td className="text-center">-</td>
                                    {GenerateArray(optionsArray.length, (optionI) => {
                                        return (
                                            <td key={optionI} className={`text-center fw-bold ${Tern(maxIndices.some((v) => optionI === v && maxIndices.length === 1), "text-success", "")}`}>
                                                {normalizedSums[optionI]}
                                            </td>
                                        )
                                    })}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    {/* Mobile-optimized cards for small screens */}
                    <ResultCardsSection 
                        optionsArray={optionsArray}
                        maxIndices={maxIndices}
                        factors={factors}
                        values={values}
                        sums={sums}
                        normalizedSums={normalizedSums}
                    />
                
                </div>
                <p className="text-muted fs-6 text-center">Factors set with higher importance contribute more to an option's total score.</p>
                <div className="d-flex flex-row justify-content-center">
                    <button disabled={currentStep !== 5} className="mt-4 w-75 btn btn rounded-1 btn-outline-secondary" onClick={onPreviousStep}><i className="bi bi-skip-backward-fill me-2"></i>Update Ratings</button>
                    <span className="ps-2"></span>
                    <div />
                </div>
                <small className="text-center o-50 d-block mt-5">This application is provided for informational purposes only. The decisions you make based on the results are your sole responsibility. The creators and maintainers of this tool make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information provided. Any reliance you place on such information is strictly at your own risk.</small>
            </div>
        </form >
    );
}

export { LandingBg, LandingForm1, LandingForm2, LandingForm3, LandingForm4, Results }