import { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persistent session check: runs when the app loads
  useEffect(() => {
    API.get('/api/v1/auth/me') 
      .then((res) => setUser(res.data.user || res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
  const res = await API.post('/api/v1/auth/login', { email, password });
  const token = res.data.token;
  localStorage.setItem('token', token);
  setUser(res.data.user || res.data);
  };

  const register = async (username, email, password) => {
    await API.post('/api/v1/auth/register', { username, email, password });
  };

  const logout = async () => {
  await API.post('/api/v1/auth/logout');
  localStorage.removeItem('token');
  setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
