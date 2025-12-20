"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simulate user email for display
  const userEmail = "ssanchez.flgo@gmail.com";

  return (
    <div className="bg-red-50 p-3 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">Usuario: ({userEmail})</span>
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