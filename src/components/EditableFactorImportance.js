import React from 'react';

/**
 * Underlined importance value; click opens the parent’s edit flow (e.g. modal).
 */
const EditableFactorImportance = ({ factorName, rating, onOpen, className = '' }) => (
    <button
        type="button"
        className={`p-0 border-0 bg-transparent text-body text-decoration-underline align-baseline ${className}`.trim()}
        style={{ cursor: 'pointer' }}
        onClick={() => onOpen(factorName)}
    >
        {rating}
    </button>
);

export default EditableFactorImportance;
