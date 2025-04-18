import React, { useState } from 'react';
import { GenerateArray, Pd, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import { maxFactors } from "../helpers/constants";
import { preventEnterKeySubmission } from "../helpers/utils";

/**
 * Step 2: Form for entering factors to evaluate choices on
 * 
 * @param {Object} props - Component props
 * @param {Function} props.upperSetFactors - Function to update factors in parent component
 * @param {Function} props.onChangeForm - Function to navigate between forms
 * @param {number} props.currentStep - Current active step
 * @param {Array} props.existingFactors - Existing factors from parent component
 */
const FactorsForm = ({ upperSetFactors, onChangeForm, currentStep, existingFactors }) => {
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

export default FactorsForm;
