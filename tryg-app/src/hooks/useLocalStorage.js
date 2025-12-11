import { useState, useEffect } from 'react';

// Check if localStorage is available (private browsing, quota exceeded, etc.)
const isLocalStorageAvailable = () => {
    try {
        const testKey = '__localStorage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

const storageAvailable = isLocalStorageAvailable();

export function useLocalStorage(key, initialValue) {
    // Get stored value or use initial
    const [storedValue, setStoredValue] = useState(() => {
        if (!storageAvailable) {
            console.warn('localStorage not available, using in-memory storage');
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when value changes
    useEffect(() => {
        if (!storageAvailable) return; // Graceful degradation - just use state
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export { isLocalStorageAvailable };
export default useLocalStorage;
