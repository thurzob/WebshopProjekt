import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
  
    useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        setIsLoggedIn(true);
      }
    }, []);

    const login = (userId, token) => {
      setIsLoggedIn(true);
      setUserId(userId);
      setToken(token);
      localStorage.setItem('userId', userId);
    };
  
    const logout = () => {
      setIsLoggedIn(false);
      setUserId('');
      setToken('');
      localStorage.removeItem('userId');
    };
  
    // Visszaadjuk a Context Provider-t, hogy a gyermek komponensek hozzáférjenek a globális állapotokhoz és műveletekhez
    return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Hook, amely lehetővé teszi az AuthContext használatát a komponensekben
  export const useAuth = () => useContext(AuthContext, AuthProvider);