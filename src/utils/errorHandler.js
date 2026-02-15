import { toast } from 'react-toastify';

// Track recently shown error messages to prevent duplicates
const recentErrors = new Map();
const ERROR_DEBOUNCE_TIME = 3000; // 3 seconds

/**
 * Extract a user-friendly error message from various error types
 */
export const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }

    // Handle Error objects
    if (error instanceof Error) {
        return error.message;
    }

    // Handle API response errors
    if (error?.message) {
        return error.message;
    }

    // Handle fetch errors
    if (error?.toString) {
        const errorString = error.toString();
        if (errorString !== '[object Object]') {
            return errorString;
        }
    }

    return defaultMessage;
};

/**
 * Show error toast with debouncing to prevent duplicates
 */
export const showErrorToast = (error, context = '') => {
    const message = extractErrorMessage(error);
    const key = `${context}:${message}`;

    // Check if this error was recently shown
    if (recentErrors.has(key)) {
        const lastShown = recentErrors.get(key);
        if (Date.now() - lastShown < ERROR_DEBOUNCE_TIME) {
            console.log('Debounced duplicate error:', message);
            return; // Skip showing duplicate error
        }
    }

    // Show the error and track it
    recentErrors.set(key, Date.now());
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    // Clean up old entries after debounce time
    setTimeout(() => {
        recentErrors.delete(key);
    }, ERROR_DEBOUNCE_TIME);
};

/**
 * Retry a fetch request with exponential backoff
 */
export const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // If response is ok, return it
            if (response.ok) {
                return response;
            }

            // Parse error response
            const contentType = response.headers.get('content-type');
            let errorData;

            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = { message: `Server error: ${response.status} ${response.statusText}` };
            }

            // For 500 errors, retry with backoff
            if (response.status === 500 && attempt < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Max 5 seconds
                console.log(`Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // For other errors or final attempt, throw
            throw errorData;

        } catch (error) {
            lastError = error;

            // Network errors - retry
            if (error.name === 'TypeError' && attempt < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
                console.log(`Network error, retrying after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // If it's the last attempt or non-retryable error, throw
            if (attempt === maxRetries) {
                throw lastError;
            }
        }
    }

    throw lastError;
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, context = 'API Request') => {
    console.error(`${context} error:`, error);

    // Extract and show user-friendly message
    let message = extractErrorMessage(error);

    // Add context for network errors
    if (error.name === 'TypeError' || message.includes('Failed to fetch')) {
        message = 'Unable to connect to server. Please check your internet connection.';
    }

    showErrorToast(message, context);
};

/**
 * Safe API call wrapper with error handling and retry
 */
export const safeApiCall = async (url, options = {}, context = 'API Request', maxRetries = 2) => {
    try {
        const response = await fetchWithRetry(url, options, maxRetries);
        const data = await response.json();

        if (data.status === 'success') {
            return { success: true, data: data.data };
        } else {
            showErrorToast(data.message || 'Request failed', context);
            return { success: false, error: data.message };
        }
    } catch (error) {
        handleApiError(error, context);
        return { success: false, error: extractErrorMessage(error) };
    }
};
