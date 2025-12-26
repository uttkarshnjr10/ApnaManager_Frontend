import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    
    const originalRequestUrl = error.config?.url || '';

    // LOGIC FIX:
    // Only redirect if it's a 401 AND it's NOT from the login page 
    // AND it's NOT from the profile check (loadUser).
    if (error.response && 
        error.response.status === 401 && 
        !originalRequestUrl.includes('/auth/login') && 
        !originalRequestUrl.includes('/users/profile') // <--- ADD THIS LINE
    ) {
      window.location.href = '/login'; 
      toast.error('Session expired. Please log in again.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;