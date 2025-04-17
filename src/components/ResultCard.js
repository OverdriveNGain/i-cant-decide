import React from 'react';

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
 */
const ResultCard = ({ optionName, isWinner, normalizedScore, rawScore, factors, values, optionIndex }) => (
    <div className="col-12 mb-3">
        <div className={`card ${isWinner ? 'border-success' : ''}`}>
            <div className={`card-header ${isWinner ? 'bg-success text-white' : ''}`}>
                <h5 className="card-title mb-0">{optionName}</h5>
            </div>
            <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <span className="fw-bold">Final Score:</span>
                    <span className={`fs-5 ${isWinner ? 'text-success fw-bold' : ''}`}>{normalizedScore}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom text-muted small">
                    <span>Raw Score:</span>
                    <span>{rawScore}</span>
                </div>
                <div className="mt-3">
                    <p className="mb-2 small fw-bold">Factor Scores:</p>
                    {factors.map((factor, factorI) => (
                        <div key={factorI} className="d-flex justify-content-between align-items-center mb-1 small">
                            <div className="d-flex align-items-center">
                                <span>{factor.name}</span>
                                <span
                                    className="badge px-2 py-1 rounded-pill fw-semibold ms-1"
                                    style={{
                                        background: "#f0f4fa",
                                        color: "#205081",
                                        border: "1px solid #b3c5e6",
                                        fontSize: "0.85em",
                                        letterSpacing: "0.02em"
                                    }}
                                >
                                    {factor.rating}
                                </span>
                            </div>
                            <div className="text-end">
                                <div className="text-muted small mb-0" style={{ fontSize: '0.75em', marginBottom: '2px' }}>
                                    {(() => {
                                        const importance = factor.rating;
                                        const weighted = values[factorI][optionIndex];
                                        const normalized = importance === 0 ? 0 : weighted / importance;
                                        return importance > 0
                                            ? `${importance} × ${normalized.toFixed(2)} =`
                                            : `0`;
                                    })()}
                                </div>
                                <span>{values[factorI][optionIndex].toFixed(1)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default ResultCard;
