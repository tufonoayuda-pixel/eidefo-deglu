"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup components
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

const oralFeedingOptions = [
  "Líquido fino",
  "Líquido espeso",
  "Papilla",
  "Sólido blando",
  "Sólidos",
];

const NutritionPage = () => {
  const navigate = useNavigate();
  const [hasOralFeeding, setHasOralFeeding] = useState(false);
  const [hasNonOralFeeding, setHasNonOralFeeding] = useState(false);
  const [hasMixedFeeding, setHasMixedFeeding] = useState(false);
  const [selectedOralConsistency, setSelectedOralConsistency] = useState<string | undefined>(undefined);

  const handleBack = () => {
    navigate('/respiration'); // Navigate back to RespirationPage
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasOralFeeding && !selectedOralConsistency) {
      toast.error('Por favor, seleccione una consistencia de alimentación oral.');
      return;
    }

    console.log('Datos de Nutrición:', {
      hasOralFeeding,
      selectedOralConsistency: hasOralFeeding ? selectedOralConsistency : null,
      hasNonOralFeeding,
      hasMixedFeeding,
    });

    toast.success('Etapa 3 - Nutrición completada. Procediendo a la siguiente etapa...');
    navigate('/consciousness'); // Navigate to the new ConsciousnessPage
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6">Etapa 3 - Nutrición</h1>

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
                    setSelectedOralConsistency(undefined); // Clear selection if toggle is off
                  }
                }}
              />
            </div>

            {hasOralFeeding && (
              <div className="ml-8 mt-4 space-y-2">
                <RadioGroup
                  onValueChange={setSelectedOralConsistency}
                  value={selectedOralConsistency}
                  className="flex flex-col space-y-2"
                >
                  {oralFeedingOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`oral-feeding-${option}`} />
                      <Label htmlFor={`oral-feeding-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
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

export default NutritionPage;