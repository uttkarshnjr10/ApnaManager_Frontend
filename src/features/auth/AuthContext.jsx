import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/users/profile');
      setUser(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUser(null);
      } else {
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

  // UPDATED: Now accepts loginType (Role Hint)
  const login = async (email, password, loginType = 'Hotel') => {
    try {
      localStorage.removeItem('authToken'); 

      // Send the hint to the backend to speed up the query
      const response = await apiClient.post('/auth/login', { 
        email, 
        password,
        loginType 
      });

      if (response.status === 200 && response.data?.data) {
        const { _id, username, role } = response.data.data;
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