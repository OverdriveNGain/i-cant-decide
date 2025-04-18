/**
 * Generate a rating matrix for choices and factors
 * 
 * @param {Array} choices - Array of choices to rate
 * @param {Array} factors - Array of factors with importance ratings
 * @param {Object} oldRatingMatrix - Previous rating matrix if available
 * @returns {Object} New rating matrix with all choices and factors
 */
export const getRatingMatrix = (choices, factors, oldRatingMatrix) => {
    if (!choices || !factors || choices.length === 0 || factors.length === 0)
        return {};

    const newRatingMatrix = {};
    for (const choice of choices) {
        newRatingMatrix[choice] = {};
        for (const factor of factors) {
            // If we have a previous rating for this choice and factor, use it
            if (oldRatingMatrix && oldRatingMatrix[choice] && oldRatingMatrix[choice][factor.name] !== undefined) {
                newRatingMatrix[choice][factor.name] = oldRatingMatrix[choice][factor.name];
            } else {
                // Otherwise use a default value of 5 (middle of the 1-10 scale)
                newRatingMatrix[choice][factor.name] = 5;
            }
        }
    }
    return newRatingMatrix;
};
