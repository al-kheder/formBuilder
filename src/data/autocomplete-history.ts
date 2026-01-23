// Autocomplete history management using localStorage
// This allows the forms to remember user inputs across sessions

const STORAGE_KEY_PREFIX = 'autocomplete_history_';

// Get autocomplete history for a specific field
export const getAutocompleteHistory = (fieldName: string): string[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${fieldName}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading autocomplete history:', error);
    return [];
  }
};

// Add a value to autocomplete history for a specific field
export const addToAutocompleteHistory = (fieldName: string, value: string): void => {
  if (!value || !value.trim()) return;

  try {
    const history = getAutocompleteHistory(fieldName);
    const trimmedValue = value.trim();

    // Don't add duplicates
    if (history.includes(trimmedValue)) return;

    // Add to beginning of array
    const updatedHistory = [trimmedValue, ...history].slice(0, 50); // Keep max 50 items

    localStorage.setItem(`${STORAGE_KEY_PREFIX}${fieldName}`, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving to autocomplete history:', error);
  }
};

// Merge predefined options with user history
// User history appears at the top, followed by predefined options
export const mergeOptionsWithHistory = (fieldName: string, predefinedOptions: string[]): string[] => {
  const history = getAutocompleteHistory(fieldName);
  
  // Remove history items that are already in predefined options
  const uniqueHistory = history.filter(item => !predefinedOptions.includes(item));
  
  // Return history first, then predefined options
  return [...uniqueHistory, ...predefinedOptions];
};

// Clear history for a specific field
export const clearAutocompleteHistory = (fieldName: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${fieldName}`);
  } catch (error) {
    console.error('Error clearing autocomplete history:', error);
  }
};

// Clear all autocomplete history
export const clearAllAutocompleteHistory = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all autocomplete history:', error);
  }
};
