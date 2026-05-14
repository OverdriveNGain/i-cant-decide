/**
 * Preview normalized score (0–1) for one matrix cell after changing its raw 1–5 rating,
 * using the same per-factor min–max logic as Results.
 */
export function previewNormalizedCellForFactor({
    ratingMatrix,
    optionsArray,
    factorName,
    optionName,
    factors,
    draftRawRating,
}) {
    const fac = factors.find((v) => v.name === factorName);
    const importance = fac ? fac.rating : 1;

    const weightedRow = optionsArray.map((opt) => {
        const r = opt === optionName ? draftRawRating : ratingMatrix[opt][factorName];
        return r * importance;
    });

    const min = Math.min(...weightedRow);
    const max = Math.max(...weightedRow);
    const range = max - min;
    const cellWeighted = draftRawRating * importance;

    if (range === 0) {
        return 1;
    }
    return (cellWeighted - min) / range;
}
