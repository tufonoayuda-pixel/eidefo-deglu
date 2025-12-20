"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

const RespirationPage = () => {
  const navigate = useNavigate();
  const [noArtificialAirway, setNoArtificialAirway] = useState(false);
  const [orotrachealIntubation, setOrotrachealIntubation] = useState(false);
  const [tracheostomy, setTracheostomy] = useState(false);

  const handleBack = () => {
    navigate('/'); // Navigate back to IdentificationPage
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Datos de Respiración:', {
      noArtificialAirway,
      orotrachealIntubation,
      tracheostomy,
    });

    toast.success('Etapa 2 - Respiración completada. Procediendo a la siguiente etapa...');
    // In a real application, you would navigate to the next stage here.
    // For now, we'll just log the data.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6">Etapa 2 - Respiración</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="noArtificialAirway" className="text-gray-700 font-medium">Sin uso de vía aérea artificial</Label>
              <Switch
                id="noArtificialAirway"
                checked={noArtificialAirway}
                onCheckedChange={setNoArtificialAirway}
              />
            </div>

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

export default RespirationPage;