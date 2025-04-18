/**
 * Helper function to prevent form submission when Enter key is pressed
 * @param {Event} e - The keyboard event
 */
export const preventEnterKeySubmission = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};
