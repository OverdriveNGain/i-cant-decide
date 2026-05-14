import React from 'react';

const EMOJIS = ['🤮', '😒', '😐', '😋', '🤩'];
const LABELS = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];

function clampIndex(rating) {
    const n = parseInt(rating, 10);
    if (Number.isNaN(n)) return 2;
    return Math.min(EMOJIS.length - 1, Math.max(0, n - 1));
}

/**
 * Renders the same 1–5 interpretation as step 4 (emoji + Very Bad … Excellent).
 * @param {number|string} rating
 * @param {boolean} compact - emoji only (narrow / mobile)
 */
export function renderFivePointInterpretation(rating, compact) {
    const i = clampIndex(rating);
    if (compact) return <span className="text-muted">{EMOJIS[i]}</span>;
    return (
        <span>{`${EMOJIS[i]} ${LABELS[i]}`}</span>
    );
}
