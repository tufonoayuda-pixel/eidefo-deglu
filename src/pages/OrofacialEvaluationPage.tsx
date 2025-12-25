"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrofacialEvaluationData, EvaluationData } from '@/types/evaluation';

const OrofacialEvaluationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData;

  const [evaluacionOrofacialData, setEvaluacionOrofacialData] = useState<OrofacialEvaluationData>({
    noPresentaAlteracion: false,
    alteracionEstructuras: false,
    alteracionMotora: false,
    rangoFuerzaRostroMandibula: false,
    rangoFuerzaRostroMandibulaDerecha: false, // New
    rangoFuerzaRostroMandibulaIzquierda: false, // New
    rangoFuerzaLabios: false,
    rangoFuerzaLabiosDerecha: false, // New
    rangoFuerzaLabiosIzquierda: false, // New
    rangoFuerzaLengua: false,
    rangoFuerzaLenguaDerecha: false, // New
    rangoFuerzaLenguaIzquierda: false, // New
    alteracionSensibilidad: false,
    sensibilidadExtraoralDerecha: false,
    sensibilidadExtraoralIzquierda: false,
    sensibilidadIntraoralDerecha: false,
    sensibilidadIntraoralIzquierda: false,
    asimetriaFacial: false,
    higieneOral: false,
    higieneBuena: false,
    higieneMala: false,
    higieneRegular: false,
  });

  const handleCheckboxChange = (field: keyof OrofacialEvaluationData, checked: boolean) => {
    setEvaluacionOrofacialData((prev) => {
      const newState = { ...prev, [field]: checked };

      // If a parent motor alteration is unchecked, clear its side-specific options
      if (field === 'rangoFuerzaRostroMandibula' && !checked) {
        newState.rangoFuerzaRostroMandibulaDerecha = false;
        newState.rangoFuerzaRostroMandibulaIzquierda = false;
      }
      if (field === 'rangoFuerzaLabios' && !checked) {
        newState.rangoFuerzaLabiosDerecha = false;
        newState.rangoFuerzaLabiosIzquierda = false;
      }
      if (field === 'rangoFuerzaLengua' && !checked) {
        newState.rangoFuerzaLenguaDerecha = false;
        newState.rangoFuerzaLenguaIzquierda = false;
      }

      // If any other option is checked, 'noPresentaAlteracion' should be false
      if (field !== 'noPresentaAlteracion' && checked) {
        newState.noPresentaAlteracion = false;
      }

      // Logic for mutual exclusivity within higiene oral
      if (field === 'higieneBuena' && checked) {
        newState.higieneMala = false;
        newState.higieneRegular = false;
      } else if (field === 'higieneMala' && checked) {
        newState.higieneBuena = false;
        newState.higieneRegular = false;
      } else if (field === 'higieneRegular' && checked) {
        newState.higieneBuena = false;
        newState.higieneMala = false;
      }

      return newState;
    });
  };

  const handleAlteracionMotoraToggle = (checked: boolean) => {
    setEvaluacionOrofacialData((prev) => ({
      ...prev,
      alteracionMotora: checked,
      noPresentaAlteracion: checked ? false : prev.noPresentaAlteracion,
      ...(checked ? {} : { // Clear all motor sub-options if toggle is off
        rangoFuerzaRostroMandibula: false,
        rangoFuerzaRostroMandibulaDerecha: false,
        rangoFuerzaRostroMandibulaIzquierda: false,
        rangoFuerzaLabios: false,
        rangoFuerzaLabiosDerecha: false,
        rangoFuerzaLabiosIzquierda: false,
        rangoFuerzaLengua: false,
        rangoFuerzaLenguaDerecha: false,
        rangoFuerzaLenguaIzquierda: false,
      }),
    }));
  };

  const handleBack = () => {
    navigate('/communication', { state: { evaluationData: prevEvaluationData } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation example
    if (evaluacionOrofacialData.alteracionMotora) {
      if (
        !(evaluacionOrofacialData.rangoFuerzaRostroMandibula ||
          evaluacionOrofacialData.rangoFuerzaLabios ||
          evaluacionOrofacialData.rangoFuerzaLengua)
      ) {
        toast.error('Por favor, seleccione al menos una opción de alteración motora.');
        return;
      }

      if (evaluacionOrofacialData.rangoFuerzaRostroMandibula && !(evaluacionOrofacialData.rangoFuerzaRostroMandibulaDerecha || evaluacionOrofacialData.rangoFuerzaRostroMandibulaIzquierda)) {
        toast.error('Por favor, especifique el lado afectado para "Rostro y mandíbula".');
        return;
      }
      if (evaluacionOrofacialData.rangoFuerzaLabios && !(evaluacionOrofacialData.rangoFuerzaLabiosDerecha || evaluacionOrofacialData.rangoFuerzaLabiosIzquierda)) {
        toast.error('Por favor, especifique el lado afectado para "Labios".');
        return;
      }
      if (evaluacionOrofacialData.rangoFuerzaLengua && !(evaluacionOrofacialData.rangoFuerzaLenguaDerecha || evaluacionOrofacialData.rangoFuerzaLenguaIzquierda)) {
        toast.error('Por favor, especifique el lado afectado para "Lengua".');
        return;
      }
    }

    if (evaluacionOrofacialData.alteracionSensibilidad && !(evaluacionOrofacialData.sensibilidadExtraoralDerecha || evaluacionOrofacialData.sensibilidadExtraoralIzquierda || evaluacionOrofacialData.sensibilidadIntraoralDerecha || evaluacionOrofacialData.sensibilidadIntraoralIzquierda)) {
      toast.error('Por favor, seleccione al menos una opción de alteración de sensibilidad oral.');
      return;
    }
    if (evaluacionOrofacialData.higieneOral && !(evaluacionOrofacialData.higieneBuena || evaluacionOrofacialData.higieneMala || evaluacionOrofacialData.higieneRegular)) {
      toast.error('Por favor, seleccione una opción de higiene oral.');
      return;
    }

    const evaluationData: EvaluationData = {
      ...prevEvaluationData,
      orofacialEvaluation: evaluacionOrofacialData,
    };

    toast.success('Etapa 6 - Evaluación estructural orofacial completada. Procediendo a la siguiente etapa...');
    navigate('/dentition', { state: { evaluationData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6">Etapa 6 - Evaluación estructural orofacial</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            {/* No presenta alteración */}
            <div className="flex items-center justify-between">
              <Label htmlFor="noPresentaAlteracion" className="text-gray-700 font-medium">No presenta alteración en la evaluación estructural orofacial</Label>
              <Switch
                id="noPresentaAlteracion"
                checked={evaluacionOrofacialData.noPresentaAlteracion}
                onCheckedChange={(checked) => setEvaluacionOrofacialData({
                  ...evaluacionOrofacialData,
                  noPresentaAlteracion: checked,
                  // Optionally reset other fields if this is checked
                  alteracionEstructuras: checked ? false : evaluacionOrofacialData.alteracionEstructuras,
                  alteracionMotora: checked ? false : evaluacionOrofacialData.alteracionMotora,
                  rangoFuerzaRostroMandibula: false, // Reset sub-options
                  rangoFuerzaRostroMandibulaDerecha: false,
                  rangoFuerzaRostroMandibulaIzquierda: false,
                  rangoFuerzaLabios: false,
                  rangoFuerzaLabiosDerecha: false,
                  rangoFuerzaLabiosIzquierda: false,
                  rangoFuerzaLengua: false,
                  rangoFuerzaLenguaDerecha: false,
                  rangoFuerzaLenguaIzquierda: false,
                  alteracionSensibilidad: checked ? false : evaluacionOrofacialData.alteracionSensibilidad,
                  sensibilidadExtraoralDerecha: false, // Reset sub-options
                  sensibilidadExtraoralIzquierda: false,
                  sensibilidadIntraoralDerecha: false,
                  sensibilidadIntraoralIzquierda: false,
                  asimetriaFacial: checked ? false : evaluacionOrofacialData.asimetriaFacial,
                  higieneOral: checked ? false : evaluacionOrofacialData.higieneOral,
                  higieneBuena: false, // Reset sub-options
                  higieneMala: false,
                  higieneRegular: false,
                })}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Alteración de las estructuras orofaciales */}
            <div className="flex items-center justify-between">
              <Label htmlFor="alteracionEstructuras" className="text-gray-700 font-medium">Alteración de las estructuras orofaciales</Label>
              <Switch
                id="alteracionEstructuras"
                checked={evaluacionOrofacialData.alteracionEstructuras}
                onCheckedChange={(checked) => handleCheckboxChange('alteracionEstructuras', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Alteración motora */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alteracionMotora" className="text-gray-700 font-medium">Alteración motora</Label>
                <Switch
                  id="alteracionMotora"
                  checked={evaluacionOrofacialData.alteracionMotora}
                  onCheckedChange={handleAlteracionMotoraToggle}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>

              {evaluacionOrofacialData.alteracionMotora && (
                <div className="ml-8 mt-4 space-y-4">
                  {/* Rango, fuerza y coordinación rostro y mandíbula */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rangoFuerzaRostroMandibula"
                        checked={evaluacionOrofacialData.rangoFuerzaRostroMandibula}
                        onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaRostroMandibula', checked as boolean)}
                        className="data-[state=checked]:bg-efodea-blue"
                      />
                      <Label htmlFor="rangoFuerzaRostroMandibula">Rango, fuerza y coordinación rostro y mandíbula</Label>
                    </div>
                    {evaluacionOrofacialData.rangoFuerzaRostroMandibula && (
                      <div className="ml-8 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rangoFuerzaRostroMandibulaDerecha"
                            checked={evaluacionOrofacialData.rangoFuerzaRostroMandibulaDerecha}
                            onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaRostroMandibulaDerecha', checked as boolean)}
                            className="data-[state=checked]:bg-efodea-blue"
                          />
                          <Label htmlFor="rangoFuerzaRostroMandibulaDerecha">Derecha</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rangoFuerzaRostroMandibulaIzquierda"
                            checked={evaluacionOrofacialData.rangoFuerzaRostroMandibulaIzquierda}
                            onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaRostroMandibulaIzquierda', checked as boolean)}
                            className="data-[state=checked]:bg-efodea-blue"
                          />
                          <Label htmlFor="rangoFuerzaRostroMandibulaIzquierda">Izquierda</Label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rango, fuerza y coordinación labios */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rangoFuerzaLabios"
                        checked={evaluacionOrofacialData.rangoFuerzaLabios}
                        onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaLabios', checked as boolean)}
                        className="data-[state=checked]:bg-efodea-blue"
                      />
                      <Label htmlFor="rangoFuerzaLabios">Rango, fuerza y coordinación labios</Label>
                    </div>
                    {evaluacionOrofacialData.rangoFuerzaLabios && (
                      <div className="ml-8 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rangoFuerzaLabiosDerecha"
                            checked={evaluacionOrofacialData.rangoFuerzaLabiosDerecha}
                            onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaLabiosDerecha', checked as boolean)}
                            className="data-[state=checked]:bg-efodea-blue"
                          />
                          <Label htmlFor="rangoFuerzaLabiosDerecha">Derecha</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rangoFuerzaLabiosIzquierda"
                            checked={evaluacionOrofacialData.rangoFuerzaLabiosIzquierda}
                            onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaLabiosIzquierda', checked as boolean)}
                            className="data-[state=checked]:bg-efodea-blue"
                          />
                          <Label htmlFor="rangoFuerzaLabiosIzquierda">Izquierda</Label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rango, fuerza y coordinación lengua */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rangoFuerzaLengua"
                        checked={evaluacionOrofacialData.rangoFuerzaLengua}
                        onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaLengua', checked as boolean)}
                        className="data-[state=checked]:bg-efodea-blue"
                      />
                      <Label htmlFor="rangoFuerzaLengua">Rango, fuerza y coordinación lengua</Label>
                    </div>
                    {evaluacionOrofacialData.rangoFuerzaLengua && (
                      <div className="ml-8 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rangoFuerzaLenguaDerecha"
                            checked={evaluacionOrofacialData.rangoFuerzaLenguaDerecha}
                            onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaLenguaDerecha', checked as boolean)}
                            className="data-[state=checked]:bg-efodea-blue"
                          />
                          <Label htmlFor="rangoFuerzaLenguaDerecha">Derecha</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rangoFuerzaLenguaIzquierda"
                            checked={evaluacionOrofacialData.rangoFuerzaLenguaIzquierda}
                            onCheckedChange={(checked) => handleCheckboxChange('rangoFuerzaLenguaIzquierda', checked as boolean)}
                            className="data-[state=checked]:bg-efodea-blue"
                          />
                          <Label htmlFor="rangoFuerzaLenguaIzquierda">Izquierda</Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Alteración de sensibilidad oral */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alteracionSensibilidad" className="text-gray-700 font-medium">Alteración de sensibilidad oral</Label>
                <Switch
                  id="alteracionSensibilidad"
                  checked={evaluacionOrofacialData.alteracionSensibilidad}
                  onCheckedChange={(checked) => setEvaluacionOrofacialData({
                    ...evaluacionOrofacialData,
                    alteracionSensibilidad: checked,
                    noPresentaAlteracion: checked ? false : evaluacionOrofacialData.noPresentaAlteracion,
                    ...(checked ? {} : { // Clear sub-options if toggle is off
                      sensibilidadExtraoralDerecha: false,
                      sensibilidadExtraoralIzquierda: false,
                      sensibilidadIntraoralDerecha: false,
                      sensibilidadIntraoralIzquierda: false,
                    }),
                  })}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>

              {evaluacionOrofacialData.alteracionSensibilidad && (
                <div className="ml-8 mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadExtraoralDerecha"
                      checked={evaluacionOrofacialData.sensibilidadExtraoralDerecha}
                      onCheckedChange={(checked) => handleCheckboxChange('sensibilidadExtraoralDerecha', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="sensibilidadExtraoralDerecha">Sensibilidad extraoral derecha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadExtraoralIzquierda"
                      checked={evaluacionOrofacialData.sensibilidadExtraoralIzquierda}
                      onCheckedChange={(checked) => handleCheckboxChange('sensibilidadExtraoralIzquierda', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="sensibilidadExtraoralIzquierda">Sensibilidad extraoral izquierda</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadIntraoralDerecha"
                      checked={evaluacionOrofacialData.sensibilidadIntraoralDerecha}
                      onCheckedChange={(checked) => handleCheckboxChange('sensibilidadIntraoralDerecha', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="sensibilidadIntraoralDerecha">Sensibilidad intraoral derecha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadIntraoralIzquierda"
                      checked={evaluacionOrofacialData.sensibilidadIntraoralIzquierda}
                      onCheckedChange={(checked) => handleCheckboxChange('sensibilidadIntraoralIzquierda', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="sensibilidadIntraoralIzquierda">Sensibilidad intraoral izquierda</Label>
                  </div>
                </div>
              )}
            </div>

            {/* Asimetría facial */}
            <div className="flex items-center justify-between">
              <Label htmlFor="asimetriaFacial" className="text-gray-700 font-medium">Asimetría facial</Label>
              <Switch
                id="asimetriaFacial"
                checked={evaluacionOrofacialData.asimetriaFacial}
                onCheckedChange={(checked) => handleCheckboxChange('asimetriaFacial', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Higiene oral */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="higieneOral" className="text-gray-700 font-medium">Higiene oral</Label>
                <Switch
                  id="higieneOral"
                  checked={evaluacionOrofacialData.higieneOral}
                  onCheckedChange={(checked) => setEvaluacionOrofacialData({
                    ...evaluacionOrofacialData,
                    higieneOral: checked,
                    noPresentaAlteracion: checked ? false : evaluacionOrofacialData.noPresentaAlteracion,
                    ...(checked ? {} : { // Clear sub-options if toggle is off
                      higieneBuena: false,
                      higieneMala: false,
                      higieneRegular: false,
                    }),
                  })}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>

              {evaluacionOrofacialData.higieneOral && (
                <div className="ml-8 mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="higieneBuena"
                      checked={evaluacionOrofacialData.higieneBuena}
                      onCheckedChange={(checked) => handleCheckboxChange('higieneBuena', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="higieneBuena">Buena</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="higieneMala"
                      checked={evaluacionOrofacialData.higieneMala}
                      onCheckedChange={(checked) => handleCheckboxChange('higieneMala', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="higieneMala">Mala</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="higieneRegular"
                      checked={evaluacionOrofacialData.higieneRegular}
                      onCheckedChange={(checked) => handleCheckboxChange('higieneRegular', checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor="higieneRegular">Regular</Label>
                  </div>
                </div>
              )}
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

export default OrofacialEvaluationPage;