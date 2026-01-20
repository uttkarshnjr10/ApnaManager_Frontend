import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable or fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Critical for Cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequestUrl = error.config?.url || '';

    // LOGIC: Handle Session Expiry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequestUrl.includes('/auth/login') && // Don't redirect if login failed
      !originalRequestUrl.includes('/auth/logout') && // Don't redirect if logout failed
      !originalRequestUrl.includes('/users/profile') // Don't redirect on initial load check
    ) {
      // Prevent multiple toasts if multiple requests fail at once
      if (!window.hasShownSessionToast) {
        toast.error('Session expired. Please log in again.');
        window.hasShownSessionToast = true;
        
        // Brief timeout to reset the toast flag
        setTimeout(() => { window.hasShownSessionToast = false; }, 3000);
        
        // Optional: clear local storage here too as a failsafe
        localStorage.removeItem('authToken');
        
        // Redirect
        window.location.href = '/login';
      }
    }

    // Generic server error handling (Optional but good for Prod)
    if (error.response && error.response.status >= 500) {
      console.error('Server Error:', error.response.data);
      // toast.error('Something went wrong on the server.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;