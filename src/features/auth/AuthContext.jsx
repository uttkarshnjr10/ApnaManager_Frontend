import { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';

// Export the Context so the hook can use it
export const AuthContext = createContext(null); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/users/profile'); 
      setUser(response.data.data);
    } catch (error) {
      // 401 is expected if not logged in. Do nothing, just set user null.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      if (response.status === 200 && response.data?.data) {
        const { _id, username, role } = response.data.data; 
        if (_id && username && role) {
          const userData = { _id, username, role, needsPasswordReset: false }; 
          setUser(userData);
          return userData; 
        } else {
          throw new Error('Login successful but user data is incomplete.');
        }
      }
  
      if (response.status === 202) {
         const userId = response.data?.data?.userId;
         if (userId) return { needsPasswordReset: true, _id: userId };
         throw new Error('Password reset required, but user ID is missing.');
      }

      throw new Error(`Unexpected server response: ${response.status}`);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
    }
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};