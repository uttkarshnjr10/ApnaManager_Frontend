// src/features/auth/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return !!token;
  });

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/users/profile');
      setUser(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        setUser(null);
      } else {
        console.error("Profile check failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Login function - loginType is now optional
   * Backend can auto-detect user role from email
   */
  const login = async (email, password, loginType) => {
    try {
      localStorage.removeItem('authToken'); 

      // Build payload - only include loginType if provided
      const payload = { email, password };
      if (loginType) {
        payload.loginType = loginType;
      }

      const response = await apiClient.post('/auth/login', payload);

      // Successful login (200)
      if (response.status === 200 && response.data?.data) {
        const { _id, username, role, token } = response.data.data;
        
        if (token) {
            localStorage.setItem('authToken', token);
        }

        const userData = { _id, username, role, needsPasswordReset: false };
        setUser(userData);
        return userData;
      }
      
      // Password reset required (202)
      if (response.status === 202) {
         const userId = response.data?.data?.userId;
         const role = response.data?.data?.role;
         if (userId) {
           return { 
             needsPasswordReset: true, 
             _id: userId,
             role 
           };
         }
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
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear Stripe cookies
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
      {children}
    </AuthContext.Provider>
  );
};
