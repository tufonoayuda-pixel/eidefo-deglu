"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { RespirationData, EvaluationData } from '@/types/evaluation'; // Import interfaces

const respirationOptions = [
  "FIO2 ambiental",
  "Con uso de CNAF",
  "Con uso de cánula nasal",
  "Con uso de MMV",
  "Con uso de VMNI sin ventana",
  "Con uso de VMNI con ventana",
];

const RespirationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData; // Get previous data

  const [noArtificialAirway, setNoArtificialAirway] = useState(false);
  const [selectedRespirationOptions, setSelectedRespirationOptions] = useState<string[]>([]);
  const [orotrachealIntubation, setOrotrachealIntubation] = useState(false);
  const [tracheostomy, setTracheostomy] = useState(false);

  const handleRespirationOptionChange = (option: string, checked: boolean) => {
    setSelectedRespirationOptions((prev) =>
      checked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  const handleNoArtificialAirwayToggle = (checked: boolean) => {
    setNoArtificialAirway(checked);
    if (!checked) {
      setSelectedRespirationOptions([]); // Clear selections if toggle is off
    }
  };

  const handleBack = () => {
    navigate('/', { state: { evaluationData: prevEvaluationData } }); // Navigate back, passing data
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentData: RespirationData = {
      noArtificialAirway,
      selectedRespirationOptions: noArtificialAirway ? selectedRespirationOptions : [],
      orotrachealIntubation,
      tracheostomy,
    };

    const evaluationData: EvaluationData = {
      ...prevEvaluationData, // Spread previous data
      respiration: currentData,
    };

    toast.success('Etapa 2 - Respiración completada. Procediendo a la siguiente etapa...');
    navigate('/nutrition', { state: { evaluationData } }); // Pass data to the next page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6">Etapa 2 - Respiración</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="noArtificialAirway" className="text-gray-700 font-medium">Sin uso de vía aérea artificial</Label>
              <Switch
                id="noArtificialAirway"
                checked={noArtificialAirway}
                onCheckedChange={handleNoArtificialAirwayToggle}
              />
            </div>

            {noArtificialAirway && (
              <div className="ml-8 mt-4 space-y-2">
                {respirationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`respiration-option-${option}`}
                      checked={selectedRespirationOptions.includes(option)}
                      onCheckedChange={(checked) => handleRespirationOptionChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`respiration-option-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="orotrachealIntubation" className="text-gray-700 font-medium">Presentó intubación orotraqueal</Label>
              <Switch
                id="orotrachealIntubation"
                checked={orotrachealIntubation}
                onCheckedChange={setOrotrachealIntubation}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="tracheostomy" className="text-gray-700 font-medium">Presenta uso de traqueostomía</Label>
              <Switch
                id="tracheostomy"
                checked={tracheostomy}
                onCheckedChange={setTracheostomy}
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

export default RespirationPage;