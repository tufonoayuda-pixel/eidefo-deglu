"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch"; // Import Switch
import { toast } from 'sonner';
import Header from '@/components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { CommunicationData, EvaluationData } from '@/types/evaluation';

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
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData;

  // Initialize state from previous data or defaults
  const [isCooperativeAndOriented, setIsCooperativeAndOriented] = useState(prevEvaluationData?.communication?.isCooperativeAndOriented || false);
  const [isNotEvaluable, setIsNotEvaluable] = useState(prevEvaluationData?.communication?.isNotEvaluable || false);
  const [hasCognitiveBehavioralAlteration, setHasCognitiveBehavioralAlteration] = useState(prevEvaluationData?.communication?.hasCognitiveBehavioralAlteration || false);
  const [hasVoiceAlteration, setHasVoiceAlteration] = useState(prevEvaluationData?.communication?.hasVoiceAlteration || false);

  const [selectedCooperation, setSelectedCooperation] = useState<string | undefined>(prevEvaluationData?.communication?.selectedCooperation);
  const [selectedAttention, setSelectedAttention] = useState<string | undefined>(prevEvaluationData?.communication?.selectedAttention);
  const [selectedCalmness, setSelectedCalmness] = useState<string | undefined>(prevEvaluationData?.communication?.selectedCalmness);
  const [selectedOrientation, setSelectedOrientation] = useState<string | undefined>(prevEvaluationData?.communication?.selectedOrientation);
  const [selectedInstructionFollowing, setSelectedInstructionFollowing] = useState<string | undefined>(prevEvaluationData?.communication?.selectedInstructionFollowing);
  const [selectedVoiceAlterationType, setSelectedVoiceAlterationType] = useState<string | undefined>(prevEvaluationData?.communication?.selectedVoiceAlterationType);

  // Helper to manage mutual exclusivity for main states
  const handleMainStateChange = (stateKey: 'cooperative' | 'notEvaluable', checked: boolean) => {
    if (stateKey === 'cooperative') {
      setIsCooperativeAndOriented(checked);
      if (checked) {
        setIsNotEvaluable(false);
        setHasCognitiveBehavioralAlteration(false);
        setHasVoiceAlteration(false);
        // Clear sub-options if main state is cooperative
        setSelectedCooperation(undefined);
        setSelectedAttention(undefined);
        setSelectedCalmness(undefined);
        setSelectedOrientation(undefined);
        setSelectedInstructionFollowing(undefined);
        setSelectedVoiceAlterationType(undefined);
      }
    } else if (stateKey === 'notEvaluable') {
      setIsNotEvaluable(checked);
      if (checked) {
        setIsCooperativeAndOriented(false);
        setHasCognitiveBehavioralAlteration(false);
        setHasVoiceAlteration(false);
        // Clear sub-options if main state is not evaluable
        setSelectedCooperation(undefined);
        setSelectedAttention(undefined);
        setSelectedCalmness(undefined);
        setSelectedOrientation(undefined);
        setSelectedInstructionFollowing(undefined);
        setSelectedVoiceAlterationType(undefined);
      }
    }
  };

  // Helper to manage mutual exclusivity for alteration switches
  const handleAlterationSwitchChange = (alterationKey: 'cognitive' | 'voice', checked: boolean) => {
    if (checked) {
      setIsCooperativeAndOriented(false);
      setIsNotEvaluable(false);
    }

    if (alterationKey === 'cognitive') {
      setHasCognitiveBehavioralAlteration(checked);
      if (!checked) {
        setSelectedCooperation(undefined);
        setSelectedAttention(undefined);
        setSelectedCalmness(undefined);
        setSelectedOrientation(undefined);
        setSelectedInstructionFollowing(undefined);
      }
    } else if (alterationKey === 'voice') {
      setHasVoiceAlteration(checked);
      if (!checked) {
        setSelectedVoiceAlterationType(undefined);
      }
    }
  };

  const handleBack = () => {
    navigate('/consciousness', { state: { evaluationData: prevEvaluationData } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    if (!isCooperativeAndOriented && !isNotEvaluable && !hasCognitiveBehavioralAlteration && !hasVoiceAlteration) {
      toast.error('Por favor, seleccione al menos una opción de comunicación.');
      return;
    }

    if (hasCognitiveBehavioralAlteration) {
      if (!selectedCooperation || !selectedAttention || !selectedCalmness || !selectedOrientation || !selectedInstructionFollowing) {
        toast.error('Por favor, complete todas las sub-opciones de Alteración cognitiva-conductual.');
        return;
      }
    }

    if (hasVoiceAlteration) {
      if (!selectedVoiceAlterationType) {
        toast.error('Por favor, seleccione el tipo de alteración en la voz.');
        return;
      }
    }

    const currentData: CommunicationData = {
      isCooperativeAndOriented,
      isNotEvaluable,
      hasCognitiveBehavioralAlteration,
      hasVoiceAlteration,
      selectedCooperation: hasCognitiveBehavioralAlteration ? selectedCooperation : undefined,
      selectedAttention: hasCognitiveBehavioralAlteration ? selectedAttention : undefined,
      selectedCalmness: hasCognitiveBehavioralAlteration ? selectedCalmness : undefined,
      selectedOrientation: hasCognitiveBehavioralAlteration ? selectedOrientation : undefined,
      selectedInstructionFollowing: hasCognitiveBehavioralAlteration ? selectedInstructionFollowing : undefined,
      selectedVoiceAlterationType: hasVoiceAlteration ? selectedVoiceAlterationType : undefined,
    };

    const evaluationData: EvaluationData = {
      ...prevEvaluationData,
      communication: currentData,
    };

    toast.success('Etapa 5 - Comunicación completada. Procediendo a la siguiente etapa...');
    navigate('/orofacial-evaluation', { state: { evaluationData } });
  };

  // Determine if alteration switches should be disabled
  const areAlterationSwitchesDisabled = isCooperativeAndOriented || isNotEvaluable;

  // Determine the value for the main radio group
  let mainRadioValue: string | undefined;
  if (isCooperativeAndOriented) {
    mainRadioValue = 'cooperative';
  } else if (isNotEvaluable) {
    mainRadioValue = 'notEvaluable';
  } else {
    mainRadioValue = undefined; // No main radio selected if alterations are active
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6">Etapa 5 - Comunicación</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-6">
            {/* Main Radio Group for mutually exclusive states */}
            <RadioGroup
              onValueChange={(value) => {
                if (value === 'cooperative') {
                  handleMainStateChange('cooperative', true);
                } else if (value === 'notEvaluable') {
                  handleMainStateChange('notEvaluable', true);
                }
              }}
              value={mainRadioValue}
              className="flex flex-col space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cooperative" id="main-comm-cooperative" disabled={hasCognitiveBehavioralAlteration || hasVoiceAlteration} />
                <Label htmlFor="main-comm-cooperative" className="text-gray-700 font-medium">Cooperador, atento, tranquilo, orientado con seguimiento de instrucciones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="notEvaluable" id="main-comm-not-evaluable" disabled={hasCognitiveBehavioralAlteration || hasVoiceAlteration} />
                <Label htmlFor="main-comm-not-evaluable" className="text-gray-700 font-medium">No evaluable</Label>
              </div>
            </RadioGroup>

            {/* Independent Switches for Alterations */}
            <div className="flex items-center justify-between">
              <Label htmlFor="hasCognitiveBehavioralAlteration" className="text-gray-700 font-medium">Alteración cognitiva-conductual</Label>
              <Switch
                id="hasCognitiveBehavioralAlteration"
                checked={hasCognitiveBehavioralAlteration}
                onCheckedChange={(checked) => handleAlterationSwitchChange('cognitive', checked)}
                disabled={areAlterationSwitchesDisabled}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {hasCognitiveBehavioralAlteration && (
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

            <div className="flex items-center justify-between">
              <Label htmlFor="hasVoiceAlteration" className="text-gray-700 font-medium">Presenta alteración en la voz</Label>
              <Switch
                id="hasVoiceAlteration"
                checked={hasVoiceAlteration}
                onCheckedChange={(checked) => handleAlterationSwitchChange('voice', checked)}
                disabled={areAlterationSwitchesDisabled}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {hasVoiceAlteration && (
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

export default CommunicationPage;