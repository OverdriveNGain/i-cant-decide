import React, { useState, useEffect, useContext } from 'react';
import { GenerateArray, Pd, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import { maxFactors } from "../helpers/constants";
import { preventEnterKeySubmission } from "../helpers/utils";
import { AppStateContext } from '../contexts/AppStateContext';

const factorNameRaw = (f) => (typeof f === 'string' ? f : (f && f.name) || '') || '';

const toFactorObjects = (list) =>
    list.map((f) =>
        typeof f === 'string'
            ? { name: f.trim(), rating: 3 }
            : { name: factorNameRaw(f).trim(), rating: f.rating ?? 3 }
    );

/**
 * Step 2: Form for entering factors to evaluate choices on
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onChangeForm - Function to navigate between forms
 */
const FactorsForm = ({ onChangeForm }) => {
    const { breakpointSelector } = useResize();

    const { factors, setFactors, stepData } = useContext(AppStateContext);
    const currentStep = stepData[0];

    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (currentStep === 2 && factors.length === 0) {
            setFactors([{ name: '', rating: 3 }, { name: '', rating: 3 }]);
        }
    }, [currentStep, factors.length, setFactors]);

    const onFactorRemove = (e, i) => { Pd(e, () => { setFactors(factors.filter((v, j) => j !== i)) }) }
    const onFactorNew = (e) => { Pd(e, () => { setFactors([...factors, { name: '', rating: 3 }]) }) }
    const onFactorChange = (e, index) => {
        const v = e.target.value;
        setFactors(factors.map((f, i) => {
            if (i !== index) return typeof f === 'string' ? { name: f, rating: 3 } : { ...f };
            return typeof f === 'string' ? { name: v, rating: 3 } : { ...f, name: v };
        }));
    };

    const nextStepClick = (e) => {
        const duplicatesExist = () => {
            const tester = {};
            for (const f of factors) {
                const n = factorNameRaw(f).trim();
                if (tester[n] == null)
                    tester[n] = true;
                else
                    return true;
            }
            return false;
        }

        e.preventDefault();
        if (factors.some((f) => factorNameRaw(f).trim().length === 0))
            setErrorMessage("Please fill out all blank fields")
        else if (duplicatesExist())
            setErrorMessage("Remove any duplicate factors")
        else {
            setErrorMessage("")
            setFactors(toFactorObjects(factors));
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
                                            <input disabled={currentStep !== 2} className="d-inline-block form-control form-control rounded-1" style={{ paddingRight: Tern(optional, "2.2em", "0em") }} value={factorNameRaw(factors[index])} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorChange(e, index)} onKeyDown={preventEnterKeySubmission} />
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
