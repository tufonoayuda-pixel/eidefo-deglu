"use client";

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { EvaluationData, ConsistencyEvaluation } from '@/types/evaluation'; // Import the main interface
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const evaluationData: EvaluationData | undefined = location.state?.evaluationData;
  const [isDownloading, setIsDownloading] = useState(false);

  if (!evaluationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-700">No hay datos de evaluación para mostrar.</p>
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    toast.loading('Generando PDF, por favor espere...');

    const element = document.getElementById('evaluation-summary-content');
    if (element) {
      const opt = {
        margin: 0.5,
        filename: `EIDEFO_Evaluacion_${evaluationData.identification?.patientName || 'Paciente'}_${new Date().toLocaleDateString()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      try {
        await html2pdf().set(opt).from(element).save();
        toast.success('PDF generado y descargado con éxito.');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Error al generar el PDF. Por favor, inténtelo de nuevo.');
      } finally {
        setIsDownloading(false);
      }
    } else {
      toast.error('No se encontró el contenido para generar el PDF.');
      setIsDownloading(false);
    }
  };

  const handleFinishEvaluation = () => {
    navigate('/final-message');
  };

  const renderBoolean = (value: boolean | undefined) => (value ? 'Sí' : 'No');
  const renderString = (value: string | undefined) => value && value.trim() !== '' ? value : 'No especificado';
  const renderArray = (arr: string[] | undefined) => arr && arr.length > 0 ? arr.join(', ') : 'Ninguno';

  const renderConsistencyEvaluation = (data: ConsistencyEvaluation | undefined) => {
    if (!data || !data.volume) return <p className="text-gray-600">No evaluado.</p>;
    
    const alarmSignsPresent = [
      data.cough && 'Tos',
      data.wetVoice && 'Voz húmeda',
      data.voiceClearing && 'Aclaramiento de voz',
      data.stridor && 'Estridor',
      data.dyspnea && 'Disnea',
      data.cyanosis && 'Cianosis',
      data.otherSignsText.trim() !== '' && `Otros: ${data.otherSignsText}`,
    ].filter(Boolean);

    return (
      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
        <li><span className="font-medium">Volumen:</span> {renderString(data.volume)}</li>
        {alarmSignsPresent.length > 0 && (
          <li><span className="font-medium">Signos de alarma:</span> {alarmSignsPresent.join(', ')}</li>
        )}
      </ul>
    );
  };

  // Helper to map internal values to display labels
  const mapValueToLabel = (value: string, options: { value: string; label: string }[]) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const mapArrayToLabels = (values: string[] | undefined, options: { value: string; label: string }[]) => {
    if (!values || values.length === 0) return 'Ninguno';
    return values.map(value => mapValueToLabel(value, options)).join(', ');
  };

  const { conclusions } = evaluationData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6 text-center">Resumen de la Evaluación</h1>

        <div id="evaluation-summary-content" className="space-y-8"> {/* ID for PDF generation */}
          {/* Etapa 1 - Identificación */}
          {evaluationData.identification && (
            <div className="mb-8 p-4 border rounded-lg bg-blue-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 1 - Identificación</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><span className="font-medium">Nombre Paciente:</span> {renderString(evaluationData.identification.patientName)}</li>
                <li><span className="font-medium">Edad Paciente:</span> {renderString(evaluationData.identification.age)}</li>
                {evaluationData.identification.medicalHistoryToggle && (
                  <>
                    <li><span className="font-medium">Antecedentes médicos:</span> {renderBoolean(evaluationData.identification.medicalHistoryToggle)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {evaluationData.identification.selectedMedicalHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                      {evaluationData.identification.selectedMedicalHistory.includes("OTRO") && evaluationData.identification.otherMedicalHistory.trim() !== '' && (
                        <li>OTRO: {renderString(evaluationData.identification.otherMedicalHistory)}</li>
                      )}
                    </ul>
                  </>
                )}
                {evaluationData.identification.swallowingHistory.trim() !== '' && (
                  <li><span className="font-medium">Antecedentes de deglución previo:</span> {renderString(evaluationData.identification.swallowingHistory)}</li>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 2 - Respiración */}
          {evaluationData.respiration && (
            <div className="mb-8 p-4 border rounded-lg bg-green-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 2 - Respiración</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.respiration.noArtificialAirway && (
                  <>
                    <li><span className="font-medium">Sin uso de vía aérea artificial:</span> {renderBoolean(evaluationData.respiration.noArtificialAirway)}</li>
                    {evaluationData.respiration.selectedRespirationOptions.length > 0 && (
                      <li><span className="font-medium">Opciones de respiración:</span> {renderArray(evaluationData.respiration.selectedRespirationOptions)}</li>
                    )}
                  </>
                )}
                {evaluationData.respiration.orotrachealIntubation && (
                  <li><span className="font-medium">Presentó intubación orotraqueal:</span> {renderBoolean(evaluationData.respiration.orotrachealIntubation)}</li>
                )}
                {evaluationData.respiration.tracheostomy && (
                  <li><span className="font-medium">Presenta uso de traqueostomía:</span> {renderBoolean(evaluationData.respiration.tracheostomy)}</li>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 3 - Nutrición */}
          {evaluationData.nutrition && (
            <div className="mb-8 p-4 border rounded-lg bg-yellow-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 3 - Nutrición</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.nutrition.hasOralFeeding && (
                  <>
                    <li><span className="font-medium">Presenta alimentación oral:</span> {renderBoolean(evaluationData.nutrition.hasOralFeeding)}</li>
                    {evaluationData.nutrition.selectedOralConsistency && (
                      <li><span className="font-medium">Consistencia oral seleccionada:</span> {renderString(evaluationData.nutrition.selectedOralConsistency)}</li>
                    )}
                  </>
                )}
                {evaluationData.nutrition.hasNonOralFeeding && (
                  <li><span className="font-medium">Presenta alimentación no oral:</span> {renderBoolean(evaluationData.nutrition.hasNonOralFeeding)}</li>
                )}
                {evaluationData.nutrition.hasMixedFeeding && (
                  <li><span className="font-medium">Presenta alimentación mixta:</span> {renderBoolean(evaluationData.nutrition.hasMixedFeeding)}</li>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 4 - Estado de conciencia */}
          {evaluationData.consciousness && (
            <div className="mb-8 p-4 border rounded-lg bg-purple-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 4 - Estado de conciencia</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.consciousness.isVigil && (
                  <li><span className="font-medium">Vigil:</span> {renderBoolean(evaluationData.consciousness.isVigil)}</li>
                )}
                {evaluationData.consciousness.hasAlteredConsciousness && (
                  <>
                    <li><span className="font-medium">Alteración de conciencia:</span> {renderBoolean(evaluationData.consciousness.hasAlteredConsciousness)}</li>
                    {evaluationData.consciousness.selectedAlteredConsciousness.length > 0 && (
                      <li><span className="font-medium">Tipos de alteración:</span> {renderArray(evaluationData.consciousness.selectedAlteredConsciousness)}</li>
                    )}
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 5 - Comunicación */}
          {evaluationData.communication && (
            <div className="mb-8 p-4 border rounded-lg bg-red-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 5 - Comunicación</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.communication.mainCommunicationOption && (
                  <li><span className="font-medium">Opción principal de comunicación:</span> {renderString(evaluationData.communication.mainCommunicationOption)}</li>
                )}
                {evaluationData.communication.mainCommunicationOption === "alteracion_cognitiva_conductual" && (
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                    {evaluationData.communication.selectedCooperation && <li><span className="font-medium">Cooperación:</span> {renderString(evaluationData.communication.selectedCooperation)}</li>}
                    {evaluationData.communication.selectedAttention && <li><span className="font-medium">Atención:</span> {renderString(evaluationData.communication.selectedAttention)}</li>}
                    {evaluationData.communication.selectedCalmness && <li><span className="font-medium">Tranquilidad:</span> {renderString(evaluationData.communication.selectedCalmness)}</li>}
                    {evaluationData.communication.selectedOrientation && <li><span className="font-medium">Orientación:</span> {renderString(evaluationData.communication.selectedOrientation)}</li>}
                    {evaluationData.communication.selectedInstructionFollowing && <li><span className="font-medium">Seguimiento de Instrucciones:</span> {renderString(evaluationData.communication.selectedInstructionFollowing)}</li>}
                  </ul>
                )}
                {evaluationData.communication.mainCommunicationOption === "si_alteracion_voz" && evaluationData.communication.selectedVoiceAlterationType && (
                  <li><span className="font-medium">Tipo de alteración en la voz:</span> {renderString(evaluationData.communication.selectedVoiceAlterationType)}</li>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 6 - Evaluación estructural orofacial */}
          {evaluationData.orofacialEvaluation && (
            <div className="mb-8 p-4 border rounded-lg bg-indigo-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 6 - Evaluación estructural orofacial</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.orofacialEvaluation.noPresentaAlteracion && (
                  <li><span className="font-medium">No presenta alteración:</span> {renderBoolean(evaluationData.orofacialEvaluation.noPresentaAlteracion)}</li>
                )}
                {evaluationData.orofacialEvaluation.alteracionEstructuras && (
                  <li><span className="font-medium">Alteración de estructuras orofaciales:</span> {renderBoolean(evaluationData.orofacialEvaluation.alteracionEstructuras)}</li>
                )}
                {evaluationData.orofacialEvaluation.alteracionMotora && (
                  <>
                    <li><span className="font-medium">Alteración motora:</span> {renderBoolean(evaluationData.orofacialEvaluation.alteracionMotora)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {evaluationData.orofacialEvaluation.rangoFuerzaRostroMandibula && (
                        <li>
                          Rango, fuerza y coordinación rostro y mandíbula:
                          {evaluationData.orofacialEvaluation.rangoFuerzaRostroMandibulaDerecha && ' Derecha'}
                          {evaluationData.orofacialEvaluation.rangoFuerzaRostroMandibulaIzquierda && ' Izquierda'}
                        </li>
                      )}
                      {evaluationData.orofacialEvaluation.rangoFuerzaLabios && (
                        <li>
                          Rango, fuerza y coordinación labios:
                          {evaluationData.orofacialEvaluation.rangoFuerzaLabiosDerecha && ' Derecha'}
                          {evaluationData.orofacialEvaluation.rangoFuerzaLabiosIzquierda && ' Izquierda'}
                        </li>
                      )}
                      {evaluationData.orofacialEvaluation.rangoFuerzaLengua && (
                        <li>
                          Rango, fuerza y coordinación lengua:
                          {evaluationData.orofacialEvaluation.rangoFuerzaLenguaDerecha && ' Derecha'}
                          {evaluationData.orofacialEvaluation.rangoFuerzaLenguaIzquierda && ' Izquierda'}
                        </li>
                      )}
                    </ul>
                  </>
                )}
                {evaluationData.orofacialEvaluation.alteracionSensibilidad && (
                  <>
                    <li><span className="font-medium">Alteración de sensibilidad oral:</span> {renderBoolean(evaluationData.orofacialEvaluation.alteracionSensibilidad)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {evaluationData.orofacialEvaluation.sensibilidadExtraoralDerecha && <li>Sensibilidad extraoral derecha</li>}
                      {evaluationData.orofacialEvaluation.sensibilidadExtraoralIzquierda && <li>Sensibilidad extraoral izquierda</li>}
                      {evaluationData.orofacialEvaluation.sensibilidadIntraoralDerecha && <li>Sensibilidad intraoral derecha</li>}
                      {evaluationData.orofacialEvaluation.sensibilidadIntraoralIzquierda && <li>Sensibilidad intraoral izquierda</li>}
                    </ul>
                  </>
                )}
                {evaluationData.orofacialEvaluation.asimetriaFacial && (
                  <li><span className="font-medium">Asimetría facial:</span> {renderBoolean(evaluationData.orofacialEvaluation.asimetriaFacial)}</li>
                )}
                {evaluationData.orofacialEvaluation.higieneOral && (
                  <>
                    <li><span className="font-medium">Higiene oral:</span> {renderBoolean(evaluationData.orofacialEvaluation.higieneOral)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {evaluationData.orofacialEvaluation.higieneBuena && <li>Buena</li>}
                      {evaluationData.orofacialEvaluation.higieneMala && <li>Mala</li>}
                      {evaluationData.orofacialEvaluation.higieneRegular && <li>Regular</li>}
                    </ul>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 7 - Dentición */}
          {evaluationData.dentition && (
            <div className="mb-8 p-4 border rounded-lg bg-pink-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 7 - Dentición</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.dentition.noPresentaAlteracion && (
                  <li><span className="font-medium">No presenta alteración de la dentición:</span> {renderBoolean(evaluationData.dentition.noPresentaAlteracion)}</li>
                )}
                {evaluationData.dentition.perdidaPiezas && (
                  <>
                    <li><span className="font-medium">Pérdida de piezas dentales con o sin uso de prótesis dental:</span> {renderBoolean(evaluationData.dentition.perdidaPiezas)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {evaluationData.dentition.superior && <li>Superior</li>}
                      {evaluationData.dentition.inferior && <li>Inferior</li>}
                      {evaluationData.dentition.adaptada && <li>Adaptada</li>}
                      {evaluationData.dentition.noAdaptada && <li>No adaptada</li>}
                      {evaluationData.dentition.total && <li>Total</li>}
                      {evaluationData.dentition.parcial && <li>Parcial</li>}
                      {evaluationData.dentition.usoAdhesivo && <li>Uso de adhesivo dental</li>}
                      {evaluationData.dentition.evaluacionConProtesis && <li>Evaluación realizada con uso de prótesis dental</li>}
                      {evaluationData.dentition.evaluacionSinProtesis && <li>Evaluación realizada sin uso de prótesis dental</li>}
                    </ul>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 8 - Reflejos */}
          {evaluationData.reflexes && (
            <div className="mb-8 p-4 border rounded-lg bg-teal-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 8 - Reflejos</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.reflexes.noPresentaAlteracion && (
                  <li><span className="font-medium">No presenta alteración de los reflejos:</span> {renderBoolean(evaluationData.reflexes.noPresentaAlteracion)}</li>
                )}
                {evaluationData.reflexes.presentaAlteracion && (
                  <>
                    <li><span className="font-medium">Presenta alteración de los reflejos:</span> {renderBoolean(evaluationData.reflexes.presentaAlteracion)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {(evaluationData.reflexes.tosVoluntariaProductiva || evaluationData.reflexes.tosVoluntariaNoProductiva || evaluationData.reflexes.tosVoluntariaAusente) && (
                        <li><span className="font-medium">Tos voluntaria:</span>
                          {evaluationData.reflexes.tosVoluntariaProductiva && ' Presente productiva'}
                          {evaluationData.reflexes.tosVoluntariaNoProductiva && ' Presente no productiva'}
                          {evaluationData.reflexes.tosVoluntariaAusente && ' Ausente'}
                        </li>
                      )}
                      {(evaluationData.reflexes.tosReflejaProductiva || evaluationData.reflexes.tosReflejaNoProductiva || evaluationData.reflexes.tosReflejaAusente) && (
                        <li><span className="font-medium">Tos refleja:</span>
                          {evaluationData.reflexes.tosReflejaProductiva && ' Presente productiva'}
                          {evaluationData.reflexes.tosReflejaNoProductiva && ' Presente no productiva'}
                          {evaluationData.reflexes.tosReflejaAusente && ' Ausente'}
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Etapa 9 - Deglución no nutritiva */}
          {evaluationData.deglutionNoNutritiva && (
            <div className="mb-8 p-4 border rounded-lg bg-cyan-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 9 - Deglución no nutritiva</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.deglutionNoNutritiva.sinAlteracion && (
                  <li><span className="font-medium">Sin alteración en deglución no nutritiva:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.sinAlteracion)}</li>
                )}
                {!evaluationData.deglutionNoNutritiva.sinAlteracion && (
                  <>
                    {evaluationData.deglutionNoNutritiva.acumulacionSaliva && (
                      <>
                        <li><span className="font-medium">Acumulación de saliva:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.acumulacionSaliva)}</li>
                        {evaluationData.deglutionNoNutritiva.escapeAnterior && <li><span className="font-medium">Escape anterior:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.escapeAnterior)}</li>}
                      </>
                    )}
                    {evaluationData.deglutionNoNutritiva.xerostomia && <li><span className="font-medium">Xerostomía:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.xerostomia)}</li>}
                    {evaluationData.deglutionNoNutritiva.noDegluteEspontaneamente && <li><span className="font-medium">No deglute saliva espontáneamente:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.noDegluteEspontaneamente)}</li>}
                    {evaluationData.deglutionNoNutritiva.rmoMasDeUnSegundo && <li><span className="font-medium">RMO (más de 1 segundo):</span> {renderBoolean(evaluationData.deglutionNoNutritiva.rmoMasDeUnSegundo)}</li>}
                    {evaluationData.deglutionNoNutritiva.excursionLaringeaAusente && <li><span className="font-medium">Excursión laríngea ausente:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.excursionLaringeaAusente)}</li>}
                    {evaluationData.deglutionNoNutritiva.odinofagia && <li><span className="font-medium">Odinofagia:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.odinofagia)}</li>}
                    {evaluationData.deglutionNoNutritiva.vozHumedaSinAclaramiento && (
                      <>
                        <li><span className="font-medium">Voz húmeda sin aclaramiento:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.vozHumedaSinAclaramiento)}</li>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                          {evaluationData.deglutionNoNutritiva.aclaraVozEspontanea && <li><span className="font-medium">Aclara la voz de forma espontánea:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozEspontanea)}</li>}
                          {evaluationData.deglutionNoNutritiva.aclaraVozSolicitud && <li><span className="font-medium">Aclara la voz a solicitud:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozSolicitud)}</li>}
                          {evaluationData.deglutionNoNutritiva.aclaraVozDegluciones && <li><span className="font-medium">Aclara la voz con degluciones consecutivas:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozDegluciones)}</li>}
                          {evaluationData.deglutionNoNutritiva.aclaraVozCarraspeo && <li><span className="font-medium">Aclara la voz con carraspeo:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozCarraspeo)}</li>}
                          {evaluationData.deglutionNoNutritiva.aclaraVozTos && <li><span className="font-medium">Aclara la voz con tos:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozTos)}</li>}
                        </ul>
                      </>
                    )}
                    {evaluationData.deglutionNoNutritiva.ascultacionCervicalHumeda && <li><span className="font-medium">Ascultación cervical húmeda:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.ascultacionCervicalHumeda)}</li>}
                    {evaluationData.deglutionNoNutritiva.bdtInmediato && <li><span className="font-medium">BDT (+) inmediato:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.bdtInmediato)}</li>}
                    {evaluationData.deglutionNoNutritiva.evaluacionPenetracion && <li><span className="font-medium">Evaluación instrumental presenta penetración:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.evaluacionPenetracion)}</li>}
                    {evaluationData.deglutionNoNutritiva.evaluacionAspiracion && <li><span className="font-medium">Evaluación instrumental presenta aspiración:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.evaluacionAspiracion)}</li>}
                    {evaluationData.deglutionNoNutritiva.evaluacionAspiracionSilente && <li><span className="font-medium">Evaluación instrumental presenta aspiración silente:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.evaluacionAspiracionSilente)}</li>}
                  </>
                )}
              </ul>
              {evaluationData.deglutionNoNutritivaScore !== undefined && (
                <p className="mt-4 text-lg font-bold text-gray-800">Puntaje de Deglución No Nutritiva: {evaluationData.deglutionNoNutritivaScore}%</p>
              )}
            </div>
          )}

          {/* Etapa 10 - Deglución Nutritiva */}
          {evaluationData.deglutionNutritiva && evaluationData.deglutionNutritiva.evaluatedNutritiveDeglution && (
            <div className="mb-8 p-4 border rounded-lg bg-orange-50">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 10 - Deglución Nutritiva</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><span className="font-medium">Evaluación de deglución nutritiva realizada:</span> {renderBoolean(evaluationData.deglutionNutritiva.evaluatedNutritiveDeglution)}</li>
                {evaluationData.deglutionNutritiva.liquidFine?.volume && (
                  <>
                    <li className="font-medium mt-2">Consistencia Líquida Fina (Agua):</li>
                    {renderConsistencyEvaluation(evaluationData.deglutionNutritiva.liquidFine)}
                  </>
                )}
                {evaluationData.deglutionNutritiva.liquidNectar?.volume && (
                  <>
                    <li className="font-medium mt-2">Consistencia Líquida Néctar (Espesada):</li>
                    {renderConsistencyEvaluation(evaluationData.deglutionNutritiva.liquidNectar)}
                  </>
                )}
                {evaluationData.deglutionNutritiva.liquidHoney?.volume && (
                  <>
                    <li className="font-medium mt-2">Consistencia Líquida Miel (Espesada):</li>
                    {renderConsistencyEvaluation(evaluationData.deglutionNutritiva.liquidHoney)}
                  </>
                )}
                {evaluationData.deglutionNutritiva.puree?.volume && (
                  <>
                    <li className="font-medium mt-2">Consistencia Puré (Papilla):</li>
                    {renderConsistencyEvaluation(evaluationData.deglutionNutritiva.puree)}
                  </>
                )}
                {evaluationData.deglutionNutritiva.softSolid?.volume && (
                  <>
                    <li className="font-medium mt-2">Consistencia Sólido Blando (Pan de molde):</li>
                    {renderConsistencyEvaluation(evaluationData.deglutionNutritiva.softSolid)}
                  </>
                )}
                {evaluationData.deglutionNutritiva.solid?.volume && (
                  <>
                    <li className="font-medium mt-2">Consistencia Sólido (Galleta):</li>
                    {renderConsistencyEvaluation(evaluationData.deglutionNutritiva.solid)}
                  </>
                )}
              </ul>
              {evaluationData.deglutionNutritivaScore !== undefined && (
                <p className="mt-4 text-lg font-bold text-gray-800">Puntaje de Deglución Nutritiva: {evaluationData.deglutionNutritivaScore}%</p>
              )}
            </div>
          )}

          {/* Etapa 10.4 - Conclusiones */}
          {conclusions && (
            <div className="mb-8 p-4 border rounded-lg bg-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 10.4 - Conclusiones</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {conclusions.sinTrastornoDeglucion && <li><span className="font-medium">Sin trastorno de la deglución:</span> {renderBoolean(conclusions.sinTrastornoDeglucion)}</li>}
                {conclusions.trastornoDeglucion && (
                  <>
                    <li><span className="font-medium">Trastorno de la deglución:</span> {renderBoolean(conclusions.trastornoDeglucion)}</li>
                    {conclusions.trastornoOrigen && (
                      <li><span className="font-medium">Origen del trastorno:</span> {renderString(conclusions.trastornoOrigen)}</li>
                    )}
                  </>
                )}
                {conclusions.noEsPosibleDeterminarGeneral && <li><span className="font-medium">No es posible determinar (general):</span> {renderBoolean(conclusions.noEsPosibleDeterminarGeneral)}</li>}
                {conclusions.escalaSeveridad && (
                  <>
                    <li><span className="font-medium">Escala de severidad:</span> {renderBoolean(conclusions.escalaSeveridad)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {conclusions.doss && <li><span className="font-medium">DOSS:</span> {renderString(conclusions.doss)}</li>}
                      {conclusions.fils && <li><span className="font-medium">FILS:</span> {renderString(conclusions.fils)}</li>}
                      {conclusions.fois && <li><span className="font-medium">FOIS:</span> {renderString(conclusions.fois)}</li>}
                    </ul>
                  </>
                )}
                {conclusions.alimentacionTotalBoca && <li><span className="font-medium">Alimentación total por boca:</span> {renderBoolean(conclusions.alimentacionTotalBoca)}</li>}
                {conclusions.alimentacionEnteral && <li><span className="font-medium">Alimentación enteral:</span> {renderBoolean(conclusions.alimentacionEnteral)}</li>}
                {conclusions.alimentacionMixta && <li><span className="font-medium">Alimentación mixta:</span> {renderBoolean(conclusions.alimentacionMixta)}</li>}
                {conclusions.soloConEspecialista && <li><span className="font-medium">Sólo con especialista:</span> {renderBoolean(conclusions.soloConEspecialista)}</li>}
                {conclusions.alimentosPermitidos && (
                  <>
                    <li><span className="font-medium">Alimentos permitidos:</span> {renderBoolean(conclusions.alimentosPermitidos)}</li>
                    {conclusions.alimentosPermitidosConsistencias.length > 0 && (
                      <li><span className="font-medium">Consistencias de alimentos permitidos:</span> {mapArrayToLabels(conclusions.alimentosPermitidosConsistencias, consistenciaAlimentosBebidasOptions)}</li>
                    )}
                  </>
                )}
                {conclusions.bebidasPermitidas && (
                  <>
                    <li><span className="font-medium">Bebidas permitidas:</span> {renderBoolean(conclusions.bebidasPermitidas)}</li>
                    {conclusions.bebidasPermitidasConsistencias.length > 0 && (
                      <li><span className="font-medium">Consistencias de bebidas permitidas:</span> {mapArrayToLabels(conclusions.bebidasPermitidasConsistencias, consistenciaAlimentosBebidasOptions)}</li>
                    )}
                  </>
                )}
                {conclusions.ningunaViscosidadPermitida && <li><span className="font-medium">Ninguna viscosidad permitida:</span> {renderBoolean(conclusions.ningunaViscosidadPermitida)}</li>}

                {/* Otras Recomendaciones */}
                {(conclusions.asistenciaVigilancia ||
                  conclusions.posicion45a90 ||
                  conclusions.maniobrasPosturales ||
                  conclusions.verificarResiduosBoca ||
                  conclusions.modificacionVolumen ||
                  conclusions.modificacionVelocidad ||
                  conclusions.modificacionTemperatura ||
                  conclusions.modificacionSabor ||
                  conclusions.modificacionTextura ||
                  conclusions.modificacionConsistencia ||
                  conclusions.modificacionViscosidad ||
                  conclusions.usoEspesante ||
                  conclusions.usoCucharaMedidora ||
                  conclusions.usoVasoAdaptado ||
                  conclusions.usoJeringa ||
                  conclusions.usoBombilla ||
                  conclusions.usoProtesisDental ||
                  conclusions.modificacionSensorial ||
                  conclusions.usoEstimulacionSensorial ||
                  conclusions.usoEstimulacionTermica ||
                  conclusions.usoEstimulacionMecanica ||
                  conclusions.usoEstimulacionElectrica ||
                  conclusions.usoEstimulacionFarmacologica ||
                  conclusions.usoEstimulacionOtros.trim() !== '' ||
                  conclusions.terapiaFonoaudiologica ||
                  conclusions.derivacionNutricionista ||
                  conclusions.derivacionKinesiologo ||
                  conclusions.derivacionTerapeutaOcupacional ||
                  conclusions.derivacionMedico ||
                  conclusions.derivacionOtros.trim() !== '' ||
                  conclusions.optimizarHigieneOral ||
                  conclusions.ningunaRecomendacion ||
                  conclusions.instalacionViaAlternativa ||
                  conclusions.evaluacionComplementaria ||
                  conclusions.evaluacionComunicativa) && (
                    <li className="font-bold mt-4">Otras Recomendaciones:</li>
                  )}
                {conclusions.asistenciaVigilancia && <li><span className="font-medium">Asistencia/Vigilancia:</span> {renderBoolean(conclusions.asistenciaVigilancia)}</li>}
                {conclusions.posicion45a90 && <li><span className="font-medium">Posición de 45° a 90°:</span> {renderBoolean(conclusions.posicion45a90)}</li>}
                
                {conclusions.maniobrasPosturales && (
                  <>
                    <li><span className="font-medium">Maniobras posturales:</span> {renderBoolean(conclusions.maniobrasPosturales)}</li>
                    {conclusions.maniobrasPosturalesTipos.length > 0 && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Tipos:</span> {mapArrayToLabels(conclusions.maniobrasPosturalesTipos, maniobrasPosturalesOptions)}</li>
                      </ul>
                    )}
                  </>
                )}

                {conclusions.verificarResiduosBoca && <li><span className="font-medium">Verificar residuos en boca:</span> {renderBoolean(conclusions.verificarResiduosBoca)}</li>}
                
                {conclusions.modificacionVolumen && (
                  <>
                    <li><span className="font-medium">Modificación de volumen:</span> {renderBoolean(conclusions.modificacionVolumen)}</li>
                    {conclusions.modificacionVolumenCustom.trim() !== '' && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Especificación:</span> {renderString(conclusions.modificacionVolumenCustom)}</li>
                      </ul>
                    )}
                  </>
                )}

                {conclusions.modificacionVelocidad && (
                  <>
                    <li><span className="font-medium">Modificación de velocidad:</span> {renderBoolean(conclusions.modificacionVelocidad)}</li>
                    {conclusions.modificacionVelocidadOpciones && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Opciones:</span> {mapValueToLabel(conclusions.modificacionVelocidadOpciones, modificacionVelocidadRadioOptions)}</li>
                      </ul>
                    )}
                  </>
                )}

                {conclusions.modificacionTemperatura && (
                  <>
                    <li><span className="font-medium">Modificación de temperatura:</span> {renderBoolean(conclusions.modificacionTemperatura)}</li>
                    {conclusions.modificacionTemperaturaCustom.trim() !== '' && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Especificación:</span> {renderString(conclusions.modificacionTemperaturaCustom)}</li>
                      </ul>
                    )}
                  </>
                )}

                {conclusions.modificacionSabor && <li><span className="font-medium">Modificación de sabor:</span> {renderBoolean(conclusions.modificacionSabor)}</li>}
                {conclusions.modificacionTextura && <li><span className="font-medium">Modificación de textura:</span> {renderBoolean(conclusions.modificacionTextura)}</li>}
                
                {conclusions.modificacionConsistencia && (
                  <>
                    <li><span className="font-medium">Modificación de consistencia:</span> {renderBoolean(conclusions.modificacionConsistencia)}</li>
                    {conclusions.modificacionConsistenciaTipos.length > 0 && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Tipos:</span> {mapArrayToLabels(conclusions.modificacionConsistenciaTipos, modificacionConsistenciaTiposOptions)}</li>
                      </ul>
                    )}
                  </>
                )}

                {conclusions.modificacionViscosidad && (
                  <>
                    <li><span className="font-medium">Modificación de viscosidad:</span> {renderBoolean(conclusions.modificacionViscosidad)}</li>
                    {conclusions.modificacionViscosidadTipos.length > 0 && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Tipos:</span> {mapArrayToLabels(conclusions.modificacionViscosidadTipos, modificacionViscosidadTiposOptions)}</li>
                      </ul>
                    )}
                  </>
                )}

                {conclusions.usoEspesante && <li><span className="font-medium">Uso espesante:</span> {renderBoolean(conclusions.usoEspesante)}</li>}
                {conclusions.usoCucharaMedidora && <li><span className="font-medium">Uso cuchara medidora:</span> {renderBoolean(conclusions.usoCucharaMedidora)}</li>}
                {conclusions.usoVasoAdaptado && <li><span className="font-medium">Uso vaso adaptado:</span> {renderBoolean(conclusions.usoVasoAdaptado)}</li>}
                {conclusions.usoJeringa && <li><span className="font-medium">Uso jeringa:</span> {renderBoolean(conclusions.usoJeringa)}</li>}
                {conclusions.usoBombilla && <li><span className="font-medium">Uso bombilla:</span> {renderBoolean(conclusions.usoBombilla)}</li>}
                {conclusions.usoProtesisDental && <li><span className="font-medium">Uso prótesis dental:</span> {renderBoolean(conclusions.usoProtesisDental)}</li>}
                
                {conclusions.modificacionSensorial && (
                  <>
                    <li><span className="font-medium">Modificación sensorial:</span> {renderBoolean(conclusions.modificacionSensorial)}</li>
                    {conclusions.modificacionSensorialTipos.length > 0 && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Tipos:</span> {mapArrayToLabels(conclusions.modificacionSensorialTipos, modificacionSensorialTiposOptions)}</li>
                      </ul>
                    )}
                  </>
                )}

                {(conclusions.usoEstimulacionSensorial ||
                  conclusions.usoEstimulacionTermica ||
                  conclusions.usoEstimulacionMecanica ||
                  conclusions.usoEstimulacionElectrica ||
                  conclusions.usoEstimulacionFarmacologica ||
                  conclusions.usoEstimulacionOtros.trim() !== '') && (
                    <li className="font-bold mt-4">Uso de estimulación:</li>
                  )}
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {conclusions.usoEstimulacionSensorial && <li><span className="font-medium">Sensorial:</span> {renderBoolean(conclusions.usoEstimulacionSensorial)}</li>}
                  {conclusions.usoEstimulacionTermica && <li><span className="font-medium">Térmica:</span> {renderBoolean(conclusions.usoEstimulacionTermica)}</li>}
                  {conclusions.usoEstimulacionMecanica && <li><span className="font-medium">Mecánica:</span> {renderBoolean(conclusions.usoEstimulacionMecanica)}</li>}
                  {conclusions.usoEstimulacionElectrica && <li><span className="font-medium">Eléctrica:</span> {renderBoolean(conclusions.usoEstimulacionElectrica)}</li>}
                  {conclusions.usoEstimulacionFarmacologica && <li><span className="font-medium">Farmacológica:</span> {renderBoolean(conclusions.usoEstimulacionFarmacologica)}</li>}
                  {conclusions.usoEstimulacionOtros.trim() !== '' && <li><span className="font-medium">Otros:</span> {renderString(conclusions.usoEstimulacionOtros)}</li>}
                </ul>

                {conclusions.terapiaFonoaudiologica && (
                  <>
                    <li className="font-bold mt-4">Terapia Fonoaudiológica:</li>
                    <li><span className="font-medium">Requiere terapia:</span> {renderBoolean(conclusions.terapiaFonoaudiologica)}</li>
                    {conclusions.terapiaFonoaudiologicaTipos.length > 0 && (
                      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                        <li><span className="font-medium">Tipos de terapia:</span> {mapArrayToLabels(conclusions.terapiaFonoaudiologicaTipos, terapiaFonoaudiologicaMainOptions)}</li>
                        {conclusions.terapiaFonoaudiologicaTipos.includes('terapia_deglucion') && (
                          <>
                            {conclusions.terapiaDeglucionSubManiobrasRehabilitadoras && (
                              <>
                                <li><span className="font-medium">Maniobras rehabilitadoras:</span> {renderBoolean(conclusions.terapiaDeglucionSubManiobrasRehabilitadoras)}</li>
                                {conclusions.rehabilitacionDeglutoriaTipos.length > 0 && (
                                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                                    <li><span className="font-medium">Tipos:</span> {mapArrayToLabels(conclusions.rehabilitacionDeglutoriaTipos, rehabilitacionDeglutoriaTiposOptions)}</li>
                                  </ul>
                                )}
                                {conclusions.rehabilitacionDeglutoriaTipos.includes('otros') && conclusions.rehabilitacionDeglutoriaOtros.trim() !== '' && (
                                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                                    <li><span className="font-medium">Otros (especificado):</span> {renderString(conclusions.rehabilitacionDeglutoriaOtros)}</li>
                                  </ul>
                                )}
                              </>
                            )}
                            {conclusions.terapiaDeglucionSubManiobrasCompensatorias && <li><span className="font-medium">Maniobras compensatorias:</span> {renderBoolean(conclusions.terapiaDeglucionSubManiobrasCompensatorias)}</li>}
                          </>
                        )}
                      </ul>
                    )}
                  </>
                )}

                {conclusions.optimizarHigieneOral && <li><span className="font-medium">Optimizar higiene oral:</span> {renderBoolean(conclusions.optimizarHigieneOral)}</li>}
                {conclusions.ningunaRecomendacion && <li><span className="font-medium">Ninguna recomendación:</span> {renderBoolean(conclusions.ningunaRecomendacion)}</li>}
                {conclusions.instalacionViaAlternativa && (
                  <>
                    <li><span className="font-medium">Instalación de vía alternativa:</span> {renderBoolean(conclusions.instalacionViaAlternativa)}</li>
                    {conclusions.viaAlternativaTipos.length > 0 && (
                      <li><span className="font-medium">Tipos de vía alternativa:</span> {renderArray(conclusions.viaAlternativaTipos)}</li>
                    )}
                  </>
                )}
                {conclusions.evaluacionComplementaria && <li><span className="font-medium">Evaluación complementaria:</span> {renderBoolean(conclusions.evaluacionComplementaria)}</li>}
                {conclusions.evaluacionComunicativa && <li><span className="font-medium">Evaluación comunicativa:</span> {renderBoolean(conclusions.evaluacionComunicativa)}</li>}

                {(conclusions.derivacionNutricionista ||
                  conclusions.derivacionKinesiologo ||
                  conclusions.derivacionTerapeutaOcupacional ||
                  conclusions.derivacionMedico ||
                  conclusions.derivacionOtros.trim() !== '') && (
                    <li className="font-bold mt-4">Derivación a:</li>
                  )}
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {conclusions.derivacionNutricionista && <li><span className="font-medium">Nutricionista:</span> {renderBoolean(conclusions.derivacionNutricionista)}</li>}
                  {conclusions.derivacionKinesiologo && <li><span className="font-medium">Kinesiólogo:</span> {renderBoolean(conclusions.derivacionKinesiologo)}</li>}
                  {conclusions.derivacionTerapeutaOcupacional && <li><span className="font-medium">Terapeuta Ocupacional:</span> {renderBoolean(conclusions.derivacionTerapeutaOcupacional)}</li>}
                  {conclusions.derivacionMedico && <li><span className="font-medium">Médico:</span> {renderBoolean(conclusions.derivacionMedico)}</li>}
                  {conclusions.derivacionOtros.trim() !== '' && <li><span className="font-medium">Otros:</span> {renderString(conclusions.derivacionOtros)}</li>}
                </ul>

                {conclusions.observaciones.trim() !== '' && (
                  <li className="font-medium mt-4">Observaciones: {renderString(conclusions.observaciones)}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isDownloading ? 'Generando PDF...' : 'Descargar PDF'}
          </Button>
          <Button
            type="button"
            onClick={handleFinishEvaluation}
            className="p-3 bg-efodea-blue text-white font-medium rounded-lg hover:bg-efodea-blue-hover transition-colors"
          >
            Finalizar Evaluación
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;