import React from 'react';

/**
 * Underlined normalized factor score; click opens edit flow for the underlying raw (1–5) rating.
 */
const EditableNormalizedScore = ({ normalizedDisplay, onOpen, className = '' }) => (
    <button
        type="button"
        className={`p-0 border-0 bg-transparent text-muted text-decoration-underline align-baseline ${className}`.trim()}
        style={{ cursor: 'pointer' }}
        onClick={onOpen}
    >
        {normalizedDisplay}
    </button>
);

export default EditableNormalizedScore;
