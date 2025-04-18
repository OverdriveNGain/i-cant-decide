import React, { useState } from 'react';
import { GenerateArray, Pd, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import { maxChoices } from "../helpers/constants";
import { preventEnterKeySubmission } from "../helpers/utils";

/**
 * Step 1: Form for entering choices/options to compare
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onChangeForm - Function to navigate between forms
 * @param {number} props.currentStep - Current active step
 * @param {Function} props.upperSetChoices - Function to update choices in parent component
 */
const ChoicesForm = ({ onChangeForm, currentStep, upperSetChoices }) => {
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

export default ChoicesForm;
