"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

const FinalMessagePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8 text-center">
        <h1 className="text-3xl font-bold text-[#e99e7c] mb-6">Mensaje final</h1>

        <p className="text-lg text-gray-700 mb-4">Ha finalizado su evaluación.</p>
        <p className="text-lg text-gray-700 mb-4">El registro de evaluación será enviado al correo registrado en el sistema.</p>
        <p className="text-lg text-gray-700 mb-6">
          Su información <span className="font-bold">NO</span> queda almacenada en la plataforma. Por lo tanto, asegúrese de guardar el pdf de su evaluación.
        </p>
        <p className="text-xl text-gray-800 font-semibold mb-8">¡Muchas gracias!</p>

        <Button
          type="button"
          onClick={handleLogout}
          className="p-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default FinalMessagePage;