"use client";

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';

// Re-using the interface from DeglutionNoNutritivaPage for data consistency
interface DeglutionNoNutritivaData {
  sinAlteracion: boolean;
  acumulacionSaliva: boolean;
  escapeAnterior: boolean;
  xerostomia: boolean;
  noDegluteEspontaneamente: boolean;
  rmoMasDeUnSegundo: boolean;
  excursionLaringeaAusente: boolean;
  odinofagia: boolean;
  vozHumedaSinAclaramiento: boolean;
  aclaraVozEspontanea: boolean;
  aclaraVozSolicitud: boolean;
  aclaraVozDegluciones: boolean;
  aclaraVozCarraspeo: boolean;
  aclaraVozTos: boolean;
  ascultacionCervicalHumeda: boolean;
  bdtInmediato: boolean;
  evaluacionPenetracion: boolean;
  evaluacionAspiracion: boolean;
  evaluacionAspiracionSilente: boolean;
}

const DeglutionResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const deglutionNoNutritivaData: DeglutionNoNutritivaData | undefined = location.state?.deglutionNoNutritivaData;

  // Function to calculate the score based on the provided data
  const calculateScore = (data: DeglutionNoNutritivaData): number => {
    if (data.sinAlteracion) {
      return 100;
    }

    let issuesCount = 0;
    if (data.acumulacionSaliva) issuesCount++;
    if (data.xerostomia) issuesCount++;
    if (data.noDegluteEspontaneamente) issuesCount++;
    if (data.rmoMasDeUnSegundo) issuesCount++;
    if (data.excursionLaringeaAusente) issuesCount++;
    if (data.odinofagia) issuesCount++;
    if (data.vozHumedaSinAclaramiento) issuesCount++;
    if (data.ascultacionCervicalHumeda) issuesCount++;
    if (data.bdtInmediato) issuesCount++;
    if (data.evaluacionPenetracion) issuesCount++;
    if (data.evaluacionAspiracion) issuesCount++;
    if (data.evaluacionAspiracionSilente) issuesCount++;

    const totalPossibleIssues = 12; // Based on the 12 boolean fields indicating an issue
    const score = 100 - (issuesCount / totalPossibleIssues) * 100;
    return Math.max(0, parseFloat(score.toFixed(1))); // Ensure score is not negative and format to one decimal
  };

  const percentage = deglutionNoNutritivaData ? calculateScore(deglutionNoNutritivaData) : 0;
  const isLowScore = percentage < 21; // Based on the image's criteria (BAJO el 20% vs MAYOR o IGUAL al 21%)

  const handleStartNutritiveDeglution = () => {
    navigate('/deglution-nutritiva');
  };

  const handleGoToConclusions = () => {
    navigate('/conclusions');
  };

  const handleBack = () => {
    navigate('/deglution-no-nutritiva');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6 text-center">Resultado deglución no nutritiva</h1>

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
            className="p-3 bg-[#e99e7c] text-white font-medium rounded-lg hover:bg-[#ea8a66] transition-colors"
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