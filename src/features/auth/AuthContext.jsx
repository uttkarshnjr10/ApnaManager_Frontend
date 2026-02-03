import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. SMART INITIALIZATION (The Fix)
  // Check LocalStorage immediately. 
  // If no token exists, we are NOT loading. We are just a guest.
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return !!token; // true if token exists, false if not
  });

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');

    // 2. IMMEDIATE EXIT
    // If we don't have a token, don't wake up the backend.
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // 3. VERIFY TOKEN (Only if it exists)
    try {
      const response = await apiClient.get('/users/profile');
      setUser(response.data.data);
    } catch (error) {
      // If token is invalid (401), clear it
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        setUser(null);
      } else {
        console.error("Profile check failed:", error);
        // We don't clear user on 500s, in case it's just a server blip
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password, loginType = 'Hotel') => {
    try {
      localStorage.removeItem('authToken'); 

      const response = await apiClient.post('/auth/login', { 
        email, 
        password,
        loginType 
      });

      if (response.status === 200 && response.data?.data) {
        const { _id, username, role, token } = response.data.data;
        
        // Save token immediately
        if (token) {
            localStorage.setItem('authToken', token);
        }

        const userData = { _id, username, role, needsPasswordReset: false };
        setUser(userData);
        return userData;
      }
      
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

  // 4. REMOVE BLOCKER
  // We render children immediately. 
  // - Public pages will show instantly.
  // - Protected pages will be caught by ProtectedRoute (which shows the spinner).
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};