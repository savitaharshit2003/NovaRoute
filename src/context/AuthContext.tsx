import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  clearAuthData,
  getToken,
  getUser,
} from '../utils/authStorage';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);
const updateUser = (updatedUser: User) => {
  setUser(updatedUser);
};
  const loadAuthData = async () => {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.log('Auth loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();

      setToken(null);
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
  value={{
    user,
    token,
    loading,
    isAuthenticated: !!token,
    logout,
    updateUser,
  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
};