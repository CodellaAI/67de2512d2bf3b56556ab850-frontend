'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if user is logged in on initial load
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({ ...parsedUser, token });

        // Set authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = Bearer ${token};
      } catch (error) {
        console.error('Failed to parse user data from cookie', error);
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(${process.env.NEXT_PUBLIC_API_URL}/api/auth/login, {
      email,
      password,
    });

    const { token, user: userData } = response.data;

    // Save to cookies
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    // Update state
    setUser({ ...userData, token });

    // Set authorization header for all future requests
    axios.defaults.headers.common['Authorization'] = Bearer ${token};

    return response.data;
  };

  const signup = async (username, email, password) => {
    const response = await axios.post(${process.env.NEXT_PUBLIC_API_URL}/api/auth/register, {
      username,
      email,
      password,
    });

    return response.data;
  };

  const logout = () => {
    // Remove cookies
    Cookies.remove('token');
    Cookies.remove('user');

    // Update state
    setUser(null);

    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setUser(userData);
    Cookies.set('user', JSON.stringify({
      id: userData.id,
      username: userData.username,
      email: userData.email,
    }), { expires: 7 });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
