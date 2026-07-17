// src/features/auth/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Always start loading — the profile API call (backed by httpOnly cookie) is the single source of truth
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/users/profile');
      setUser(response.data.data);
    } catch (error) {
      // 401 means no valid session — user is simply not logged in
      if (error.response && error.response.status === 401) {
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
      // Build payload - only include loginType if provided
      const payload = { email, password };
      if (loginType) {
        payload.loginType = loginType;
      }

      const response = await apiClient.post('/auth/login', payload);

      // Successful login (200)
      if (response.status === 200 && response.data?.data) {
        const { _id, username, role } = response.data.data;

        const userData = { _id, username, role, needsPasswordReset: false };
        setUser(userData);
        return userData;
      }
      
      // Password reset required (202)
      if (response.status === 202) {
         const requiresTOTP = response.data?.data?.requiresTOTP;
         if (requiresTOTP) {
           return {
             requiresTOTP: true,
             preAuthToken: response.data.data.preAuthToken
           };
         }

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

  const completeTOTPLogin = async (preAuthToken, code) => {
    try {
      const response = await apiClient.post('/auth/admin/totp/login', { preAuthToken, code });
      if (response.status === 200 && response.data?.data) {
        const { _id, username, role } = response.data.data;
        const userData = { _id, username, role, needsPasswordReset: false };
        setUser(userData);
        return userData;
      }
      throw new Error(response.data?.message || 'Verification failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Verification failed.';
      throw new Error(msg);
    }
  };

  const logout = useCallback(async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error("Logout server-side failed:", error);
    } finally {
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

  const value = { user, login, logout, loading, completeTOTPLogin };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
