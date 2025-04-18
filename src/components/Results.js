import React, { useRef } from 'react';
import { GenerateArray, Tern } from "../helpers/func";
import useResize from "../hooks/useResize";
import ResultCardsSection from "./ResultCardsSection";

/**
 * Results component to display the final decision scores and recommendations
 * 
 * @param {Object} props - Component props
 * @param {Object} props.ratingMatrix - Matrix of ratings for each choice on each factor
 * @param {Array} props.factors - Array of factors with importance ratings
 * @param {Function} props.onChangeForm - Function to navigate between forms
 * @param {number} props.currentStep - Current active step
 */
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
        return Math.round(sum * 100) / 100; // Round to 2 decimal places
    });
    
    // Calculate scores on a scale where highest is 100
    const rawMax = Math.max(...sums);
    
    // Scale scores proportionally so highest is 100
    let normalizedSums = sums.map(score => {
        // If all scores are the same or max is 0, return 100 for all
        if (rawMax === 0 || sums.every(s => s === sums[0])) return 100;
        // Otherwise scale proportionally where highest is 100
        return Math.round((score / rawMax) * 10000) / 100; // Round to 2 decimal places
    });

    // Create a sorted index array based on normalizedSums (lowest to highest)
    const sortedIndices = Array.from({ length: normalizedSums.length }, (_, i) => i)
        .sort((a, b) => normalizedSums[a] - normalizedSums[b]);
    
    // Find the max score indices
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
                            <p className="mt-2">Results say you should go for...</p>
                            <h1 className="display-1 font-title text-primary">{Object.keys(ratingMatrix)[maxIndices[0]]}!</h1>
                        </div>

                    const allMax = maxIndices.length === optionsArray.length
                    return <div>
                        <p className="mt-2">Results say you should go for {Tern(allMax, "all", maxIndices.length)} of your options.</p>
                        <p className="mt-2 fw-bold">{Tern(allMax, "All", "Some")} of your options got the same score. Trying reassessing some of your factors?</p>
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
                                    {sortedIndices.map(i => {
                                        return <th key={i} className="text-center">
                                            <span className={`${Tern(maxIndices.some((v) => i === v && maxIndices.length === 1), "text-success fw-bold", "")}`}>
                                                {optionsArray[i]}
                                            </span>
                                        </th>
                                    })}
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
                                            {sortedIndices.map(optionI => {
                                                return (
                                                    <td key={optionI} className="text-center">
                                                        {(() => {
                                                            // Get all scores for this factor
                                                            const factorScores = values[factorI];
                                                            // Find the maximum score for this factor
                                                            const maxScore = Math.max(...factorScores);
                                                            // Calculate thresholds based on max value
                                                            const lowerThreshold = maxScore / 3;
                                                            const upperThreshold = (maxScore * 2) / 3;
                                                            const score = values[factorI][optionI];
                                                            
                                                            // Determine text color based on score relative to max
                                                            let textColorClass = "";
                                                            if (score >= upperThreshold) {
                                                                textColorClass = "text-success";
                                                            } else if (score <= lowerThreshold) {
                                                                textColorClass = "text-danger";
                                                            }
                                                            
                                                            return (
                                                                <>
                                                                    <div className={`mb-0 ${textColorClass}`}>{score.toFixed(2)}</div>
                                                                    <div className="text-muted" style={{ fontSize: '0.7rem', lineHeight: '1', marginTop: '-2px' }}>
                                                                        {normalizedValues[factorI][optionI].toFixed(2)} × {factors[factorI].rating}
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
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
                                    {sortedIndices.map(optionI => {
                                        return (
                                            <td key={optionI} className="text-center text-muted">
                                                {sums[optionI].toFixed(2)}
                                            </td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    <td className="text-start fw-bold">Final Score</td>
                                    <td className="text-center">-</td>
                                    {sortedIndices.map(optionI => {
                                        return (
                                            <td key={optionI} className={`text-center fw-bold ${Tern(maxIndices.some((v) => optionI === v && maxIndices.length === 1), "text-success", "")}`}>
                                                {normalizedSums[optionI].toFixed(2)}
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
                        sortedIndices={sortedIndices}
                    />
                
                </div>
                <p className="text-muted fs-6 text-center">Factors set with higher importance contribute more to an option's total score.</p>
                <div className="d-flex flex-row justify-content-center">
                    <button disabled={currentStep !== 5} className="mt-4 w-75 btn btn rounded-1 btn-outline-secondary" onClick={onPreviousStep}><i className="bi bi-arrow-left me-2"></i>Update Ratings</button>
                    <span className="ps-2"></span>
                    <div />
                </div>
                <small className="text-center o-50 d-block mt-5">This application is provided for informational purposes only. The decisions you make based on the results are your sole responsibility. The creators and maintainers of this tool make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information provided. Any reliance you place on such information is strictly at your own risk.</small>
            </div>
        </form>
    );
};

export default Results;
