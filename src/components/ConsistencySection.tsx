"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ConsistencyEvaluation, DeglutionNutritivaData } from '@/types/evaluation';

interface ConsistencySectionProps {
  title: string;
  consistencyKey: keyof Omit<DeglutionNutritivaData, 'evaluatedNutritiveDeglution'>; // e.g., 'liquidFine'
  data: ConsistencyEvaluation | undefined;
  onDataChange: (key: keyof Omit<DeglutionNutritivaData, 'evaluatedNutritiveDeglution'>, newData: ConsistencyEvaluation) => void;
}

const volumeOptions = ['3ml', '5ml', '10ml', '20ml'];
const alarmSigns = [
  { key: 'cough', label: 'Tos' },
  { key: 'wetVoice', label: 'Voz húmeda' },
  { key: 'voiceClearing', label: 'Aclaramiento de voz' },
  { key: 'stridor', label: 'Estridor' },
  { key: 'dyspnea', label: 'Disnea' },
  { key: 'cyanosis', label: 'Cianosis' },
];

const ConsistencySection: React.FC<ConsistencySectionProps> = ({ title, consistencyKey, data, onDataChange }) => {
  const currentData = data || {
    volume: undefined,
    cough: false,
    wetVoice: false,
    voiceClearing: false,
    stridor: false,
    dyspnea: false,
    cyanosis: false,
    otherSignsText: '',
  };

  const handleVolumeChange = (value: string) => {
    onDataChange(consistencyKey, { ...currentData, volume: value as ConsistencyEvaluation['volume'] });
  };

  const handleAlarmSignChange = (key: keyof Omit<ConsistencyEvaluation, 'volume' | 'otherSignsText'>, checked: boolean) => {
    onDataChange(consistencyKey, { ...currentData, [key]: checked });
  };

  const handleOtherSignsTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange(consistencyKey, { ...currentData, otherSignsText: e.target.value });
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="mb-4">
        <Label className="block text-gray-700 font-medium mb-2">Volumen:</Label>
        <RadioGroup onValueChange={handleVolumeChange} value={currentData.volume} className="flex flex-wrap gap-x-4 gap-y-2">
          {volumeOptions.map((vol) => (
            <div key={vol} className="flex items-center space-x-2">
              <RadioGroupItem value={vol} id={`${consistencyKey}-volume-${vol}`} />
              <Label htmlFor={`${consistencyKey}-volume-${vol}`}>{vol}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="mb-4">
        <Label className="block text-gray-700 font-medium mb-2">Signos de alarma:</Label>
        <div className="grid grid-cols-2 gap-2 ml-4">
          {alarmSigns.map((sign) => (
            <div key={sign.key} className="flex items-center space-x-2">
              <Checkbox
                id={`${consistencyKey}-${sign.key}`}
                checked={currentData[sign.key as keyof ConsistencyEvaluation] as boolean}
                onCheckedChange={(checked) => handleAlarmSignChange(sign.key as keyof Omit<ConsistencyEvaluation, 'volume' | 'otherSignsText'>, checked as boolean)}
                className="data-[state=checked]:bg-efodea-blue"
              />
              <Label htmlFor={`${consistencyKey}-${sign.key}`}>{sign.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor={`${consistencyKey}-otherSigns`} className="block text-gray-700 font-medium mb-2">Otros signos:</Label>
        <Textarea
          id={`${consistencyKey}-otherSigns`}
          rows={2}
          placeholder="Especificar otros signos de alarma..."
          value={currentData.otherSignsText}
          onChange={handleOtherSignsTextChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
    </div>
  );
};

export default ConsistencySection;