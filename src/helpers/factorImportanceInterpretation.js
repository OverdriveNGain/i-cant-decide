import React from 'react';

const PHRASES = [
    '...is not that important',
    '...is a bit important',
    '...is somewhat important',
    '...is important',
    '...is very important',
];

/**
 * Text for factor importance (1–5) used in step 3 and the results importance dialog.
 */
export function renderFactorImportanceInterpretation(rating) {
    const n = parseInt(rating, 10);
    const i = Number.isNaN(n) ? 2 : Math.min(PHRASES.length - 1, Math.max(0, n - 1));
    return <span>{PHRASES[i]}</span>;
}
