import { faL } from '@fortawesome/free-solid-svg-icons';
import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    
    
    useEffect(() => {
      const storedRole = localStorage.getItem('role');
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    
      // Csak akkor állítjuk be a bejelentkezési állapotot, ha még nem lett beállítva
      if (storedRole && storedIsLoggedIn === 'true') {
        setIsLoggedIn(true);
      }
    }, []);

    
    

    const login = (userId, token, role) => {  
          setIsLoggedIn(true);   
          setUserId(userId);
          setToken(token);
          setRole(role);
          localStorage.setItem('userId', userId);
          localStorage.setItem('role', role);
          localStorage.setItem('isLoggedIn', true);
          
  };
  
    const logout = () => {
        setIsLoggedIn(false);
        setUserId('');
        setToken('');
        setRole('user');
        
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isLoggedIn');
    };

    
  
    // Visszaadjuk a Context Provider-t, hogy a gyermek komponensek hozzáférjenek a globális állapotokhoz és műveletekhez
    return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, role, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

 
  
  // Hook, amely lehetővé teszi az AuthContext használatát a komponensekben
  export const useAuth = () => useContext(AuthContext);