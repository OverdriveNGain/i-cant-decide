import React from 'react';
import EditableFactorImportance from './EditableFactorImportance.js';
import EditableNormalizedScore from './EditableNormalizedScore.js';

/**
 * Individual Results Card for mobile layout.
 * @param {Object} props
 * @param {string} optionName
 * @param {boolean} isWinner
 * @param {number} normalizedScore
 * @param {number} rawScore
 * @param {Array} factors
 * @param {Array} values
 * @param {number} optionIndex
 * @param {Function} props.onOpenImportance
 * @param {Function} props.onOpenRawRating - (choiceName, factorName) => void
 */
const ResultCard = ({ optionName, isWinner, normalizedScore, rawScore, factors, values, optionIndex, onOpenImportance, onOpenRawRating }) => (
    <div className="col-12 mb-3">
        <div className={`card ${isWinner ? 'border-success' : ''}`}>
            {/* Card header with option name and scores */}
            <div className={`card-header d-flex justify-content-between align-items-center py-2 ${isWinner ? 'bg-success text-white' : ''}`}>
                <h5 className="card-title mb-0">{optionName}</h5>
                <div className="text-end">
                    <div className={`fs-5 fw-bold ${isWinner ? 'text-white' : 'text-success'}`}>{normalizedScore.toFixed(2)}</div>
                    <div className="small opacity-75">Raw: {rawScore.toFixed(2)}</div>
                </div>
            </div>
            
            {/* Card body with factor scores */}
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-sm mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-2 py-1 small">Factor</th>
                                <th className="text-center py-1 small">Importance</th>
                                <th className="text-end pe-2 py-1 small">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factors.map((factor, factorI) => {
                                // Calculate score and color
                                const factorScores = values[factorI];
                                const maxScore = Math.max(...factorScores);
                                const lowerThreshold = maxScore / 3;
                                const upperThreshold = (maxScore * 2) / 3;
                                const score = values[factorI][optionIndex];
                                
                                let textColorClass = "";
                                if (score >= upperThreshold) {
                                    textColorClass = "text-success";
                                } else if (score <= lowerThreshold) {
                                    textColorClass = "text-danger";
                                }
                                
                                // Calculate normalized value
                                const importance = factor.rating;
                                const weighted = values[factorI][optionIndex];
                                const normalized = importance === 0 ? 0 : weighted / importance;
                                
                                return (
                                    <tr key={factorI} className="border-bottom">
                                        <td className="ps-2 py-1 align-middle">{factor.name}</td>
                                        <td className="text-center py-1 align-middle">
                                            <EditableFactorImportance
                                                factorName={factor.name}
                                                rating={factor.rating}
                                                onOpen={onOpenImportance}
                                            />
                                        </td>
                                        <td className="text-end pe-2 py-1 align-middle">
                                            <div className={textColorClass}>{score.toFixed(2)}</div>
                                            <div className="text-muted" style={{ fontSize: '0.65rem' }}>
                                                <EditableNormalizedScore
                                                    normalizedDisplay={normalized.toFixed(2)}
                                                    onOpen={() => onOpenRawRating(optionName, factor.name)}
                                                />
                                                {' × '}
                                                {importance}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default ResultCard;
