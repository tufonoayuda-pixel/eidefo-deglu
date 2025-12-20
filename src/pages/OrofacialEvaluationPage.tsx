"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import DentitionPage from './DentitionPage'; // Import the DentitionPage

interface EvaluacionOrofacialData {
  noPresentaAlteracion: boolean;
  alteracionEstructuras: boolean;
  alteracionMotora: boolean;
  rangoFuerzaRostroMandibula: boolean;
  rangoFuerzaLabios: boolean;
  rangoFuerzaLengua: boolean;
  alteracionSensibilidad: boolean;
  sensibilidadExtraoralDerecha: boolean;
  sensibilidadExtraoralIzquierda: boolean;
  sensibilidadIntraoralDerecha: boolean;
  sensibilidadIntraoralIzquierda: boolean;
  asimetriaFacial: boolean;
  higieneOral: boolean;
  higieneBuena: boolean;
  higieneMala: boolean;
  higieneRegular: boolean;
}

const OrofacialEvaluationPage = () => {
  const navigate = useNavigate();
  const [evaluacionOrofacialData, setEvaluacionOrofacialData] = useState<EvaluacionOrofacialData>({
    noPresentaAlteracion: false,
    alteracionEstructuras: false,
    alteracionMotora: false,
    rangoFuerzaRostroMandibula: false,
    rangoFuerzaLabios: false,
    rangoFuerzaLengua: false,
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

  const handleBack = () => {
    navigate('/communication'); // Navigate back to CommunicationPage
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation example
    if (evaluacionOrofacialData.alteracionMotora && !(evaluacionOrofacialData.rangoFuerzaRostroMandibula || evaluacionOrofacialData.rangoFuerzaLabios || evaluacionOrofacialData.rangoFuerzaLengua)) {
      toast.error('Por favor, seleccione al menos una opción de alteración motora.');
      return;
    }
    if (evaluacionOrofacialData.alteracionSensibilidad && !(evaluacionOrofacialData.sensibilidadExtraoralDerecha || evaluacionOrofacialData.sensibilidadExtraoralIzquierda || evaluacionOrofacialData.sensibilidadIntraoralDerecha || evaluacionOrofacialData.sensibilidadIntraoralIzquierda)) {
      toast.error('Por favor, seleccione al menos una opción de alteración de sensibilidad oral.');
      return;
    }
    if (evaluacionOrofacialData.higieneOral && !(evaluacionOrofacialData.higieneBuena || evaluacionOrofacialData.higieneMala || evaluacionOrofacialData.higieneRegular)) {
      toast.error('Por favor, seleccione una opción de higiene oral.');
      return;
    }

    console.log('Datos de Evaluación Estructural Orofacial:', evaluacionOrofacialData);
    toast.success('Etapa 6 - Evaluación estructural orofacial completada. Procediendo a la siguiente etapa...');
    navigate('/dentition'); // Navigate to the new DentitionPage
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6">Etapa 6 - Evaluación estructural orofacial</h1>

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
                  alteracionSensibilidad: checked ? false : evaluacionOrofacialData.alteracionSensibilidad,
                  asimetriaFacial: checked ? false : evaluacionOrofacialData.asimetriaFacial,
                  higieneOral: checked ? false : evaluacionOrofacialData.higieneOral,
                })}
                className="data-[state=checked]:bg-[#e99e7c]"
              />
            </div>

            {/* Alteración de las estructuras orofaciales */}
            <div className="flex items-center justify-between">
              <Label htmlFor="alteracionEstructuras" className="text-gray-700 font-medium">Alteración de las estructuras orofaciales</Label>
              <Switch
                id="alteracionEstructuras"
                checked={evaluacionOrofacialData.alteracionEstructuras}
                onCheckedChange={(checked) => setEvaluacionOrofacialData({
                  ...evaluacionOrofacialData,
                  alteracionEstructuras: checked,
                  noPresentaAlteracion: checked ? false : evaluacionOrofacialData.noPresentaAlteracion,
                })}
                className="data-[state=checked]:bg-[#e99e7c]"
              />
            </div>

            {/* Alteración motora */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alteracionMotora" className="text-gray-700 font-medium">Alteración motora</Label>
                <Switch
                  id="alteracionMotora"
                  checked={evaluacionOrofacialData.alteracionMotora}
                  onCheckedChange={(checked) => setEvaluacionOrofacialData({
                    ...evaluacionOrofacialData,
                    alteracionMotora: checked,
                    noPresentaAlteracion: checked ? false : evaluacionOrofacialData.noPresentaAlteracion,
                    ...(checked ? {} : { // Clear sub-options if toggle is off
                      rangoFuerzaRostroMandibula: false,
                      rangoFuerzaLabios: false,
                      rangoFuerzaLengua: false,
                    }),
                  })}
                  className="data-[state=checked]:bg-[#e99e7c]"
                />
              </div>

              {evaluacionOrofacialData.alteracionMotora && (
                <div className="ml-8 mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rangoFuerzaRostroMandibula"
                      checked={evaluacionOrofacialData.rangoFuerzaRostroMandibula}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        rangoFuerzaRostroMandibula: checked as boolean
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="rangoFuerzaRostroMandibula">Rango, fuerza y coordinación rostro y mandíbula</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rangoFuerzaLabios"
                      checked={evaluacionOrofacialData.rangoFuerzaLabios}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        rangoFuerzaLabios: checked as boolean
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="rangoFuerzaLabios">Rango, fuerza y coordinación labios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rangoFuerzaLengua"
                      checked={evaluacionOrofacialData.rangoFuerzaLengua}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        rangoFuerzaLengua: checked as boolean
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="rangoFuerzaLengua">Rango, fuerza y coordinación lengua</Label>
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
                  className="data-[state=checked]:bg-[#e99e7c]"
                />
              </div>

              {evaluacionOrofacialData.alteracionSensibilidad && (
                <div className="ml-8 mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadExtraoralDerecha"
                      checked={evaluacionOrofacialData.sensibilidadExtraoralDerecha}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        sensibilidadExtraoralDerecha: checked as boolean
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="sensibilidadExtraoralDerecha">Sensibilidad extraoral derecha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadExtraoralIzquierda"
                      checked={evaluacionOrofacialData.sensibilidadExtraoralIzquierda}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        sensibilidadExtraoralIzquierda: checked as boolean
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="sensibilidadExtraoralIzquierda">Sensibilidad extraoral izquierda</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadIntraoralDerecha"
                      checked={evaluacionOrofacialData.sensibilidadIntraoralDerecha}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        sensibilidadIntraoralDerecha: checked as boolean
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="sensibilidadIntraoralDerecha">Sensibilidad intraoral derecha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensibilidadIntraoralIzquierda"
                      checked={evaluacionOrofacialData.sensibilidadIntraoralIzquierda}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        sensibilidadIntraoralIzquierda: checked as boolean
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
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
                onCheckedChange={(checked) => setEvaluacionOrofacialData({
                  ...evaluacionOrofacialData,
                  asimetriaFacial: checked,
                  noPresentaAlteracion: checked ? false : evaluacionOrofacialData.noPresentaAlteracion,
                })}
                className="data-[state=checked]:bg-[#e99e7c]"
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
                  className="data-[state=checked]:bg-[#e99e7c]"
                />
              </div>

              {evaluacionOrofacialData.higieneOral && (
                <div className="ml-8 mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="higieneBuena"
                      checked={evaluacionOrofacialData.higieneBuena}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        higieneBuena: checked as boolean,
                        higieneMala: checked ? false : evaluacionOrofacialData.higieneMala,
                        higieneRegular: checked ? false : evaluacionOrofacialData.higieneRegular,
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="higieneBuena">Buena</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="higieneMala"
                      checked={evaluacionOrofacialData.higieneMala}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        higieneMala: checked as boolean,
                        higieneBuena: checked ? false : evaluacionOrofacialData.higieneBuena,
                        higieneRegular: checked ? false : evaluacionOrofacialData.higieneRegular,
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="higieneMala">Mala</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="higieneRegular"
                      checked={evaluacionOrofacialData.higieneRegular}
                      onCheckedChange={(checked) => setEvaluacionOrofacialData({
                        ...evaluacionOrofacialData,
                        higieneRegular: checked as boolean,
                        higieneBuena: checked ? false : evaluacionOrofacialData.higieneBuena,
                        higieneMala: checked ? false : evaluacionOrofacialData.higieneMala,
                      })}
                      className="data-[state=checked]:bg-[#e99e7c]"
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
              className="p-3 bg-[#e99e7c] text-white font-medium rounded-lg hover:bg-[#ea8a66] transition-colors"
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