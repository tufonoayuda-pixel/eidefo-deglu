"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';
import { IdentificationData, EvaluationData } from '@/types/evaluation'; // Import interfaces

const medicalHistoryOptions = [
  "ACV",
  "TEC",
  "Tumor",
  "TNC menor",
  "TNC mayor",
  "EPOC",
  "COVID-19",
];

const IdentificationPage = () => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistoryToggle, setMedicalHistoryToggle] = useState(false);
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<string[]>([]);
  const [otherMedicalHistory, setOtherMedicalHistory] = useState('');
  const [swallowingHistory, setSwallowingHistory] = useState('');

  const handleCheckboxChange = (option: string, checked: boolean) => {
    setSelectedMedicalHistory((prev) =>
      checked ? [...prev, option] : prev.filter((item) => item !== option)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !age) {
      toast.error('Por favor complete los campos obligatorios (Nombre y Edad).');
      return;
    }

    const finalMedicalHistory = medicalHistoryToggle
      ? selectedMedicalHistory.includes("OTRO") && otherMedicalHistory
        ? [...selectedMedicalHistory.filter(item => item !== "OTRO"), `OTRO: ${otherMedicalHistory}`]
        : selectedMedicalHistory
      : [];

    const currentData: IdentificationData = {
      patientName,
      age,
      medicalHistoryToggle,
      selectedMedicalHistory: finalMedicalHistory,
      otherMedicalHistory,
      swallowingHistory
    };

    const evaluationData: EvaluationData = {
      identification: currentData,
    };

    toast.success('Identificación completada. Procediendo a la siguiente etapa...');
    navigate('/respiration', { state: { evaluationData } }); // Pass data to the next page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6">Etapa 1 - Identificación</h1>

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
                onCheckedChange={(checked) => {
                  setMedicalHistoryToggle(checked);
                  if (!checked) {
                    setSelectedMedicalHistory([]); // Clear selections when toggle is off
                    setOtherMedicalHistory('');
                  }
                }}
              />
              <Label htmlFor="medicalHistoryToggle" className="text-gray-700 font-medium">Antecedentes médicos (opcional):</Label>
            </div>
            {medicalHistoryToggle && (
              <div className="mt-4 space-y-2">
                {medicalHistoryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`medical-history-${option}`}
                      checked={selectedMedicalHistory.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                    />
                    <Label htmlFor={`medical-history-${option}`}>{option}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medical-history-other"
                    checked={selectedMedicalHistory.includes("OTRO")}
                    onCheckedChange={(checked) => handleCheckboxChange("OTRO", checked as boolean)}
                  />
                  <Label htmlFor="medical-history-other">OTRO</Label>
                </div>
                {selectedMedicalHistory.includes("OTRO") && (
                  <Input
                    id="otherMedicalHistory"
                    type="text"
                    placeholder="Especificar otros antecedentes médicos..."
                    value={otherMedicalHistory}
                    onChange={(e) => setOtherMedicalHistory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mt-2"
                  />
                )}
              </div>
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

          <Button type="submit" className="w-full p-3 bg-efodea-blue text-white font-medium rounded-lg hover:bg-efodea-blue-hover transition-colors">
            Siguiente
          </Button>
        </form>
      </div>
    </div>
  );
};

export default IdentificationPage;