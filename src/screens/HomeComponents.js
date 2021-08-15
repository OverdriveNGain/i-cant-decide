import useResize from "../hooks/useResize";
import { maxChoices, maxFactors } from "../helpers/constants";
import Sketch from "react-p5";
import { GenerateArray, Pd, Tern } from "../helpers/func";
import { useEffect, useRef, useState } from "react";

const LandingBg = (props) => {
    const setup = (p5) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent("LandingBgParent");
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    const draw = (p5) => {
        p5.background(200, 230, 255);
    };

    return (
        <div id="LandingBgParent">
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </div>
    );
};

const LandingForm1 = ({ onChangeForm, currentStep, upperSetChoices }) => {
    const { breakpointSelector } = useResize();

    const [choices, setChoices] = useState(["", ""])
    const [errorMessage, setErrorMessage] = useState("")

    const onChoiceRemove = (e, i) => { Pd(e, () => { setChoices(choices.filter((v, j) => j !== i)) }) }
    const onChoiceNew = (e) => { Pd(e, () => { setChoices([...choices, ""]) }) }
    const onChoiceChange = (e, index) => { setChoices(choices.map((v, i) => Tern(i === index, e.target.value, choices[i]))); }

    const fieldSpacer = <i className="bi bi-x-lg btn o-0 disabled py-2" />;

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
        <form className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 1: Enter your choices</span>
            </div>
            <div className="p-3">
                <div className="row justify-content-center mt-3">
                    <div className={breakpointSelector("col", null, "col-6")}>
                        {
                            GenerateArray(
                                choices.length,
                                (index) => <div key={index} className="d-flex flex-row py-1">
                                    <input disabled={currentStep !== 1} className="d-inline-block form-control form-control rounded-1" value={choices[index]} placeholder={`Enter choice ${index + 1}`} onChange={(e) => onChoiceChange(e, index)}></input>
                                    {
                                        Tern(index > 1,
                                            <button disabled={currentStep !== 1} className="rounded-circle btn" onClick={(e) => { onChoiceRemove(e, index); }} >
                                                <i className="bi bi-x-lg" />
                                            </button>,
                                            fieldSpacer,
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <p className="text-center text-danger my-3">{errorMessage}</p>
                <div className="d-flex flex-row">
                    <button disabled={currentStep !== 1} className={"mt-4 w-50 btn btn rounded-1 btn-outline-secondary" + Tern(choices.length < maxChoices, "", " disabled")} onClick={onChoiceNew}>Add a New Choice</button>
                    <span className="ps-2"></span>
                    <button disabled={currentStep !== 1} className="mt-4 w-50 btn btn rounded-1 btn-primary text-white" onClick={nextStepClick}>Next Step</button>
                </div>
            </div>
        </form>
    );
}

const LandingForm2 = ({ upperSetFactors, onChangeForm, currentStep }) => {
    const { breakpointSelector } = useResize();
    const fieldSpacer = <i className="bi bi-x-lg btn o-0 disabled py-2" />;

    const [factors, setFactors] = useState(["", ""])
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
            upperSetFactors(factors.map((v, i) => { return { name: v, rating: 6 } }));
            onChangeForm(e, 3);
        }
    }

    return (
        <form disabled={currentStep === 2} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 2: Enter your factors</span>
            </div>
            <div className="p-3">
                <p>e.g. Price, Color, Long-Term</p>
                <div className="row justify-content-center mt-3">
                    <div className={breakpointSelector("col", null, "col-6")}>
                        {
                            GenerateArray(
                                factors.length,
                                (index) => <div key={index} className="d-flex flex-row py-1">
                                    <input disabled={currentStep !== 2} className="d-inline-block form-control form-control rounded-1" value={factors[index]} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorChange(e, index)}></input>
                                    {
                                        Tern(index > 1,
                                            <button disabled={currentStep !== 2} className="rounded-circle btn" onClick={(e) => { onFactorRemove(e, index); }} >
                                                <i className="bi bi-x-lg" />
                                            </button>,
                                            fieldSpacer,
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <p className="text-center text-danger my-3">{errorMessage}</p>
                <div className="d-flex flex-row">
                    <button disabled={currentStep !== 2} className="mt-4 w-50 btn btn rounded-1 btn-outline-secondary" onClick={(e) => onChangeForm(e, 1)}>Previous Step</button>
                    <span className="ps-2"></span>
                    <button disabled={currentStep !== 2} className={"mt-4 w-50 btn btn rounded-1 btn-outline-secondary" + Tern(factors.length < maxFactors, "", " disabled")} onClick={onFactorNew}>Add a New Factor</button>
                    <span className="ps-2"></span>
                    <button disabled={currentStep !== 2} className="mt-4 w-50 btn btn rounded-1 btn-primary text-white" onClick={nextStepClick}>Next Step</button>
                </div>
            </div>
        </form>

    );
}

const LandingForm3 = ({ initialFactors, onChangeForm, currentStep, upperSetFactors }) => {
    const lastFactors = useRef(null);
    const [factors, setFactors] = useState([])

    useEffect(() => {
        if (lastFactors.current === null) {
            setFactors(initialFactors);
        }
        else {
            const temp = [];
            for (let newFactorI = 0; newFactorI < initialFactors.length; newFactorI++) {
                let factorName = initialFactors[newFactorI].name;
                let oldIndex = lastFactors.current.findIndex((v, i) => v.name === factorName);
                if (oldIndex !== -1)
                    temp.push(lastFactors.current[oldIndex])
                else
                    temp.push(initialFactors[newFactorI])
            }
            setFactors(temp);
        }
    }, [initialFactors])

    const { breakpointSelector } = useResize();

    const onFactorRatingChange = (e, factor) => setFactors(factors.map((v, i) => Tern(v.name === factor, { name: factor, rating: parseInt(e.target.value) }, factors[i])));

    const nextStepClick = (e) => {
        e.preventDefault();
        upperSetFactors(factors);
        onChangeForm(e, 4);
    }

    const lastStepClick = (e) => {
        e.preventDefault();
        lastFactors.current = factors;
        onChangeForm(e, 2);
    }

    if (initialFactors.length === 0)
        return <div></div>

    return (
        <form disabled={currentStep === 2} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 3: Rate your factors' importance</span>
            </div>
            <div className="p-3">
                <p>For example, you can rate your </p>
                <div className="row justify-content-center mt-3">
                    <div className={breakpointSelector("col")}>
                        {
                            GenerateArray(
                                factors.length,
                                (index) => <div key={index} className="d-flex flex-row py-1">
                                    <span className="w-50 text-end me-3">{factors[index].name}</span>
                                    <input type="range" className="form-range" min="0" max="10" disabled={currentStep !== 3} value={factors[index].rating} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorRatingChange(e, factors[index].name)}></input>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <button disabled={currentStep !== 3} className="mt-4 w-50 btn btn rounded-1 btn-outline-secondary" onClick={lastStepClick}>Previous Step</button>
                    <span className="ps-2"></span>
                    <button disabled={currentStep !== 3} className="mt-4 w-50 btn btn rounded-1 btn-primary text-white" onClick={nextStepClick}>Next Step</button>
                </div>
            </div>
        </form>

    );
}

const getRatingMatrix = (choices, factors) => {
    let newRatingMatrix = {}
    for (let i = 0; i < choices.length; i++) {
        let map = {};
        let choice = choices[i]
        for (let i = 0; i < factors.length; i++) {
            let factorName = factors[i].name;
            map[factorName] = 6;
        }

        newRatingMatrix[choice] = map
    }
    return newRatingMatrix;
}
const LandingForm4 = ({ choices, factors, onChangeForm, currentStep }) => {
    const [ratingMatrix, setRatingMatrix] = useState([])

    useEffect(() => {
        setRatingMatrix(getRatingMatrix(choices, factors))
    }, [choices, factors])

    if (Object.keys(ratingMatrix).length !== choices.length)
        return <div></div>
    for (let factor of factors) {
        if (ratingMatrix[choices[0]] == null || ratingMatrix[choices[0]][factor.name] == null)
            return <div></div>
    }

    const modifyRatingMatrix = (choice, factorName, rating) => {
        let copiedRatingMatrix = {};
        for (let property in ratingMatrix) {
            copiedRatingMatrix[property] = ({ ...ratingMatrix[property] });
        }
        copiedRatingMatrix[choice][factorName] = rating;
        setRatingMatrix(copiedRatingMatrix)
    }

    if (factors.length === 0)
        return <div></div>

    return (
        <form disabled={currentStep === 4} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 4: Rate your choices</span>
            </div>
            <div className="p-3">
                {
                    GenerateArray(factors.length, (factorI) => {
                        return <div key={factorI}>
                            {Tern(factorI === 0, <div></div>, <hr />)}
                            <h3 className="text-center">{factors[factorI].name}</h3>
                            <div className="row justify-content-center mt-3">
                                <div className="col">
                                    {
                                        GenerateArray(
                                            choices.length,
                                            (choiceI) => {
                                                const sliderVal = ratingMatrix[choices[choiceI]][factors[factorI].name];
                                                const onChangeVal = (e) => modifyRatingMatrix(choices[choiceI], factors[factorI].name, e.target.value);
                                                return <div key={choiceI} className="d-flex flex-row py-1">
                                                    <span className="w-50 text-end me-3">{choices[choiceI]}</span>
                                                    <input type="range" className="form-range" min="0" max="10" disabled={currentStep !== 4} value={sliderVal} placeholder={`Enter factor ${choiceI + 1}`} onChange={onChangeVal}></input>
                                                </div>
                                            }
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    })
                }
                <div className="d-flex flex-row">
                    <button disabled={currentStep !== 4} className="mt-4 w-50 btn btn rounded-1 btn-outline-secondary" onClick={(e) => onChangeForm(e, 3)}>Previous Step</button>
                    <span className="ps-2"></span>
                    <button disabled={currentStep !== 4} className="mt-4 w-50 btn btn rounded-1 btn-primary text-white">Next Step</button>
                </div>
            </div>
        </form>

    );
}

export { LandingBg, LandingForm1, LandingForm2, LandingForm3, LandingForm4 }