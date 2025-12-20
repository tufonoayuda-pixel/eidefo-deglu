"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Header from '@/components/Header'; // Import the new Header component

const IdentificationPage = () => {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistoryToggle, setMedicalHistoryToggle] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState('');
  const [swallowingHistory, setSwallowingHistory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !age) {
      toast.error('Por favor complete los campos obligatorios (Nombre y Edad).');
      return;
    }

    console.log('Datos de identificación:', {
      patientName,
      age,
      medicalHistoryToggle,
      medicalHistory,
      swallowingHistory
    });

    toast.success('Identificación completada. Procediendo a la siguiente etapa...');
    // In a real application, you would navigate to the next stage here.
    // For now, we'll just log the data.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header /> {/* Use the reusable Header component */}

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6">Etapa 1 - Identificación</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label htmlFor="patientName" className="block text-gray-700 font-medium mb-2">Nombre (EJ. KSL, sólo indicar iniciales)</Label>
            <Input
              id="patientName"
              type="text"
              placeholder="Ingresar nombre del paciente"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="age" className="block text-gray-700 font-medium mb-2">Edad</Label>
            <Input
              id="age"
              type="number"
              placeholder="Ingresar edad del paciente"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="0"
              max="120"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                id="medicalHistoryToggle"
                checked={medicalHistoryToggle}
                onCheckedChange={setMedicalHistoryToggle}
              />
              <Label htmlFor="medicalHistoryToggle" className="text-gray-700 font-medium">Antecedentes médicos (opcional):</Label>
            </div>
            {medicalHistoryToggle && (
              <Textarea
                id="medicalHistory"
                rows={3}
                placeholder="Ingrese antecedentes médicos relevantes..."
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            )}
          </div>

          <div className="mb-6">
            <Label htmlFor="swallowingHistory" className="block text-gray-700 font-medium mb-2">Antecedentes de deglución previo (opcional)</Label>
            <Textarea
              id="swallowingHistory"
              rows={3}
              placeholder="Ingrese antecedentes de deglución previos..."
              value={swallowingHistory}
              onChange={(e) => setSwallowingHistory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <Button type="submit" className="w-full p-3 bg-[#e99e7c] text-white font-medium rounded-lg hover:bg-[#ea8a66] transition-colors">
            Siguiente
          </Button>
        </form>
      </div>
    </div>
  );
};

export default IdentificationPage;