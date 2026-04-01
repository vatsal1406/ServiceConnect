import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../services/api/axiosConfig';
import { loginUser, signupUser, logoutUser } from '../services/api/authAPI';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.post('/auth/refresh');
      const { user, accessToken } = res.data;

      setAccessToken(accessToken);
      setUser(user);
      setToken(accessToken);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data) => {
    const response = await loginUser(data);
    setAccessToken(response.accessToken);
    setUser(response.user);
    setToken(response.accessToken);
    return response;
  };

  const signup = async (data) => {
    return await signupUser(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout request failed", err);
    }
    setAccessToken(null);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
