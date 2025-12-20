"use client";

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { DeglutionNutritivaData, EvaluationData } from '@/types/evaluation'; // Import interfaces

const DeglutionNutritivaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData; // Get previous data

  const handleBack = () => {
    navigate('/deglution-result', { state: { evaluationData: prevEvaluationData } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentData: DeglutionNutritivaData = {
      evaluatedNutritiveDeglution: true,
      // Add more fields here as the page gets implemented
    };

    const evaluationData: EvaluationData = {
      ...prevEvaluationData, // Spread previous data
      deglutionNutritiva: currentData,
    };

    navigate('/conclusions', { state: { evaluationData } }); // Pass data to conclusions
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6 text-center">Etapa 10 - Deglución Nutritiva</h1>
        <p className="text-center text-gray-700 mb-8">
          Esta es la página para la evaluación de la deglución nutritiva.
          Aquí se registrarán los detalles de la evaluación con diferentes consistencias alimentarias.
        </p>
        {/* Add actual form elements for nutritive deglution here */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Volver
          </Button>
          <Button
            type="submit"
            className="p-3 bg-[#e99e7c] text-white font-medium rounded-lg hover:bg-[#ea8a66] transition-colors"
            onClick={handleSubmit}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeglutionNutritivaPage;