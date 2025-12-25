"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const LoginPage = () => {
  const [professionalName, setProfessionalName] = useState('');
  const [establishmentType, setEstablishmentType] = useState<string | undefined>(undefined);
  const [securityAnswer, setSecurityAnswer] = useState('');
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

    if (!professionalName || !establishmentType || !securityAnswer) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    // Validate security question
    if (securityAnswer.toLowerCase() === 'disfagia') {
      login(professionalName, establishmentType); // Pass professional name and establishment type
      toast.success('¡Bienvenido al Sistema EIDEFO!');
      // Redirection is now handled by the useEffect in this component
    } else {
      setErrorMessage('Respuesta incorrecta a la pregunta de seguridad. Por favor, inténtelo nuevamente.');
      toast.error('Respuesta incorrecta.');
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
            <Label htmlFor="professionalName" className="block text-gray-700 font-medium mb-2">Nombre del profesional</Label>
            <Input
              id="professionalName"
              type="text"
              placeholder="Ingresar nombre completo"
              value={professionalName}
              onChange={(e) => setProfessionalName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="input-group mb-4">
            <Label htmlFor="establishmentType" className="block text-gray-700 font-medium mb-2">Tipo de establecimiento</Label>
            <Select onValueChange={setEstablishmentType} value={establishmentType}>
              <SelectTrigger id="establishmentType" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <SelectValue placeholder="Seleccionar tipo de establecimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Centro de salud familiar">Centro de salud familiar</SelectItem>
                <SelectItem value="Hospital">Hospital</SelectItem>
                <SelectItem value="Atención particular">Atención particular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="input-group mb-6">
            <Label htmlFor="securityAnswer" className="block text-gray-700 font-medium mb-2">¿A qué condición corresponde la incapacidad para tragar secreciones, alimentos y/o líquidos?</Label>
            <Input
              id="securityAnswer"
              type="text"
              placeholder="Ingresar respuesta"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
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