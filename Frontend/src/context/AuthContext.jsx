import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios.js';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  // Restauration du user au démarrage si token présent
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.get('/user') // Exemple: route Laravel Sanctum /api/user
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error("Erreur récupération user:", err);
        });
    }
  }, []);

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
