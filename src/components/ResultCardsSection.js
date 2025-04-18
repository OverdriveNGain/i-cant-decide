import React from 'react';
import ResultCard from './ResultCard.js';

/**
 * Mobile-friendly card layout for displaying decision results
 * 
 * @param {Object} props - Component props
 * @param {Array} props.optionsArray - Array of choice options
 * @param {Array} props.maxIndices - Array of indices of the highest scoring options
 * @param {Array} props.factors - Array of factors with names and ratings
 * @param {Array} props.values - 2D array of weighted normalized values
 * @param {Array} props.sums - Array of raw scores
 * @param {Array} props.normalizedSums - Array of normalized final scores (0-100)
 * @param {Array} props.sortedIndices - Array of indices sorted by score (low to high)
 */
const ResultCardsSection = ({ 
    optionsArray, 
    maxIndices, 
    factors, 
    values, 
    sums, 
    normalizedSums,
    sortedIndices 
}) => {
    // Create a reversed sorted indices array (highest to lowest)
    const reversedSortedIndices = [...sortedIndices].reverse();
    
    return (
        <div className="d-md-none">
            <div className="row mb-4">
                {reversedSortedIndices.map(optionI => {
                    const optionName = optionsArray[optionI];
                    // Determine if this option is a winner (handles ties and single winner)
                    const isWinner = maxIndices.includes(optionI) && maxIndices.length === 1;
                    return (
                        <ResultCard
                            key={optionI}
                            optionName={optionName}
                            isWinner={isWinner}
                            normalizedScore={normalizedSums[optionI]}
                            rawScore={sums[optionI]}
                            factors={factors}
                            values={values}
                            optionIndex={optionI}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ResultCardsSection;
