"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

const mainCommunicationOptions = [
  { value: "cooperador", label: "Cooperador, atento, tranquilo, orientado con seguimiento de instrucciones" },
  { value: "alteracion_cognitiva_conductual", label: "Alteración cognitiva-conductual" },
  { value: "no_alteracion_voz", label: "No presenta alteración en la voz" },
  { value: "si_alteracion_voz", label: "Presenta alteración en la voz" },
  { value: "no_evaluable", label: "No evaluable" },
];

const cooperationOptions = ["Cooperador", "Cooperador parcial", "No cooperador"];
const attentionOptions = ["Atento", "Atento parcial", "Inatento"];
const calmnessOptions = ["Tranquilo", "Agitado"];
const orientationOptions = ["Orientado", "Orientado parcial", "No orientado"];
const instructionFollowingOptions = ["Sigue órdenes simples", "Sigue órdenes complejas", "No sigue órdenes"];

const voiceAlterationOptions = [
  "Voz húmeda", "Voz ronca", "Voz soplada", "Voz forzada",
  "Baja intensidad", "Alta intensidad", "Tono agudo", "Tono grave",
];

const CommunicationPage = () => {
  const navigate = useNavigate();
  const [mainCommunicationOption, setMainCommunicationOption] = useState<string | undefined>(undefined);

  // States for sub-options under "Alteración cognitiva-conductual"
  const [selectedCooperation, setSelectedCooperation] = useState<string | undefined>(undefined);
  const [selectedAttention, setSelectedAttention] = useState<string | undefined>(undefined);
  const [selectedCalmness, setSelectedCalmness] = useState<string | undefined>(undefined);
  const [selectedOrientation, setSelectedOrientation] = useState<string | undefined>(undefined);
  const [selectedInstructionFollowing, setSelectedInstructionFollowing] = useState<string | undefined>(undefined);

  // State for sub-options under "Presenta alteración en la voz"
  const [selectedVoiceAlterationType, setSelectedVoiceAlterationType] = useState<string | undefined>(undefined);

  const handleBack = () => {
    navigate('/consciousness'); // Navigate back to ConsciousnessPage
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainCommunicationOption) {
      toast.error('Por favor, seleccione una opción principal de comunicación.');
      return;
    }

    if (mainCommunicationOption === "alteracion_cognitiva_conductual") {
      if (!selectedCooperation || !selectedAttention || !selectedCalmness || !selectedOrientation || !selectedInstructionFollowing) {
        toast.error('Por favor, complete todas las sub-opciones de Alteración cognitiva-conductual.');
        return;
      }
    }

    if (mainCommunicationOption === "si_alteracion_voz") {
      if (!selectedVoiceAlterationType) {
        toast.error('Por favor, seleccione el tipo de alteración en la voz.');
        return;
      }
    }

    console.log('Datos de Comunicación:', {
      mainCommunicationOption,
      ...(mainCommunicationOption === "alteracion_cognitiva_conductual" && {
        selectedCooperation,
        selectedAttention,
        selectedCalmness,
        selectedOrientation,
        selectedInstructionFollowing,
      }),
      ...(mainCommunicationOption === "si_alteracion_voz" && {
        selectedVoiceAlterationType,
      }),
    });

    toast.success('Etapa 5 - Comunicación completada. Procediendo a la siguiente etapa...');
    // Here you would navigate to the next stage, e.g., navigate('/next-stage');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6">Etapa 5 - Comunicación</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            <RadioGroup
              onValueChange={(value) => {
                setMainCommunicationOption(value);
                // Clear sub-options if main option changes
                if (value !== "alteracion_cognitiva_conductual") {
                  setSelectedCooperation(undefined);
                  setSelectedAttention(undefined);
                  setSelectedCalmness(undefined);
                  setSelectedOrientation(undefined);
                  setSelectedInstructionFollowing(undefined);
                }
                if (value !== "si_alteracion_voz") {
                  setSelectedVoiceAlterationType(undefined);
                }
              }}
              value={mainCommunicationOption}
              className="flex flex-col space-y-4"
            >
              {mainCommunicationOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`main-comm-${option.value}`} />
                  <Label htmlFor={`main-comm-${option.value}`} className="text-gray-700 font-medium">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>

            {mainCommunicationOption === "alteracion_cognitiva_conductual" && (
              <div className="ml-8 mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalle de Alteración cognitiva-conductual:</h3>
                
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Cooperación:</Label>
                  <RadioGroup onValueChange={setSelectedCooperation} value={selectedCooperation} className="flex flex-col space-y-1 ml-4">
                    {cooperationOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`cooperation-${option}`} />
                        <Label htmlFor={`cooperation-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Atención:</Label>
                  <RadioGroup onValueChange={setSelectedAttention} value={selectedAttention} className="flex flex-col space-y-1 ml-4">
                    {attentionOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`attention-${option}`} />
                        <Label htmlFor={`attention-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Tranquilidad:</Label>
                  <RadioGroup onValueChange={setSelectedCalmness} value={selectedCalmness} className="flex flex-col space-y-1 ml-4">
                    {calmnessOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`calmness-${option}`} />
                        <Label htmlFor={`calmness-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Orientación:</Label>
                  <RadioGroup onValueChange={setSelectedOrientation} value={selectedOrientation} className="flex flex-col space-y-1 ml-4">
                    {orientationOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`orientation-${option}`} />
                        <Label htmlFor={`orientation-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Seguimiento de Instrucciones:</Label>
                  <RadioGroup onValueChange={setSelectedInstructionFollowing} value={selectedInstructionFollowing} className="flex flex-col space-y-1 ml-4">
                    {instructionFollowingOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`instructions-${option}`} />
                        <Label htmlFor={`instructions-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {mainCommunicationOption === "si_alteracion_voz" && (
              <div className="ml-8 mt-4 space-y-2 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tipo de Alteración en la Voz:</h3>
                <RadioGroup onValueChange={setSelectedVoiceAlterationType} value={selectedVoiceAlterationType} className="flex flex-col space-y-2">
                  {voiceAlterationOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`voice-alteration-${option}`} />
                      <Label htmlFor={`voice-alteration-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
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

export default CommunicationPage;