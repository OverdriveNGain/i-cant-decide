// Local storage keys
export const STORAGE_KEYS = {
    CHOICES: 'icd_choices',
    FACTORS: 'icd_factors',
    RATING_MATRIX: 'icd_rating_matrix',
    STEP_DATA: 'icd_step_data'
};

/**
 * Save data to localStorage
 * @param {string} key - The key to store the data under
 * @param {any} data - The data to store
 */
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving to localStorage: ${error}`);
    }
};

/**
 * Retrieve data from localStorage
 * @param {string} key - The key to retrieve data from
 * @param {any} defaultValue - The default value to return if the key doesn't exist
 * @returns {any} The retrieved data or the default value
 */
export const getFromLocalStorage = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage: ${error}`);
        return defaultValue;
    }
};

/**
 * Clear all application data from localStorage
 */
export const clearAllStoredData = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.error(`Error clearing localStorage: ${error}`);
    }
};

/**
 * Determine the appropriate starting step based on saved data
 * @returns {Array} An array containing [currentStep, maxStep]
 */
export const determineStartingStep = () => {
    const savedStepData = getFromLocalStorage(STORAGE_KEYS.STEP_DATA, [1, 1]);
    const savedChoices = getFromLocalStorage(STORAGE_KEYS.CHOICES, []);
    const savedFactors = getFromLocalStorage(STORAGE_KEYS.FACTORS, []);
    const savedRatingMatrix = getFromLocalStorage(STORAGE_KEYS.RATING_MATRIX, []);
    
    // Determine which step to start at based on saved data
    if (savedStepData[0] > 1) {
        return savedStepData; // Use saved step data if it exists
    } else if (savedRatingMatrix && Object.keys(savedRatingMatrix).length > 0) {
        return [5, 5]; // Go to results if we have rating matrix
    } else if (savedFactors && savedFactors.length > 0) {
        return [3, 3]; // Go to factor importance if we have factors
    } else if (savedChoices && savedChoices.length > 0) {
        return [2, 2]; // Go to factors if we have choices
    } else {
        return [1, 1]; // Start from beginning
    }
};
