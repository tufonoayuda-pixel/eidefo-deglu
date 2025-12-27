"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { DeglutionNoNutritivaData, EvaluationData } from '@/types/evaluation'; // Import interfaces

const DeglutionNoNutritivaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData; // Get previous data

  // Initialize state from previous data or defaults
  const [deglutionNoNutritivaData, setDeglutionNoNutritivaData] = useState<DeglutionNoNutritivaData>(
    prevEvaluationData?.deglutionNoNutritiva || {
      sinAlteracion: false,
      acumulacionSaliva: false,
      escapeAnterior: false,
      xerostomia: false,
      noDegluteEspontaneamente: false,
      rmoMasDeUnSegundo: false,
      excursionLaringeaAusente: false,
      odinofagia: false,
      vozHumedaSinAclaramiento: false,
      aclaraVozEspontanea: false,
      aclaraVozSolicitud: false,
      aclaraVozDegluciones: false,
      aclaraVozCarraspeo: false,
      aclaraVozTos: false,
      ascultacionCervicalHumeda: false,
      bdtInmediato: false,
      evaluacionPenetracion: false,
      evaluacionAspiracion: false,
      evaluacionAspiracionSilente: false,
    }
  );

  const handleSinAlteracionToggle = (checked: boolean) => {
    setDeglutionNoNutritivaData({
      ...deglutionNoNutritivaData,
      sinAlteracion: checked,
      ...(checked && { // If no alteration, reset all other related fields
        acumulacionSaliva: false,
        escapeAnterior: false,
        xerostomia: false,
        noDegluteEspontaneamente: false,
        rmoMasDeUnSegundo: false,
        excursionLaringeaAusente: false,
        odinofagia: false,
        vozHumedaSinAclaramiento: false,
        aclaraVozEspontanea: false,
        aclaraVozSolicitud: false,
        aclaraVozDegluciones: false,
        aclaraVozCarraspeo: false,
        aclaraVozTos: false,
        ascultacionCervicalHumeda: false,
        bdtInmediato: false,
        evaluacionPenetracion: false,
        evaluacionAspiracion: false,
        evaluacionAspiracionSilente: false,
      }),
    });
  };

  const handleCheckboxChange = (field: keyof DeglutionNoNutritivaData, checked: boolean) => {
    setDeglutionNoNutritivaData((prev) => {
      const newState = { ...prev, [field]: checked };

      // If any other option is checked, 'sinAlteracion' should be false
      if (field !== 'sinAlteracion' && checked) {
        newState.sinAlteracion = false;
      }

      // Logic for 'acumulacionSaliva' and 'escapeAnterior'
      if (field === 'acumulacionSaliva' && !checked) {
        newState.escapeAnterior = false;
      }

      // Logic for 'vozHumedaSinAclaramiento' and its sub-options
      if (field === 'vozHumedaSinAclaramiento' && !checked) {
        newState.aclaraVozEspontanea = false;
        newState.aclaraVozSolicitud = false;
        newState.aclaraVozDegluciones = false;
        newState.aclaraVozCarraspeo = false;
        newState.aclaraVozTos = false;
      }

      return newState;
    });
  };

  const handleBack = () => {
    navigate('/reflexes', { state: { evaluationData: prevEvaluationData } }); // Navigate back, passing data
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (deglutionNoNutritivaData.sinAlteracion) {
      // If no alteration, no further validation needed for sub-options
    } else {
      // If 'vozHumedaSinAclaramiento' is true, at least one sub-option must be selected
      if (deglutionNoNutritivaData.vozHumedaSinAclaramiento &&
          !(deglutionNoNutritivaData.aclaraVozEspontanea ||
            deglutionNoNutritivaData.aclaraVozSolicitud ||
            deglutionNoNutritivaData.aclaraVozDegluciones ||
            deglutionNoNutritivaData.aclaraVozCarraspeo ||
            deglutionNoNutritivaData.aclaraVozTos)) {
        toast.error('Por favor, seleccione al menos una opción para aclarar la voz.');
        return;
      }
    }

    // Calculate score for DeglutionNoNutritiva
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
      return Math.max(0, parseFloat(score.toFixed(1)));
    };

    const score = calculateScore(deglutionNoNutritivaData);

    const evaluationData: EvaluationData = {
      ...prevEvaluationData, // Spread previous data
      deglutionNoNutritiva: deglutionNoNutritivaData,
      deglutionNoNutritivaScore: score, // Add the calculated score
    };

    toast.success('Etapa 9 - Deglución no nutritiva completada. Procediendo a la página de resultados...');
    navigate('/deglution-result', { state: { evaluationData } }); // Pass data to the result page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6">Etapa 9 - Deglución no nutritiva</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            {/* Sin alteración en deglución no nutritiva */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sinAlteracion" className="text-gray-700 font-medium">Sin alteración en deglución no nutritiva</Label>
              <Switch
                id="sinAlteracion"
                checked={deglutionNoNutritivaData.sinAlteracion}
                onCheckedChange={handleSinAlteracionToggle}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Acumulación de saliva */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="acumulacionSaliva" className="text-gray-700 font-medium">Acumulación de saliva</Label>
                <Switch
                  id="acumulacionSaliva"
                  checked={deglutionNoNutritivaData.acumulacionSaliva}
                  onCheckedChange={(checked) => handleCheckboxChange('acumulacionSaliva', checked as boolean)}
                  disabled={deglutionNoNutritivaData.sinAlteracion}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>

              {deglutionNoNutritivaData.acumulacionSaliva && (
                <div className="ml-8 mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="escapeAnterior"
                      checked={deglutionNoNutritivaData.escapeAnterior}
                      onCheckedChange={(checked) => handleCheckboxChange('escapeAnterior', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="escapeAnterior">Escape anterior</Label>
                  </div>
                </div>
              )}
            </div>

            {/* Xerostomía */}
            <div className="flex items-center justify-between">
              <Label htmlFor="xerostomia" className="text-gray-700 font-medium">Xerostomía</Label>
              <Switch
                id="xerostomia"
                checked={deglutionNoNutritivaData.xerostomia}
                onCheckedChange={(checked) => handleCheckboxChange('xerostomia', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* No deglute saliva espontáneamente */}
            <div className="flex items-center justify-between">
              <Label htmlFor="noDegluteEspontaneamente" className="text-gray-700 font-medium">No deglute saliva espontáneamente</Label>
              <Switch
                id="noDegluteEspontaneamente"
                checked={deglutionNoNutritivaData.noDegluteEspontaneamente}
                onCheckedChange={(checked) => handleCheckboxChange('noDegluteEspontaneamente', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* RMO (más de 1 segundo) */}
            <div className="flex items-center justify-between">
              <Label htmlFor="rmoMasDeUnSegundo" className="text-gray-700 font-medium">RMO (más de 1 segundo)</Label>
              <Switch
                id="rmoMasDeUnSegundo"
                checked={deglutionNoNutritivaData.rmoMasDeUnSegundo}
                onCheckedChange={(checked) => handleCheckboxChange('rmoMasDeUnSegundo', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Excursión laríngea ausente */}
            <div className="flex items-center justify-between">
              <Label htmlFor="excursionLaringeaAusente" className="text-gray-700 font-medium">Excursión laríngea ausente</Label>
              <Switch
                id="excursionLaringeaAusente"
                checked={deglutionNoNutritivaData.excursionLaringeaAusente}
                onCheckedChange={(checked) => handleCheckboxChange('excursionLaringeaAusente', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Odinofagia */}
            <div className="flex items-center justify-between">
              <Label htmlFor="odinofagia" className="text-gray-700 font-medium">Odinofagia</Label>
              <Switch
                id="odinofagia"
                checked={deglutionNoNutritivaData.odinofagia}
                onCheckedChange={(checked) => handleCheckboxChange('odinofagia', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Voz húmeda sin aclaramiento */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="vozHumedaSinAclaramiento" className="text-gray-700 font-medium">Voz húmeda sin aclaramiento</Label>
                <Switch
                  id="vozHumedaSinAclaramiento"
                  checked={deglutionNoNutritivaData.vozHumedaSinAclaramiento}
                  onCheckedChange={(checked) => handleCheckboxChange('vozHumedaSinAclaramiento', checked as boolean)}
                  disabled={deglutionNoNutritivaData.sinAlteracion}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>

              {deglutionNoNutritivaData.vozHumedaSinAclaramiento && (
                <div className="ml-8 mt-4 space-y-2">
                  <p className="text-gray-600 font-medium mb-2">Aclara la voz de forma:</p>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aclaraVozEspontanea"
                      checked={deglutionNoNutritivaData.aclaraVozEspontanea}
                      onCheckedChange={(checked) => handleCheckboxChange('aclaraVozEspontanea', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="aclaraVozEspontanea">Espontánea</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aclaraVozSolicitud"
                      checked={deglutionNoNutritivaData.aclaraVozSolicitud}
                      onCheckedChange={(checked) => handleCheckboxChange('aclaraVozSolicitud', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="aclaraVozSolicitud">A solicitud</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aclaraVozDegluciones"
                      checked={deglutionNoNutritivaData.aclaraVozDegluciones}
                      onCheckedChange={(checked) => handleCheckboxChange('aclaraVozDegluciones', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="aclaraVozDegluciones">Con degluciones consecutivas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aclaraVozCarraspeo"
                      checked={deglutionNoNutritivaData.aclaraVozCarraspeo}
                      onCheckedChange={(checked) => handleCheckboxChange('aclaraVozCarraspeo', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="aclaraVozCarraspeo">Con carraspeo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aclaraVozTos"
                      checked={deglutionNoNutritivaData.aclaraVozTos}
                      onCheckedChange={(checked) => handleCheckboxChange('aclaraVozTos', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="aclaraVozTos">Con tos</Label>
                  </div>
                </div>
              )}
            </div>

            {/* Ascultación cervical húmeda */}
            <div className="flex items-center justify-between">
              <Label htmlFor="ascultacionCervicalHumeda" className="text-gray-700 font-medium">Ascultación cervical húmeda</Label>
              <Switch
                id="ascultacionCervicalHumeda"
                checked={deglutionNoNutritivaData.ascultacionCervicalHumeda}
                onCheckedChange={(checked) => handleCheckboxChange('ascultacionCervicalHumeda', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* BDT (+) inmediato */}
            <div className="flex items-center justify-between">
              <Label htmlFor="bdtInmediato" className="text-gray-700 font-medium">BDT (+) inmediato</Label>
              <Switch
                id="bdtInmediato"
                checked={deglutionNoNutritivaData.bdtInmediato}
                onCheckedChange={(checked) => handleCheckboxChange('bdtInmediato', checked as boolean)}
                className="data-[state=checked]:bg-efodea-blue"
                disabled={deglutionNoNutritivaData.sinAlteracion}
              />
            </div>

            {/* A la evaluación instrumental presenta penetración */}
            <div className="flex items-center justify-between">
              <Label htmlFor="evaluacionPenetracion" className="text-gray-700 font-medium">A la evaluación instrumental presenta penetración</Label>
              <Switch
                id="evaluacionPenetracion"
                checked={deglutionNoNutritivaData.evaluacionPenetracion}
                onCheckedChange={(checked) => handleCheckboxChange('evaluacionPenetracion', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* A la evaluación instrumental presenta aspiración */}
            <div className="flex items-center justify-between">
              <Label htmlFor="evaluacionAspiracion" className="text-gray-700 font-medium">A la evaluación instrumental presenta aspiración</Label>
              <Switch
                id="evaluacionAspiracion"
                checked={deglutionNoNutritivaData.evaluacionAspiracion}
                onCheckedChange={(checked) => handleCheckboxChange('evaluacionAspiracion', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* A la evaluación instrumental presenta aspiración silente */}
            <div className="flex items-center justify-between">
              <Label htmlFor="evaluacionAspiracionSilente" className="text-gray-700 font-medium">A la evaluación instrumental presenta aspiración silente</Label>
              <Switch
                id="evaluacionAspiracionSilente"
                checked={deglutionNoNutritivaData.evaluacionAspiracionSilente}
                onCheckedChange={(checked) => handleCheckboxChange('evaluacionAspiracionSilente', checked as boolean)}
                disabled={deglutionNoNutritivaData.sinAlteracion}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
          </div>

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
              className="p-3 bg-efodea-blue text-white font-medium rounded-lg hover:bg-efodea-blue-hover transition-colors"
            >
              Siguiente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeglutionNoNutritivaPage;