import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // tu pourras appeler ici l’API /user si tu veux charger le profil
      setUser({}); // pour l’instant on simule
    }
  }, [token]);

  const login = (token, userData = {}) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
