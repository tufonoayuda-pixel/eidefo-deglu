"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth(); // Use the auth context

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    if (!username || !password) {
      setErrorMessage('Por favor, ingrese usuario y contraseña.');
      return;
    }

    // Simulate API call for authentication
    if (username === 'test' && password === 'password') {
      login(username); // Pass the username (email) to the login function
      toast.success('¡Bienvenido al Sistema EIDEFO!');
      // Redirection is now handled by the useEffect in App.tsx or this component
    } else {
      setErrorMessage('Credenciales incorrectas. Por favor, inténtelo nuevamente.');
      toast.error('Credenciales incorrectas.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="login-container bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="logo text-right mb-6">
          <div className="h-10 ml-auto flex items-center text-xl font-bold text-gray-800">
            🧠👅MiFonoConsulta
          </div>
        </div>
        <h2 className="form-title text-2xl font-semibold text-center mb-6 text-gray-800">INGRESO SISTEMA EIDEFO</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-4">
            <Label htmlFor="username" className="sr-only">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ingresar usuario..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="input-group mb-6">
            <Label htmlFor="password" className="sr-only">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresar contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          {errorMessage && (
            <p className="error-message text-red-600 text-sm text-center mb-4">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full p-3 bg-efodea-blue text-white font-medium rounded-lg hover:bg-efodea-blue-hover transition-colors">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;