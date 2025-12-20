"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface DenticionData {
  noPresentaAlteracion: boolean;
  perdidaPiezas: boolean;
  superior: boolean;
  inferior: boolean;
  adaptada: boolean;
  noAdaptada: boolean;
  total: boolean;
  parcial: boolean;
  usoAdhesivo: boolean;
  evaluacionConProtesis: boolean;
  evaluacionSinProtesis: boolean;
}

const DentitionPage = () => {
  const navigate = useNavigate();
  const [denticionData, setDenticionData] = useState<DenticionData>({
    noPresentaAlteracion: false,
    perdidaPiezas: false,
    superior: false,
    inferior: false,
    adaptada: false,
    noAdaptada: false,
    total: false,
    parcial: false,
    usoAdhesivo: false,
    evaluacionConProtesis: false,
    evaluacionSinProtesis: false,
  });

  const handleNoAlterationToggle = (checked: boolean) => {
    setDenticionData({
      ...denticionData,
      noPresentaAlteracion: checked,
      ...(checked && { // If no alteration, reset all other related fields
        perdidaPiezas: false,
        superior: false,
        inferior: false,
        adaptada: false,
        noAdaptada: false,
        total: false,
        parcial: false,
        usoAdhesivo: false,
        evaluacionConProtesis: false,
        evaluacionSinProtesis: false,
      }),
    });
  };

  const handlePerdidaPiezasToggle = (checked: boolean) => {
    setDenticionData({
      ...denticionData,
      perdidaPiezas: checked,
      noPresentaAlteracion: checked ? false : denticionData.noPresentaAlteracion,
      ...(checked ? {} : { // If perdidaPiezas is off, reset its sub-options
        superior: false,
        inferior: false,
        adaptada: false,
        noAdaptada: false,
        total: false,
        parcial: false,
        usoAdhesivo: false,
        evaluacionConProtesis: false,
        evaluacionSinProtesis: false,
      }),
    });
  };

  const handleCheckboxChange = (field: keyof DenticionData, checked: boolean) => {
    setDenticionData((prev) => {
      const newState = { ...prev, [field]: checked };

      // Logic for mutual exclusivity between evaluacionConProtesis and evaluacionSinProtesis
      if (field === 'evaluacionConProtesis' && checked) {
        newState.evaluacionSinProtesis = false;
      }
      if (field === 'evaluacionSinProtesis' && checked) {
        newState.evaluacionConProtesis = false;
      }
      return newState;
    });
  };

  const handleBack = () => {
    navigate('/orofacial-evaluation'); // Navigate back to OrofacialEvaluationPage
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!denticionData.noPresentaAlteracion && !denticionData.perdidaPiezas) {
      toast.error('Por favor, seleccione una opción de dentición.');
      return;
    }

    if (denticionData.perdidaPiezas) {
      if (!denticionData.superior && !denticionData.inferior) {
        toast.error('Por favor, indique si la pérdida de piezas es superior o inferior.');
        return;
      }
      if (!denticionData.adaptada && !denticionData.noAdaptada) {
        toast.error('Por favor, indique si la prótesis está adaptada o no adaptada.');
        return;
      }
      if (!denticionData.total && !denticionData.parcial) {
        toast.error('Por favor, indique si la prótesis es total o parcial.');
        return;
      }
      if (!denticionData.evaluacionConProtesis && !denticionData.evaluacionSinProtesis) {
        toast.error('Por favor, indique si la evaluación se realizó con o sin prótesis dental.');
        return;
      }
    }

    console.log('Datos de Dentición:', denticionData);
    toast.success('Etapa 7 - Dentición completada. Procediendo a la siguiente etapa...');
    // Navigate to the next stage, e.g., navigate('/next-stage');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6">Etapa 7 - Dentición</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            {/* No presenta alteración de la dentición */}
            <div className="flex items-center justify-between">
              <Label htmlFor="noPresentaAlteracion" className="text-gray-700 font-medium">No presenta alteración de la dentición</Label>
              <Switch
                id="noPresentaAlteracion"
                checked={denticionData.noPresentaAlteracion}
                onCheckedChange={handleNoAlterationToggle}
                className="data-[state=checked]:bg-[#e99e7c]"
              />
            </div>

            {/* Pérdida de piezas dentales con o sin uso de prótesis dental */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="perdidaPiezas" className="text-gray-700 font-medium">Pérdida de piezas dentales con o sin uso de prótesis dental</Label>
                <Switch
                  id="perdidaPiezas"
                  checked={denticionData.perdidaPiezas}
                  onCheckedChange={handlePerdidaPiezasToggle}
                  disabled={denticionData.noPresentaAlteracion}
                  className="data-[state=checked]:bg-[#e99e7c]"
                />
              </div>

              {denticionData.perdidaPiezas && (
                <div className="ml-8 mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="superior"
                      checked={denticionData.superior}
                      onCheckedChange={(checked) => handleCheckboxChange('superior', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="superior">Superior</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inferior"
                      checked={denticionData.inferior}
                      onCheckedChange={(checked) => handleCheckboxChange('inferior', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="inferior">Inferior</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="adaptada"
                      checked={denticionData.adaptada}
                      onCheckedChange={(checked) => handleCheckboxChange('adaptada', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="adaptada">Adaptada</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noAdaptada"
                      checked={denticionData.noAdaptada}
                      onCheckedChange={(checked) => handleCheckboxChange('noAdaptada', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="noAdaptada">No adaptada</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="total"
                      checked={denticionData.total}
                      onCheckedChange={(checked) => handleCheckboxChange('total', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="total">Total</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parcial"
                      checked={denticionData.parcial}
                      onCheckedChange={(checked) => handleCheckboxChange('parcial', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="parcial">Parcial</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="usoAdhesivo"
                      checked={denticionData.usoAdhesivo}
                      onCheckedChange={(checked) => handleCheckboxChange('usoAdhesivo', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="usoAdhesivo">Uso de adhesivo dental</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="evaluacionConProtesis"
                      checked={denticionData.evaluacionConProtesis}
                      onCheckedChange={(checked) => handleCheckboxChange('evaluacionConProtesis', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="evaluacionConProtesis">Evaluación realizada con uso de prótesis dental</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="evaluacionSinProtesis"
                      checked={denticionData.evaluacionSinProtesis}
                      onCheckedChange={(checked) => handleCheckboxChange('evaluacionSinProtesis', checked as boolean)}
                      className="data-[state=checked]:bg-[#e99e7c]"
                    />
                    <Label htmlFor="evaluacionSinProtesis">Evaluación realizada sin uso de prótesis dental</Label>
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

export default DentitionPage;