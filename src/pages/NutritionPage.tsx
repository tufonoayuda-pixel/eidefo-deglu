"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { NutritionData, EvaluationData } from '@/types/evaluation'; // Import interfaces

const oralFeedingOptions = [
  "Líquido fino",
  "Líquido espeso",
  "Papilla licuada",
  "Papilla espesa",
  "Papilla",
  "Sólido blando",
  "Sólidos",
];

const NutritionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData; // Get previous data

  const [hasOralFeeding, setHasOralFeeding] = useState(prevEvaluationData?.nutrition?.hasOralFeeding || false);
  const [hasNonOralFeeding, setHasNonOralFeeding] = useState(prevEvaluationData?.nutrition?.hasNonOralFeeding || false);
  const [hasMixedFeeding, setHasMixedFeeding] = useState(prevEvaluationData?.nutrition?.hasMixedFeeding || false);
  const [selectedOralConsistencies, setSelectedOralConsistencies] = useState<string[]>(prevEvaluationData?.nutrition?.selectedOralConsistency || []); // Changed to array

  const handleOralConsistencyChange = (option: string, checked: boolean) => {
    setSelectedOralConsistencies((prev) =>
      checked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  const handleBack = () => {
    navigate('/respiration', { state: { evaluationData: prevEvaluationData } }); // Navigate back, passing data
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasOralFeeding && selectedOralConsistencies.length === 0) { // Validation for multiple selections
      toast.error('Por favor, seleccione al menos una consistencia de alimentación oral.');
      return;
    }

    const currentData: NutritionData = {
      hasOralFeeding,
      selectedOralConsistency: hasOralFeeding ? selectedOralConsistencies : [], // Pass array
      hasNonOralFeeding,
      hasMixedFeeding,
    };

    const evaluationData: EvaluationData = {
      ...prevEvaluationData, // Spread previous data
      nutrition: currentData,
    };

    toast.success('Etapa 3 - Nutrición completada. Procediendo a la siguiente etapa...');
    navigate('/consciousness', { state: { evaluationData } }); // Pass data to the next page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6">Etapa 3 - Nutrición</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hasOralFeeding" className="text-gray-700 font-medium">Presenta alimentación oral</Label>
              <Switch
                id="hasOralFeeding"
                checked={hasOralFeeding}
                onCheckedChange={(checked) => {
                  setHasOralFeeding(checked);
                  if (!checked) {
                    setSelectedOralConsistencies([]); // Clear selections if toggle is off
                  }
                }}
              />
            </div>

            {hasOralFeeding && (
              <div className="ml-8 mt-4 space-y-2">
                {oralFeedingOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`oral-feeding-${option}`}
                      checked={selectedOralConsistencies.includes(option)} // Check if option is in array
                      onCheckedChange={(checked) => handleOralConsistencyChange(option, checked as boolean)}
                      className="data-[state=checked]:bg-efodea-blue"
                    />
                    <Label htmlFor={`oral-feeding-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="hasNonOralFeeding" className="text-gray-700 font-medium">Presenta alimentación no oral</Label>
              <Switch
                id="hasNonOralFeeding"
                checked={hasNonOralFeeding}
                onCheckedChange={setHasNonOralFeeding}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="hasMixedFeeding" className="text-gray-700 font-medium">Presenta alimentación mixta</Label>
              <Switch
                id="hasMixedFeeding"
                checked={hasMixedFeeding}
                onCheckedChange={setHasMixedFeeding}
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

export default NutritionPage;