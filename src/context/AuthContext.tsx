"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  professionalName: string | null; // Changed from userEmail
  establishmentType: string | null; // New field
  login: (professionalName: string, establishmentType: string) => void; // Modified login signature
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [professionalName, setProfessionalName] = useState<string | null>(() => {
    return localStorage.getItem('professionalName'); // Initialize from localStorage
  });
  const [establishmentType, setEstablishmentType] = useState<string | null>(() => {
    return localStorage.getItem('establishmentType'); // Initialize from localStorage
  });

  const login = (name: string, type: string) => {
    setIsLoggedIn(true);
    setProfessionalName(name);
    setEstablishmentType(type);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('professionalName', name);
    localStorage.setItem('establishmentType', type);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setProfessionalName(null);
    setEstablishmentType(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('professionalName');
    localStorage.removeItem('establishmentType');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, professionalName, establishmentType, login, logout }}>
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