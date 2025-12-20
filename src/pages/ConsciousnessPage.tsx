"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { ConsciousnessData, EvaluationData } from '@/types/evaluation'; // Import interfaces

const alteredConsciousnessOptions = [
  "Somnoliento",
  "Soporo",
  "Coma",
  "En proceso de destete por sedación",
  "Sedado",
];

const ConsciousnessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData; // Get previous data

  const [isVigil, setIsVigil] = useState(false);
  const [hasAlteredConsciousness, setHasAlteredConsciousness] = useState(false);
  const [selectedAlteredConsciousness, setSelectedAlteredConsciousness] = useState<string[]>([]);

  const handleVigilToggle = (checked: boolean) => {
    setIsVigil(checked);
    if (checked) {
      setHasAlteredConsciousness(false);
      setSelectedAlteredConsciousness([]);
    }
  };

  const handleAlteredConsciousnessToggle = (checked: boolean) => {
    setHasAlteredConsciousness(checked);
    if (checked) {
      setIsVigil(false);
    } else {
      setSelectedAlteredConsciousness([]);
    }
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    setSelectedAlteredConsciousness((prev) =>
      checked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  const handleBack = () => {
    navigate('/nutrition', { state: { evaluationData: prevEvaluationData } }); // Navigate back, passing data
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVigil && !hasAlteredConsciousness) {
      toast.error('Por favor, seleccione una opción de estado de conciencia.');
      return;
    }

    if (hasAlteredConsciousness && selectedAlteredConsciousness.length === 0) {
      toast.error('Por favor, seleccione al menos una opción de alteración de conciencia.');
      return;
    }

    const currentData: ConsciousnessData = {
      isVigil,
      hasAlteredConsciousness,
      selectedAlteredConsciousness: hasAlteredConsciousness ? selectedAlteredConsciousness : [],
    };

    const evaluationData: EvaluationData = {
      ...prevEvaluationData, // Spread previous data
      consciousness: currentData,
    };

    toast.success('Etapa 4 - Estado de conciencia completada. Procediendo a la siguiente etapa...');
    navigate('/communication', { state: { evaluationData } }); // Pass data to the next page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6">Etapa 4 - Estado de conciencia</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isVigil" className="text-gray-700 font-medium">Vigil</Label>
              <Switch
                id="isVigil"
                checked={isVigil}
                onCheckedChange={handleVigilToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="hasAlteredConsciousness" className="text-gray-700 font-medium">Alteración de conciencia</Label>
              <Switch
                id="hasAlteredConsciousness"
                checked={hasAlteredConsciousness}
                onCheckedChange={handleAlteredConsciousnessToggle}
              />
            </div>

            {hasAlteredConsciousness && (
              <div className="ml-8 mt-4 space-y-2">
                {alteredConsciousnessOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`altered-consciousness-${option}`}
                      checked={selectedAlteredConsciousness.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`altered-consciousness-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}
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

export default ConsciousnessPage;