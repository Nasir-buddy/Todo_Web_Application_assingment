import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);
      const { token, ...userInfo } = response.data;
      
      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(userInfo);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        login: credentials.email, // email or username
        password: credentials.password
      });
      const { token, ...userInfo } = response.data;
      
      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(userInfo);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    // Remove from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 