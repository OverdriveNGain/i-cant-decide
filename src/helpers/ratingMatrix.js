/**
 * Whether a rating matrix has exactly the same choice and factor keys
 * as the current lists (order-sensitive, matches how the UI builds the matrix).
 *
 * @param {Object} matrix
 * @param {string[]} choices
 * @param {{ name: string }[]} factors
 * @returns {boolean}
 */
export const ratingMatrixMatchesStructure = (matrix, choices, factors) => {
    if (!matrix || typeof matrix !== "object" || !choices?.length || !factors?.length) {
        return false;
    }

    const choiceKeys = Object.keys(matrix);
    if (choiceKeys.length !== choices.length) {
        return false;
    }
    for (let i = 0; i < choices.length; i++) {
        if (choiceKeys[i] !== choices[i]) {
            return false;
        }
    }

    const nested = matrix[choiceKeys[0]];
    if (!nested || typeof nested !== "object") {
        return false;
    }
    const factorKeys = Object.keys(nested);
    if (factorKeys.length !== factors.length) {
        return false;
    }
    for (let i = 0; i < factors.length; i++) {
        if (factorKeys[i] !== factors[i].name) {
            return false;
        }
    }
    return true;
};

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
