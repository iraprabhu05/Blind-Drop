
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserType = 'user' | 'artist' | null;

interface AuthContextType {
  userType: UserType;
  isLoggedIn: boolean;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (type: UserType) => {
    setUserType(type);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserType(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userType, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
