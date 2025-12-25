"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { logout, professionalName, establishmentType } = useAuth(); // Get professionalName and establishmentType from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-blue-50 p-3 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">Profesional: ({professionalName || 'Invitado'})</span> {/* Display dynamic professionalName */}
        {establishmentType && <span className="text-sm text-gray-700">Establecimiento: ({establishmentType})</span>} {/* Display establishmentType */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-800 p-0 h-auto"
        >
          Salir
        </Button>
      </div>
      <div className="h-10 flex items-center text-lg font-bold text-gray-800">
        🧠👅MiFonoConsulta
      </div>
    </div>
  );
};

export default Header;