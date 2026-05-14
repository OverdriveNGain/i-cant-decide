import React, { useEffect, useMemo, useRef, useContext } from 'react';
import { GenerateArray } from "../helpers/func";
import { preventEnterKeySubmission } from "../helpers/utils";
import { getRatingMatrix, ratingMatrixMatchesStructure } from "../helpers/ratingMatrix";
import useResize from "../hooks/useResize";
import { AppStateContext } from '../contexts/AppStateContext';

/**
 * Step 4: Form for rating each choice on each factor
 * 
 * @param {Function} props.onChangeForm - Function to navigate between forms
 */
const RatingChoicesForm = ({ onChangeForm }) => {
    const { choices, factors, stepData, ratingMatrix, setRatingMatrix } = useContext(AppStateContext);
    const currentStep = stepData[0];

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
    
    const { breakpointSelector } = useResize();
    const modifyRatingMatrix = (choice, factorName, rating) => {
        setRatingMatrix((prev) => {
            const copiedRatingMatrix = {};
            for (const property in prev) {
                copiedRatingMatrix[property] = ({ ...prev[property] });
            }
            if (!copiedRatingMatrix[choice]) copiedRatingMatrix[choice] = {};
            copiedRatingMatrix[choice][factorName] = parseInt(rating, 10);
            return copiedRatingMatrix;
        });
    };
    const nextStepClick = (e) => {
        e.preventDefault();
        oldRatingMatrix.current = ratingMatrix;
        onChangeForm(e, 5);
    }
    const previousStepClick = (e) => {
        e.preventDefault(e);
        oldRatingMatrix.current = ratingMatrix;
        onChangeForm(e, 3);
    }
    const ratingMatrixIsUpdated = () =>
        ratingMatrixMatchesStructure(ratingMatrix, choices, factors);
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

    const choicesFactorsStructureKey = useMemo(
        () => `${choices.join('\0')}|${factors.map((f) => f.name).join('\0')}`,
        [choices, factors]
    );

    // Re-sync matrix when choice/factor *names* change only — not when factor importance (same names) updates.
    useEffect(() => {
        if (!choices.length || !factors.length) {
            return;
        }
        const storedMatrix = window.localStorage.getItem('icd_rating_matrix');
        if (storedMatrix) {
            try {
                const parsedMatrix = JSON.parse(storedMatrix);
                if (ratingMatrixMatchesStructure(parsedMatrix, choices, factors)) {
                    setRatingMatrix(parsedMatrix);
                    return;
                }
            } catch (e) {
                console.error("Error parsing rating matrix from localStorage", e);
            }
        }

        setRatingMatrix((prev) =>
            getRatingMatrix(choices, factors, Object.keys(prev).length > 0 ? prev : oldRatingMatrix.current)
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- choicesFactorsStructureKey encodes choices + factor names
    }, [choicesFactorsStructureKey, setRatingMatrix]);

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
                                                                    <div className="fw-bold text-center rounded-1 px-2" style={{ backgroundColor: "rgb(240, 240, 240)" }}>{choices[choiceI]}</div>
                                                                </span>
                                                                <input type="range" className="col-6 px-2" min="1" max="5" disabled={currentStep !== 4} value={sliderVal} placeholder={`Enter factor ${choiceI + 1}`} onChange={onChangeVal} onKeyDown={preventEnterKeySubmission} />
                                                            </div>
                                                        </div>
                                                        <span className={breakpointSelector("px-2", null, "w-50 text-center px-2")} >
                                                            {breakpointSelector(
                                                                <div>{ratingToWords(sliderVal)}</div>, null,
                                                                <div className="text-center rounded-1 px-2" style={{ backgroundColor: "rgb(240, 240, 240)" }}>{ratingToWords(sliderVal)}</div>
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

export default RatingChoicesForm;
