"use client";

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { DeglutionNutritivaData, EvaluationData, ConsistencyEvaluation } from '@/types/evaluation';
import ConsistencySection from '@/components/ConsistencySection'; // Import the new component
import { toast } from 'sonner';

const DeglutionNutritivaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData;

  const [deglutionNutritivaData, setDeglutionNutritivaData] = useState<DeglutionNutritivaData>(
    prevEvaluationData?.deglutionNutritiva || {
      evaluatedNutritiveDeglution: true,
      liquidFine: undefined,
      liquidNectar: undefined,
      liquidHoney: undefined,
      puree: undefined,
      softSolid: undefined,
      solid: undefined,
    }
  );

  const handleConsistencyDataChange = (
    key: keyof Omit<DeglutionNutritivaData, 'evaluatedNutritiveDeglution'>,
    newData: ConsistencyEvaluation
  ) => {
    setDeglutionNutritivaData((prev) => ({
      ...prev,
      [key]: newData,
    }));
  };

  const calculateNutritiveScore = (data: DeglutionNutritivaData): number => {
    let totalIssuesFound = 0;
    let totalPossibleIssues = 0;

    const consistencyKeys: (keyof Omit<DeglutionNutritivaData, 'evaluatedNutritiveDeglution'>)[] = [
      'liquidFine', 'liquidNectar', 'liquidHoney', 'puree', 'softSolid', 'solid'
    ];

    consistencyKeys.forEach(key => {
      const consistency = data[key];
      if (consistency) {
        // Each consistency evaluated contributes to the total possible issues
        totalPossibleIssues += 6; // For the 6 boolean alarm signs
        if (consistency.otherSignsText.trim() !== '') {
          totalPossibleIssues += 1; // For the 'otros' text field
        }

        if (consistency.cough) totalIssuesFound++;
        if (consistency.wetVoice) totalIssuesFound++;
        if (consistency.voiceClearing) totalIssuesFound++;
        if (consistency.stridor) totalIssuesFound++;
        if (consistency.dyspnea) totalIssuesFound++;
        if (consistency.cyanosis) totalIssuesFound++;
        if (consistency.otherSignsText.trim() !== '') totalIssuesFound++;
      }
    });

    if (totalPossibleIssues === 0) {
      return 100; // If no consistencies were evaluated, assume 100%
    }

    const score = 100 - (totalIssuesFound / totalPossibleIssues) * 100;
    return Math.max(0, parseFloat(score.toFixed(1)));
  };

  const handleBack = () => {
    navigate('/deglution-result', { state: { evaluationData: prevEvaluationData } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: ensure at least one consistency has a volume selected if evaluated
    const evaluatedConsistencies = Object.values(deglutionNutritivaData).filter(
      (val) => typeof val === 'object' && val !== null && 'volume' in val && val.volume !== undefined
    );

    if (evaluatedConsistencies.length === 0) {
      toast.error('Por favor, evalúe al menos una consistencia de deglución nutritiva.');
      return;
    }

    const score = calculateNutritiveScore(deglutionNutritivaData);

    const evaluationData: EvaluationData = {
      ...prevEvaluationData,
      deglutionNutritiva: deglutionNutritivaData,
      deglutionNutritivaScore: score,
    };

    toast.success('Etapa 10 - Deglución Nutritiva completada. Procediendo a las conclusiones...');
    navigate('/conclusions', { state: { evaluationData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6 text-center">Etapa 10 - Deglución Nutritiva</h1>
        <p className="text-center text-gray-700 mb-8">
          Registre los detalles de la evaluación con diferentes consistencias alimentarias.
        </p>

        <form onSubmit={handleSubmit}>
          <ConsistencySection
            title="A. Consistencia Líquida Fina (Agua)"
            consistencyKey="liquidFine"
            data={deglutionNutritivaData.liquidFine}
            onDataChange={handleConsistencyDataChange}
          />
          <ConsistencySection
            title="B. Consistencia Líquida Néctar (Espesada)"
            consistencyKey="liquidNectar"
            data={deglutionNutritivaData.liquidNectar}
            onDataChange={handleConsistencyDataChange}
          />
          <ConsistencySection
            title="C. Consistencia Líquida Miel (Espesada)"
            consistencyKey="liquidHoney"
            data={deglutionNutritivaData.liquidHoney}
            onDataChange={handleConsistencyDataChange}
          />
          <ConsistencySection
            title="D. Consistencia Puré (Papilla)"
            consistencyKey="puree"
            data={deglutionNutritivaData.puree}
            onDataChange={handleConsistencyDataChange}
          />
          <ConsistencySection
            title="E. Consistencia Sólido Blando (Pan de molde)"
            consistencyKey="softSolid"
            data={deglutionNutritivaData.softSolid}
            onDataChange={handleConsistencyDataChange}
          />
          <ConsistencySection
            title="F. Consistencia Sólido (Galleta)"
            consistencyKey="solid"
            data={deglutionNutritivaData.solid}
            onDataChange={handleConsistencyDataChange}
          />

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

export default DeglutionNutritivaPage;