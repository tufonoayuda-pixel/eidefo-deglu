"use client";

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { EvaluationData } from '@/types/evaluation'; // Import the main interface

const DeglutionResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const evaluationData: EvaluationData | undefined = location.state?.evaluationData;

  const percentage = evaluationData?.deglutionNoNutritivaScore ?? 0;
  const isLowScore = percentage < 21; // Based on the image's criteria (BAJO el 20% vs MAYOR o IGUAL al 21%)

  const handleStartNutritiveDeglution = () => {
    const updatedEvaluationData: EvaluationData = {
      ...evaluationData,
      deglutionNutritiva: { evaluatedNutritiveDeglution: true }, // Mark as started
    };
    navigate('/deglution-nutritiva', { state: { evaluationData: updatedEvaluationData } });
  };

  const handleGoToConclusions = () => {
    const updatedEvaluationData: EvaluationData = {
      ...evaluationData,
      deglutionNutritiva: { evaluatedNutritiveDeglution: false }, // Mark as skipped
    };
    navigate('/conclusions', { state: { evaluationData: updatedEvaluationData } });
  };

  const handleBack = () => {
    navigate('/deglution-no-nutritiva', { state: { evaluationData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6 text-center">Resultado deglución no nutritiva</h1>

        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-4">El puntaje obtenido luego de evaluar la etapa de deglución no nutritiva fue de un:</p>
          <p className="text-5xl font-bold text-gray-900 mb-6">{percentage}%</p>
          <p className="text-md text-gray-600">El porcentaje de la evaluación es de 0 a 100%.</p>
        </div>

        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          {isLowScore ? (
            <p className="text-lg text-gray-800">
              Si el porcentaje obtenido es <span className="font-bold">BAJO el 20%</span> de logro, se sugiere realizar evaluación de deglución nutritiva.
            </p>
          ) : (
            <p className="text-lg text-gray-800">
              Si el porcentaje obtenido es <span className="font-bold">MAYOR o IGUAL al 21%</span> de logro, se sugiere no realizar evaluación de deglución nutritiva, detener su evaluación y registrar sus conclusiones.
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            onClick={handleStartNutritiveDeglution}
            disabled={!isLowScore} // Only enable if score is low
            className="p-3 bg-efodea-blue text-white font-medium rounded-lg hover:bg-efodea-blue-hover transition-colors"
          >
            Iniciar Deglución nutritiva
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoToConclusions}
            className="p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Ir a conclusiones
          </Button>
        </div>
        <div className="flex justify-start mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Volver
            </Button>
          </div>
      </div>
    </div>
  );
};

export default DeglutionResultPage;