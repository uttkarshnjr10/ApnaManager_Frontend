import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Start with loading true to prevent "flicker" of login screen
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/users/profile');
      setUser(response.data.data);
    } catch (error) {
      // If it's a 401, it just means the user isn't logged in. 
      // This is normal behavior, so we don't need to log it as an error.
      if (error.response && error.response.status === 401) {
        setUser(null); 
        // We do NOT console.error here
      } else {
        // Genuine errors (like 500 server error) should still be logged
        console.error("Profile check failed:", error);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      // Clean up legacy garbage BEFORE logging in
      localStorage.removeItem('authToken'); 

      const response = await apiClient.post('/auth/login', { email, password });

      // Handle 200 OK
      if (response.status === 200 && response.data?.data) {
        const { _id, username, role } = response.data.data;
        const userData = { _id, username, role, needsPasswordReset: false };
        setUser(userData);
        return userData;
      }
      
      // Handle 202 Password Reset Required
      if (response.status === 202) {
         const userId = response.data?.data?.userId;
         if (userId) return { needsPasswordReset: true, _id: userId };
      }

      throw new Error(response.data?.message || 'Login failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed.';
      throw new Error(msg);
    }
  };

const logout = useCallback(async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error("Logout server-side failed:", error);
    } finally {
        // 1. Clear Your Auth
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 2. NEW: Force Clear Stripe Cookies
        // This loops through all cookies and deletes any starting with '_stripe'
        document.cookie.split(";").forEach((c) => {
            if (c.trim().startsWith('_stripe')) {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            }
        });

        setUser(null);
    }
  }, []);

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};