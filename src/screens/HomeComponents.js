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
                    <div className="row justify-content-center">
                        <div className={`p-0 ${breakpointSelector("col", null, "col-6")}`}>
                            {
                                GenerateArray(
                                    choices.length,
                                    (index) => {
                                        const optional = index > 1;
                                        return <div key={index} className="d-flex flex-row py-1 position-relative">
                                            <input disabled={currentStep !== 1} className="d-inline-block form-control form-control rounded-1" style={{ paddingRight: Tern(optional, "2.2em", "0em") }} value={choices[index]} placeholder={`Enter choice ${index + 1}`} onChange={(e) => onChoiceChange(e, index)}></input>
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
                            <button className={"w-100 btn rounded-1 btn-outline-secondary" + Tern(choices.length < maxChoices, "", " disabled")} disabled={currentStep !== 1} onClick={onChoiceNew}><i className="bi bi-plus-lg me-2"></i> Add Choice</button>
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

const LandingForm2 = ({ upperSetFactors, onChangeForm, currentStep }) => {
    const { breakpointSelector } = useResize();

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
            upperSetFactors(factors.map((v, i) => { return { name: v, rating: 3 } }));
            onChangeForm(e, 3);
        }
    }

    return (
        <form disabled={currentStep === 2} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 2: Enter your factors</span>
            </div>
            <div className="p-3">
                <div className="container">
                    <p className="text-muted text-center o-50">e.g. Price, Color, Long-Term, etc.</p>
                    <div className="row justify-content-center mt-3">
                        <div className={`p-0 ${breakpointSelector("col", null, "col-6")}`}>
                            {
                                GenerateArray(
                                    factors.length,
                                    (index) => {
                                        const optional = index > 1;
                                        return <div key={index} className="d-flex flex-row py-1 position-relative">
                                            <input disabled={currentStep !== 2} className="d-inline-block form-control form-control rounded-1" style={{ paddingRight: Tern(optional, "2.2em", "0em") }} value={factors[index]} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorChange(e, index)}></input>
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
                            <button disabled={currentStep !== 2} className="w-100 btn rounded-1 btn-outline-secondary" onClick={(e) => onChangeForm(e, 1)}><i className="bi bi-arrow-left me-2"></i>Previous Step</button>
                        </div>
                        <div className="mt-2 col-12 col-md-4 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 2} className={"w-100 btn rounded-1 btn-outline-secondary" + Tern(factors.length < maxFactors, "", " disabled")} onClick={onFactorNew}><i className="bi bi-plus-lg me-2"></i>Add Factor</button>
                        </div>
                        <div className="mt-2 col-12 col-md-4 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 2} className="w-100 btn rounded-1 btn-primary text-white" onClick={nextStepClick}><i className="bi bi-arrow-right me-2"></i>Next Step</button>
                        </div>
                    </div>
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

    const ratingToWords = (factor, rating) => {
        const ratings = [
            " is not that important ",
            " is a little important",
            " is somewhat important",
            " is important",
            " is very important"];
        return (
            <span className="text-muted">{ratings[parseInt(rating) - 1]}</span>
        )
    }

    if (initialFactors.length === 0)
        return <div></div>

    return (
        <form disabled={currentStep === 2} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 3: Rate your factors' importance</span>
            </div>
            <div className="p-3">
                <div className="container">
                    <div>
                        {
                            GenerateArray(
                                factors.length,
                                (index) => <div key={index} className="row align-items-center">
                                    <span className="p-0 col-6 col-md-3 fw-bold text-end text-center">{factors[index].name}</span>
                                    <input className="p-0 col-6 col-md-3" type="range" min="1" max="5" disabled={currentStep !== 3} value={factors[index].rating} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorRatingChange(e, factors[index].name)}></input>
                                    <span className="p-0 col-12 col-md-6 text-center">{ratingToWords(factors[index].name, factors[index].rating)}</span>
                                    <hr className="my-2" />
                                </div>
                            )
                        }
                    </div>
                    <div className="row">
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 3} className="w-100 btn rounded-1 btn-outline-secondary" onClick={lastStepClick}><i className="bi bi-arrow-left me-2"></i>Previous Step</button>
                        </div>
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 3} className="w-100 btn rounded-1 btn-primary text-white" onClick={nextStepClick}><i className="bi bi-arrow-right me-2"></i>Next Step</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
}

const getRatingMatrix = (choices, factors, oldRatingMatrix) => {
    let newRatingMatrix = {}
    for (let i = 0; i < choices.length; i++) {
        let map = {};
        let choice = choices[i]
        for (let j = 0; j < factors.length; j++) {
            let factorName = factors[j].name;
            let b1 = oldRatingMatrix[choice] != null
            let b2 = false;
            if (b1)
                b2 = oldRatingMatrix[choice][factorName] != null;
            if (b1 && b2)
                map[factorName] = oldRatingMatrix[choice][factorName]
            else
                map[factorName] = 3;
        }

        newRatingMatrix[choice] = map
    }
    return newRatingMatrix;
}
const LandingForm4 = ({ choices, factors, onChangeForm, currentStep, upperSetRatingMatrix }) => {
    const oldRatingMatrix = useRef({});
    const [ratingMatrix, setRatingMatrix] = useState({})
    const { breakpointSelector } = useResize();

    const modifyRatingMatrix = (choice, factorName, rating) => {
        let copiedRatingMatrix = {};
        for (let property in ratingMatrix) {
            copiedRatingMatrix[property] = ({ ...ratingMatrix[property] });
        }
        copiedRatingMatrix[choice][factorName] = parseInt(rating);
        setRatingMatrix(copiedRatingMatrix)
    }
    const nextStepClick = (e) => {
        e.preventDefault();
        oldRatingMatrix.current = ratingMatrix;
        upperSetRatingMatrix(ratingMatrix);
        onChangeForm(e, 5);
    }
    const previousStepClick = (e) => {
        e.preventDefault(e);
        oldRatingMatrix.current = ratingMatrix;
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
            return (<span className="text-muted">{`${emojis[parseInt(rating) - 1]}`}</span>)
        return (
            <span className="text-muted">{`${emojis[parseInt(rating) - 1]} ${ratings[parseInt(rating) - 1]}`}</span>
        )
    }

    useEffect(() => {
        setRatingMatrix(getRatingMatrix(choices, factors, oldRatingMatrix.current))
    }, [choices, factors])

    if (!ratingMatrixIsUpdated())
        return <div></div>

    return (
        <form disabled={currentStep === 4} className="d-block card rounded-2 shadow border-0 mb-3">
            <div className="bg-secondary rounded-top rounded-sm py-2 px-3 text-center">
                <span className="text-white">Step 4: Rate your choices</span>
            </div>
            <div className="p-3">
                <div>
                    {
                        GenerateArray(factors.length, (factorI) => {
                            return <div key={factorI}>
                                {Tern(factorI === 0, <div></div>, <hr />)}
                                <h6 className="text-center text-muted">{factors[factorI].name}</h6>
                                <div className="row justify-content-center mt-3">
                                    {
                                        GenerateArray(
                                            choices.length,
                                            (choiceI) => {
                                                const sliderVal = ratingMatrix[choices[choiceI]][factors[factorI].name];
                                                const onChangeVal = (e) => modifyRatingMatrix(choices[choiceI], factors[factorI].name, e.target.value);
                                                return (
                                                    <div key={choiceI} className="d-flex flex-row align-items-center mb-2">
                                                        <div className="container p-0 ">
                                                            <div className="row m-0">
                                                                <span className="col-6 p-0 fw-bold text-center" >{choices[choiceI]}</span>
                                                                <input type="range" className="col-6" min="1" max="5" disabled={currentStep !== 4} value={sliderVal} placeholder={`Enter factor ${choiceI + 1}`} onChange={onChangeVal}></input>
                                                            </div>
                                                        </div>
                                                        <span className={breakpointSelector("", null, "w-50")}>{ratingToWords(sliderVal)}</span>
                                                    </div>);
                                            }
                                        )
                                    }
                                </div>
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
            return <div></div>
        ratingMatrix = previousRatingMatrix.current;
        factors = previousFactors.current;
    }

    const factorsArray = Object.keys(ratingMatrix[optionsArray[0]]);
    const values = GenerateArray(factorsArray.length, (factorI) =>
        GenerateArray(optionsArray.length, (optionI) =>
            ratingMatrix[optionsArray[optionI]][factorsArray[factorI]] * factors.find((v) => v.name === factorsArray[factorI]).rating)
    );
    const onPreviousStep = (e) => {
        previousRatingMatrix.current = ratingMatrix;
        previousFactors.current = factors;
        onChangeForm(e, 4);
    }

    let sums = GenerateArray(optionsArray.length, (optionI) =>
        values.reduce((a, b, factorI) => a + b[optionI], 0));

    let max = sums[0];
    let maxI = 0;
    for (let i = 1; i < sums.length; i++) {
        if (sums[i] > max) {
            max = sums[i];
            maxI = i;
        }
    }

    return (
        <form className="d-block bg-white shadow border-0 mb-3">
            <div className="p-3 p-md-4">
                <p className="fw-bold text-center m-0">Results say you should go for...</p>
                <h1 className="display-1 font-title text-primary text-center">{Object.keys(ratingMatrix)[maxI]}!</h1>
                <hr />
                <div className="">{
                    (breakpointSelector(
                        () => <div>
                            {
                                GenerateArray(optionsArray.length, (i) => {
                                    return <div key={i} className={`text-center ${Tern(i === maxI, "text-success", "")}`}>
                                        {`${optionsArray[i]}: ${sums[i]}`}
                                    </div>
                                })
                            }
                            <hr />
                        </div>
                        , null,
                        () => <table className="w-100 h6 table table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    {GenerateArray(optionsArray.length, (i => {
                                        return <th key={i} className={`text-center py-2 ${Tern(i === maxI, "text-success", "")}`}> {optionsArray[i]}</th>
                                    }
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    GenerateArray(factors.length, (factorI) =>
                                        <tr key={factorI}>
                                            <td>{factors[factorI].name}</td>
                                            {GenerateArray(optionsArray.length, (optionI) => {
                                                return (<td key={optionI} className="text-center py-2">
                                                    {`${values[factorI][optionI]}`}
                                                </td>)
                                            })
                                            }
                                        </tr>)
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    {GenerateArray(optionsArray.length, (optionI) => {
                                        return (<td key={optionI} className={`text-center py-2 fw-bold ${Tern(optionI === maxI, "text-success", "")}`}>
                                            {sums[optionI]}
                                        </td>)
                                    })
                                    }
                                </tr>
                            </tfoot>
                        </table>

                    ))()
                }
                </div>
                <p className={`text-muted fs-6 ${breakpointSelector("text-center", null, "")}`}>Factors set with higher importance contribute more to an option's total score.</p>
                <div className="d-flex flex-row justify-content-center">
                    <button disabled={currentStep !== 5} className="mt-4 w-50 btn btn rounded-1 btn-outline-secondary" onClick={onPreviousStep}><i className="bi bi-skip-backward-fill me-2"></i>Reassess</button>
                    <span className="ps-2"></span>
                    <div />
                </div>
                <small className="text-center o-50 d-block mt-5">The creator of this tool is not liable for any losses of assets that are the result of following suggestions that come from this application. I Can't Decide is a tool for making complicated decisions, not a substitute for any omniscient being.</small>
            </div>
        </form >
    );
}

export { LandingBg, LandingForm1, LandingForm2, LandingForm3, LandingForm4, Results }