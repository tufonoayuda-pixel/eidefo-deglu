"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import FallingDeglutitionIcons from '@/components/FallingDeglutitionIcons'; // New import

const LoginPage = () => {
  const [professionalName, setProfessionalName] = useState('');
  const [establishmentType, setEstablishmentType] = useState<string | undefined>(undefined);
  const [specificEstablishmentName, setSpecificEstablishmentName] = useState(''); // New state for specific name
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!professionalName || !establishmentType || !securityAnswer) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    // Validate specific establishment name if applicable
    if ((establishmentType === 'Centro de salud familiar' || establishmentType === 'Hospital') && !specificEstablishmentName.trim()) {
      setErrorMessage('Por favor, especifique el nombre del establecimiento.');
      return;
    }

    if (securityAnswer.toLowerCase() === 'disfagia') {
      let finalEstablishmentType = establishmentType;
      if (establishmentType === 'Centro de salud familiar' || establishmentType === 'Hospital') {
        finalEstablishmentType = `${establishmentType}: ${specificEstablishmentName.trim()}`;
      }

      login(professionalName, finalEstablishmentType);
      toast.success('¡Bienvenido al Sistema EIDEFO!');
    } else {
      setErrorMessage('Respuesta incorrecta a la pregunta de seguridad. Por favor, inténtelo nuevamente.');
      toast.error('Respuesta incorrecta.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-blue-100 overflow-hidden"> {/* Add relative and overflow-hidden */}
      <FallingDeglutitionIcons /> {/* Render the falling icons component */}
      <div className="login-container bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative z-10"> {/* Add relative z-10 to keep content above icons */}
        <div className="logo text-right mb-6">
          <div className="h-10 ml-auto flex items-center text-xl font-bold text-gray-800">
            🧠👅MiFonoConsulta
          </div>
        </div>
        <h2 className="form-title text-2xl font-semibold text-center mb-6 text-gray-800">INGRESO SISTEMA EIDEFO</h2>

        {/* New descriptive text block */}
        <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-gray-700 text-sm mb-2">
            Esta plataforma web es una herramienta diseñada para fonoaudiólogos que realizan evaluaciones de deglución.
            <span className="font-bold"> EIDEFO (Evaluación Informal de la Deglución en Fonoaudiología)</span> permite documentar, puntuar y tomar decisiones clínicas objetivas de manera estandarizada.
          </p>
          <p className="text-gray-700 text-sm mb-2">
            Es importante recordar que esta es una <span className="font-bold">evaluación informal</span> y siempre debe complementarse y seguir los protocolos de una <span className="font-bold">evaluación estandarizada</span> completa.
          </p>
          <p className="text-gray-600 text-xs italic">
            Creado y adaptado de forma digital por Fonoaudiólogo Cristóbal San Martín
          </p>
        </div>

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
            <Select
              onValueChange={(value) => {
                setEstablishmentType(value);
                setSpecificEstablishmentName(''); // Clear specific name when category changes
              }}
              value={establishmentType}
            >
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

          {(establishmentType === 'Centro de salud familiar' || establishmentType === 'Hospital') && (
            <div className="input-group mb-4">
              <Label htmlFor="specificEstablishmentName" className="block text-gray-700 font-medium mb-2">Especificar nombre del establecimiento</Label>
              <Input
                id="specificEstablishmentName"
                type="text"
                placeholder="Ej. Hospital Regional de Concepción"
                value={specificEstablishmentName}
                onChange={(e) => setSpecificEstablishmentName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          )}

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