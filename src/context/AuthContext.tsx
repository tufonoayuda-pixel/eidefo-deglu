"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null; // Add userEmail to the context type
  login: (email: string) => void; // Modify login to accept email
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail'); // Initialize userEmail from localStorage
  });

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email); // Set user email
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email); // Store user email in localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null); // Clear user email
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail'); // Remove user email from localStorage
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
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