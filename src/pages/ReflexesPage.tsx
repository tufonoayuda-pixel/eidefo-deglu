"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface ReflejosData {
  noPresentaAlteracion: boolean;
  presentaAlteracion: boolean;
  tosVoluntariaProductiva: boolean;
  tosVoluntariaNoProductiva: boolean;
  tosVoluntariaAusente: boolean;
  tosReflejaProductiva: boolean;
  tosReflejaNoProductiva: boolean;
  tosReflejaAusente: boolean;
}

const ReflexesPage = () => {
  const navigate = useNavigate();
  const [reflejosData, setReflejosData] = useState<ReflejosData>({
    noPresentaAlteracion: false,
    presentaAlteracion: false,
    tosVoluntariaProductiva: false,
    tosVoluntariaNoProductiva: false,
    tosVoluntariaAusente: false,
    tosReflejaProductiva: false,
    tosReflejaNoProductiva: false,
    tosReflejaAusente: false,
  });

  const handleNoAlterationToggle = (checked: boolean) => {
    setReflejosData({
      ...reflejosData,
      noPresentaAlteracion: checked,
      ...(checked && { // If no alteration, reset all other related fields
        presentaAlteracion: false,
        tosVoluntariaProductiva: false,
        tosVoluntariaNoProductiva: false,
        tosVoluntariaAusente: false,
        tosReflejaProductiva: false,
        tosReflejaNoProductiva: false,
        tosReflejaAusente: false,
      }),
    });
  };

  const handlePresentaAlteracionToggle = (checked: boolean) => {
    setReflejosData({
      ...reflejosData,
      presentaAlteracion: checked,
      noPresentaAlteracion: checked ? false : reflejosData.noPresentaAlteracion,
      ...(checked ? {} : { // If presentaAlteracion is off, reset its sub-options
        tosVoluntariaProductiva: false,
        tosVoluntariaNoProductiva: false,
        tosVoluntariaAusente: false,
        tosReflejaProductiva: false,
        tosReflejaNoProductiva: false,
        tosReflejaAusente: false,
      }),
    });
  };

  const handleCheckboxChange = (field: keyof ReflejosData, checked: boolean) => {
    setReflejosData((prev) => {
      const newState = { ...prev, [field]: checked };

      // Logic for mutual exclusivity within tos voluntaria options
      if (field === 'tosVoluntariaProductiva' && checked) {
        newState.tosVoluntariaNoProductiva = false;
        newState.tosVoluntariaAusente = false;
      } else if (field === 'tosVoluntariaNoProductiva' && checked) {
        newState.tosVoluntariaProductiva = false;
        newState.tosVoluntariaAusente = false;
      } else if (field === 'tosVoluntariaAusente' && checked) {
        newState.tosVoluntariaProductiva = false;
        newState.tosVoluntariaNoProductiva = false;
      }

      // Logic for mutual exclusivity within tos refleja options
      if (field === 'tosReflejaProductiva' && checked) {
        newState.tosReflejaNoProductiva = false;
        newState.tosReflejaAusente = false;
      } else if (field === 'tosReflejaNoProductiva' && checked) {
        newState.tosReflejaProductiva = false;
        newState.tosReflejaAusente = false;
      } else if (field === 'tosReflejaAusente' && checked) {
        newState.tosReflejaProductiva = false;
        newState.tosReflejaNoProductiva = false;
      }

      return newState;
    });
  };

  const handleBack = () => {
    navigate('/dentition'); // Navigate back to DentitionPage
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reflejosData.noPresentaAlteracion && !reflejosData.presentaAlteracion) {
      toast.error('Por favor, seleccione una opción de reflejos.');
      return;
    }

    if (reflejosData.presentaAlteracion) {
      const tosVoluntariaSelected = reflejosData.tosVoluntariaProductiva || reflejosData.tosVoluntariaNoProductiva || reflejosData.tosVoluntariaAusente;
      const tosReflejaSelected = reflejosData.tosReflejaProductiva || reflejosData.tosReflejaNoProductiva || reflejosData.tosReflejaAusente;

      if (!tosVoluntariaSelected) {
        toast.error('Por favor, seleccione una opción para Tos voluntaria.');
        return;
      }
      if (!tosReflejaSelected) {
        toast.error('Por favor, seleccione una opción para Tos refleja.');
        return;
      }
    }

    console.log('Datos de Reflejos:', reflejosData);
    toast.success('Etapa 8 - Reflejos completada. Procediendo a la siguiente etapa...');
    // Navigate to the next stage, e.g., navigate('/next-stage');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6">Etapa 8 - Reflejos</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            {/* No presenta alteración de los reflejos */}
            <div className="flex items-center justify-between">
              <Label htmlFor="noPresentaAlteracion" className="text-gray-700 font-medium">No presenta alteración de los reflejos</Label>
              <Switch
                id="noPresentaAlteracion"
                checked={reflejosData.noPresentaAlteracion}
                onCheckedChange={handleNoAlterationToggle}
                className="data-[state=checked]:bg-[#e99e7c]"
              />
            </div>

            {/* Presenta alteración de los reflejos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="presentaAlteracion" className="text-gray-700 font-medium">Presenta alteración de los reflejos</Label>
                <Switch
                  id="presentaAlteracion"
                  checked={reflejosData.presentaAlteracion}
                  onCheckedChange={handlePresentaAlteracionToggle}
                  disabled={reflejosData.noPresentaAlteracion}
                  className="data-[state=checked]:bg-[#e99e7c]"
                />
              </div>

              {reflejosData.presentaAlteracion && (
                <div className="ml-8 mt-4 space-y-4">
                  {/* Tos voluntaria */}
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">Tos voluntaria:</Label>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tosVoluntariaProductiva"
                          checked={reflejosData.tosVoluntariaProductiva}
                          onCheckedChange={(checked) => handleCheckboxChange('tosVoluntariaProductiva', checked as boolean)}
                          className="data-[state=checked]:bg-[#e99e7c]"
                        />
                        <Label htmlFor="tosVoluntariaProductiva">Presente productiva</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tosVoluntariaNoProductiva"
                          checked={reflejosData.tosVoluntariaNoProductiva}
                          onCheckedChange={(checked) => handleCheckboxChange('tosVoluntariaNoProductiva', checked as boolean)}
                          className="data-[state=checked]:bg-[#e99e7c]"
                        />
                        <Label htmlFor="tosVoluntariaNoProductiva">Presente no productiva</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tosVoluntariaAusente"
                          checked={reflejosData.tosVoluntariaAusente}
                          onCheckedChange={(checked) => handleCheckboxChange('tosVoluntariaAusente', checked as boolean)}
                          className="data-[state=checked]:bg-[#e99e7c]"
                        />
                        <Label htmlFor="tosVoluntariaAusente">Ausente</Label>
                      </div>
                    </div>
                  </div>

                  {/* Tos refleja */}
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">Tos refleja:</Label>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tosReflejaProductiva"
                          checked={reflejosData.tosReflejaProductiva}
                          onCheckedChange={(checked) => handleCheckboxChange('tosReflejaProductiva', checked as boolean)}
                          className="data-[state=checked]:bg-[#e99e7c]"
                        />
                        <Label htmlFor="tosReflejaProductiva">Presente productiva</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tosReflejaNoProductiva"
                          checked={reflejosData.tosReflejaNoProductiva}
                          onCheckedChange={(checked) => handleCheckboxChange('tosReflejaNoProductiva', checked as boolean)}
                          className="data-[state=checked]:bg-[#e99e7c]"
                        />
                        <Label htmlFor="tosReflejaNoProductiva">Presente no productiva</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tosReflejaAusente"
                          checked={reflejosData.tosReflejaAusente}
                          onCheckedChange={(checked) => handleCheckboxChange('tosReflejaAusente', checked as boolean)}
                          className="data-[state=checked]:bg-[#e99e7c]"
                        />
                        <Label htmlFor="tosReflejaAusente">Ausente</Label>
                      </div>
                    </div>
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

export default ReflexesPage;