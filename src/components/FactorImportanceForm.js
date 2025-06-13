import React, { useState, useEffect, useRef } from 'react';
import { GenerateArray, Tern } from "../helpers/func";
import { preventEnterKeySubmission } from "../helpers/utils";

/**
 * Step 3: Form for rating the importance of each factor
 * 
 * @param {Object} props - Component props
 * @param {Array} props.initialFactors - Initial factors from parent component
 * @param {Function} props.onChangeForm - Function to navigate between forms
 * @param {number} props.currentStep - Current active step
 * @param {Function} props.upperSetFactors - Function to update factors in parent component
 */
const FactorImportanceForm = ({ initialFactors, onChangeForm, currentStep, upperSetFactors }) => {
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
            "...is a bit important",
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
    
    // Initialize factors from various sources and update when initialFactors change
    useEffect(() => {
        // Always update factors when initialFactors change
        if (initialFactors && initialFactors.length > 0) {
            // If we have lastFactors from previous navigation, merge them with initialFactors
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
                // Reset lastFactors after using it to prevent stale data
                lastFactors.current = null;
                return;
            }
            
            // Otherwise, use initialFactors directly
            setFactors(initialFactors);
        }
    }, [initialFactors]) // Only depend on initialFactors changes

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
                                        <div className="p-0 w-100 text-end text-center rounded-1" style={{ backgroundColor: "rgb(240, 240, 240)", lineHeight: "1.2" }}> <span className="fw-bold">{factors[index].name}</span>...</div>
                                    </span>
                                    <input className="px-2-0 col-6 col-md-3" type="range" min="1" max="5" disabled={currentStep !== 3} value={factors[index].rating} placeholder={`Enter factor ${index + 1}`} onChange={(e) => onFactorRatingChange(e, factors[index].name)} onKeyDown={preventEnterKeySubmission} />
                                    <span className="col-12 col-md-6 px-2 pt-2 pb-3 py-md-0">
                                        <div className="p-0 text-center w-100 rounded-1" style={{ backgroundColor: "rgb(240, 240, 240)", lineHeight: "1.2" }}>{ratingToWords(factors[index].rating)}</div>
                                    </span>
                                </div>
                            )
                        }
                    </div>
                    <div className="row">
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 3} className="w-100 btn rounded-1 btn-outline-secondary" onClick={lastStepClick}><i className="bi bi-arrow-left me-2" />Previous Step</button>
                        </div>
                        <div className="mt-2 col-12 col-md-6 px-0 px-md-2 pb-md-2">
                            <button disabled={currentStep !== 3} className="w-100 btn rounded-1 btn-primary text-white" onClick={nextStepClick}><i className="bi bi-arrow-right me-2" />Next Step</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default FactorImportanceForm;
