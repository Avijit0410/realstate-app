import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (mobileNumber, password) => {
    try {
      console.log('Attempting login with:', { mobileNumber });
      
      const res = await axios.post('/api/auth/login', {
        mobileNumber,
        password
      });

      console.log('Login response:', res.data);

      if (!res.data.token || !res.data.user) {
        console.error('Invalid response format:', res.data);
        return false;
      }

      const { token, user } = res.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Create consistent user object
      const userData = {
        id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        role: user.role,
        image: user.image ? `${process.env.REACT_APP_API_URL || ''}${user.image}` : null,
        address: user.address
      };

      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.error || 'Login failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up request');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      const userData = res.data;
      
      // Create consistent user object
      setUser({
        id: userData._id,
        name: userData.name,
        mobileNumber: userData.mobileNumber,
        role: userData.role,
        image: userData.image ? `${process.env.REACT_APP_API_URL || ''}${userData.image}` : null,
        address: userData.address
      });
    } catch (error) {
      console.error('Auth check error:', error.response?.data || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 