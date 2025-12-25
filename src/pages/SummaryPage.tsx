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
          {evaluationData.conclusions && (
            <div className="mb-8 p-4 border rounded-lg bg-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 10.4 - Conclusiones</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {evaluationData.conclusions.sinTrastornoDeglucion && <li><span className="font-medium">Sin trastorno de la deglución:</span> {renderBoolean(evaluationData.conclusions.sinTrastornoDeglucion)}</li>}
                {evaluationData.conclusions.trastornoDeglucion && (
                  <>
                    <li><span className="font-medium">Trastorno de la deglución:</span> {renderBoolean(evaluationData.conclusions.trastornoDeglucion)}</li>
                    {evaluationData.conclusions.trastornoOrigen && (
                      <li><span className="font-medium">Origen del trastorno:</span> {renderString(evaluationData.conclusions.trastornoOrigen)}</li>
                    )}
                  </>
                )}
                {evaluationData.conclusions.noEsPosibleDeterminarGeneral && <li><span className="font-medium">No es posible determinar (general):</span> {renderBoolean(evaluationData.conclusions.noEsPosibleDeterminarGeneral)}</li>}
                {evaluationData.conclusions.escalaSeveridad && (
                  <>
                    <li><span className="font-medium">Escala de severidad:</span> {renderBoolean(evaluationData.conclusions.escalaSeveridad)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {evaluationData.conclusions.doss && <li><span className="font-medium">DOSS:</span> {renderString(evaluationData.conclusions.doss)}</li>}
                      {evaluationData.conclusions.fils && <li><span className="font-medium">FILS:</span> {renderString(evaluationData.conclusions.fils)}</li>}
                      {evaluationData.conclusions.fois && <li><span className="font-medium">FOIS:</span> {renderString(evaluationData.conclusions.fois)}</li>}
                    </ul>
                  </>
                )}
                {evaluationData.conclusions.alimentacionTotalBoca && <li><span className="font-medium">Alimentación total por boca:</span> {renderBoolean(evaluationData.conclusions.alimentacionTotalBoca)}</li>}
                {evaluationData.conclusions.alimentacionEnteral && <li><span className="font-medium">Alimentación enteral:</span> {renderBoolean(evaluationData.conclusions.alimentacionEnteral)}</li>}
                {evaluationData.conclusions.alimentacionMixta && <li><span className="font-medium">Alimentación mixta:</span> {renderBoolean(evaluationData.conclusions.alimentacionMixta)}</li>}
                {evaluationData.conclusions.soloConEspecialista && <li><span className="font-medium">Sólo con especialista:</span> {renderBoolean(evaluationData.conclusions.soloConEspecialista)}</li>}
                {evaluationData.conclusions.alimentosPermitidos && (
                  <>
                    <li><span className="font-medium">Alimentos permitidos:</span> {renderBoolean(evaluationData.conclusions.alimentosPermitidos)}</li>
                    {evaluationData.conclusions.alimentosPermitidosConsistencias.length > 0 && (
                      <li><span className="font-medium">Consistencias de alimentos permitidos:</span> {renderArray(evaluationData.conclusions.alimentosPermitidosConsistencias)}</li>
                    )}
                  </>
                )}
                {evaluationData.conclusions.bebidasPermitidas && (
                  <>
                    <li><span className="font-medium">Bebidas permitidas:</span> {renderBoolean(evaluationData.conclusions.bebidasPermitidas)}</li>
                    {evaluationData.conclusions.bebidasPermitidasConsistencias.length > 0 && (
                      <li><span className="font-medium">Consistencias de bebidas permitidas:</span> {renderArray(evaluationData.conclusions.bebidasPermitidasConsistencias)}</li>
                    )}
                  </>
                )}
                {evaluationData.conclusions.ningunaViscosidadPermitida && <li><span className="font-medium">Ninguna viscosidad permitida:</span> {renderBoolean(evaluationData.conclusions.ningunaViscosidadPermitida)}</li>}

                {/* Otras Recomendaciones */}
                {(evaluationData.conclusions.asistenciaVigilancia ||
                  evaluationData.conclusions.posicion45a90 ||
                  evaluationData.conclusions.maniobraDeglutoria ||
                  evaluationData.conclusions.verificarResiduosBoca ||
                  evaluationData.conclusions.modificacionVolumen ||
                  evaluationData.conclusions.modificacionVelocidad ||
                  evaluationData.conclusions.modificacionTemperatura ||
                  evaluationData.conclusions.modificacionSabor ||
                  evaluationData.conclusions.modificacionTextura ||
                  evaluationData.conclusions.modificacionConsistencia ||
                  evaluationData.conclusions.usoEspesante ||
                  evaluationData.conclusions.usoCucharaMedidora ||
                  evaluationData.conclusions.usoVasoAdaptado ||
                  evaluationData.conclusions.usoJeringa ||
                  evaluationData.conclusions.usoBombilla ||
                  evaluationData.conclusions.usoProtesisDental ||
                  evaluationData.conclusions.optimizarHigieneOral ||
                  evaluationData.conclusions.ningunaRecomendacion ||
                  evaluationData.conclusions.instalacionViaAlternativa ||
                  evaluationData.conclusions.evaluacionComplementaria ||
                  evaluationData.conclusions.terapiaDeglucion ||
                  evaluationData.conclusions.evaluacionComunicativa ||
                  evaluationData.conclusions.usoEstimulacionSensorial ||
                  evaluationData.conclusions.usoEstimulacionTermica ||
                  evaluationData.conclusions.usoEstimulacionMecanica ||
                  evaluationData.conclusions.usoEstimulacionElectrica ||
                  evaluationData.conclusions.usoEstimulacionFarmacologica ||
                  evaluationData.conclusions.usoEstimulacionOtros.trim() !== '' ||
                  evaluationData.conclusions.rehabilitacionDeglutoria ||
                  evaluationData.conclusions.derivacionNutricionista ||
                  evaluationData.conclusions.derivacionKinesiologo ||
                  evaluationData.conclusions.derivacionTerapeutaOcupacional ||
                  evaluationData.conclusions.derivacionMedico ||
                  evaluationData.conclusions.derivacionOtros.trim() !== '') && (
                    <li className="font-bold mt-4">Otras Recomendaciones:</li>
                  )}
                {evaluationData.conclusions.asistenciaVigilancia && <li><span className="font-medium">Asistencia/Vigilancia:</span> {renderBoolean(evaluationData.conclusions.asistenciaVigilancia)}</li>}
                {evaluationData.conclusions.posicion45a90 && <li><span className="font-medium">Posición de 45° a 90°:</span> {renderBoolean(evaluationData.conclusions.posicion45a90)}</li>}
                {evaluationData.conclusions.maniobraDeglutoria && <li><span className="font-medium">Maniobra deglutoria:</span> {renderBoolean(evaluationData.conclusions.maniobraDeglutoria)}</li>}
                {evaluationData.conclusions.verificarResiduosBoca && <li><span className="font-medium">Verificar residuos en boca:</span> {renderBoolean(evaluationData.conclusions.verificarResiduosBoca)}</li>}
                {evaluationData.conclusions.modificacionVolumen && <li><span className="font-medium">Modificación de volumen:</span> {renderBoolean(evaluationData.conclusions.modificacionVolumen)}</li>}
                {evaluationData.conclusions.modificacionVelocidad && <li><span className="font-medium">Modificación de velocidad:</span> {renderBoolean(evaluationData.conclusions.modificacionVelocidad)}</li>}
                {evaluationData.conclusions.modificacionTemperatura && <li><span className="font-medium">Modificación de temperatura:</span> {renderBoolean(evaluationData.conclusions.modificacionTemperatura)}</li>}
                {evaluationData.conclusions.modificacionSabor && <li><span className="font-medium">Modificación de sabor:</span> {renderBoolean(evaluationData.conclusions.modificacionSabor)}</li>}
                {evaluationData.conclusions.modificacionTextura && <li><span className="font-medium">Modificación de textura:</span> {renderBoolean(evaluationData.conclusions.modificacionTextura)}</li>}
                {evaluationData.conclusions.modificacionConsistencia && <li><span className="font-medium">Modificación de consistencia:</span> {renderBoolean(evaluationData.conclusions.modificacionConsistencia)}</li>}
                {evaluationData.conclusions.usoEspesante && <li><span className="font-medium">Uso espesante:</span> {renderBoolean(evaluationData.conclusions.usoEspesante)}</li>}
                {evaluationData.conclusions.usoCucharaMedidora && <li><span className="font-medium">Uso cuchara medidora:</span> {renderBoolean(evaluationData.conclusions.usoCucharaMedidora)}</li>}
                {evaluationData.conclusions.usoVasoAdaptado && <li><span className="font-medium">Uso vaso adaptado:</span> {renderBoolean(evaluationData.conclusions.usoVasoAdaptado)}</li>}
                {evaluationData.conclusions.usoJeringa && <li><span className="font-medium">Uso jeringa:</span> {renderBoolean(evaluationData.conclusions.usoJeringa)}</li>}
                {evaluationData.conclusions.usoBombilla && <li><span className="font-medium">Uso bombilla:</span> {renderBoolean(evaluationData.conclusions.usoBombilla)}</li>}
                {evaluationData.conclusions.usoProtesisDental && <li><span className="font-medium">Uso prótesis dental:</span> {renderBoolean(evaluationData.conclusions.usoProtesisDental)}</li>}
                {evaluationData.conclusions.optimizarHigieneOral && <li><span className="font-medium">Optimizar higiene oral:</span> {renderBoolean(evaluationData.conclusions.optimizarHigieneOral)}</li>}
                {evaluationData.conclusions.ningunaRecomendacion && <li><span className="font-medium">Ninguna recomendación:</span> {renderBoolean(evaluationData.conclusions.ningunaRecomendacion)}</li>}
                {evaluationData.conclusions.instalacionViaAlternativa && (
                  <>
                    <li><span className="font-medium">Instalación de vía alternativa:</span> {renderBoolean(evaluationData.conclusions.instalacionViaAlternativa)}</li>
                    {evaluationData.conclusions.viaAlternativaTipos.length > 0 && (
                      <li><span className="font-medium">Tipos de vía alternativa:</span> {renderArray(evaluationData.conclusions.viaAlternativaTipos)}</li>
                    )}
                  </>
                )}
                {evaluationData.conclusions.evaluacionComplementaria && <li><span className="font-medium">Evaluación complementaria:</span> {renderBoolean(evaluationData.conclusions.evaluacionComplementaria)}</li>}
                {evaluationData.conclusions.terapiaDeglucion && <li><span className="font-medium">Terapia de deglución:</span> {renderBoolean(evaluationData.conclusions.terapiaDeglucion)}</li>}
                {evaluationData.conclusions.evaluacionComunicativa && <li><span className="font-medium">Evaluación comunicativa:</span> {renderBoolean(evaluationData.conclusions.evaluacionComunicativa)}</li>}

                {(evaluationData.conclusions.usoEstimulacionSensorial ||
                  evaluationData.conclusions.usoEstimulacionTermica ||
                  evaluationData.conclusions.usoEstimulacionMecanica ||
                  evaluationData.conclusions.usoEstimulacionElectrica ||
                  evaluationData.conclusions.usoEstimulacionFarmacologica ||
                  evaluationData.conclusions.usoEstimulacionOtros.trim() !== '') && (
                    <li className="font-bold mt-4">Uso de estimulación:</li>
                  )}
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {evaluationData.conclusions.usoEstimulacionSensorial && <li><span className="font-medium">Sensorial:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionSensorial)}</li>}
                  {evaluationData.conclusions.usoEstimulacionTermica && <li><span className="font-medium">Térmica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionTermica)}</li>}
                  {evaluationData.conclusions.usoEstimulacionMecanica && <li><span className="font-medium">Mecánica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionMecanica)}</li>}
                  {evaluationData.conclusions.usoEstimulacionElectrica && <li><span className="font-medium">Eléctrica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionElectrica)}</li>}
                  {evaluationData.conclusions.usoEstimulacionFarmacologica && <li><span className="font-medium">Farmacológica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionFarmacologica)}</li>}
                  {evaluationData.conclusions.usoEstimulacionOtros.trim() !== '' && <li><span className="font-medium">Otros:</span> {renderString(evaluationData.conclusions.usoEstimulacionOtros)}</li>}
                </ul>

                {evaluationData.conclusions.rehabilitacionDeglutoria && (
                  <>
                    <li className="font-bold mt-4">Rehabilitación deglutoria:</li>
                    <li><span className="font-medium">Requiere rehabilitación:</span> {renderBoolean(evaluationData.conclusions.rehabilitacionDeglutoria)}</li>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      {evaluationData.conclusions.rehabilitacionDeglutoriaTipos.length > 0 && (
                        <li><span className="font-medium">Tipos:</span> {renderArray(evaluationData.conclusions.rehabilitacionDeglutoriaTipos)}</li>
                      )}
                      {evaluationData.conclusions.rehabilitacionDeglutoriaTipos.includes('otros') && evaluationData.conclusions.rehabilitacionDeglutoriaOtros.trim() !== '' && (
                        <li><span className="font-medium">Otros (especificado):</span> {renderString(evaluationData.conclusions.rehabilitacionDeglutoriaOtros)}</li>
                      )}
                    </ul>
                  </>
                )}

                {(evaluationData.conclusions.derivacionNutricionista ||
                  evaluationData.conclusions.derivacionKinesiologo ||
                  evaluationData.conclusions.derivacionTerapeutaOcupacional ||
                  evaluationData.conclusions.derivacionMedico ||
                  evaluationData.conclusions.derivacionOtros.trim() !== '') && (
                    <li className="font-bold mt-4">Derivación a:</li>
                  )}
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {evaluationData.conclusions.derivacionNutricionista && <li><span className="font-medium">Nutricionista:</span> {renderBoolean(evaluationData.conclusions.derivacionNutricionista)}</li>}
                  {evaluationData.conclusions.derivacionKinesiologo && <li><span className="font-medium">Kinesiólogo:</span> {renderBoolean(evaluationData.conclusions.derivacionKinesiologo)}</li>}
                  {evaluationData.conclusions.derivacionTerapeutaOcupacional && <li><span className="font-medium">Terapeuta Ocupacional:</span> {renderBoolean(evaluationData.conclusions.derivacionTerapeutaOcupacional)}</li>}
                  {evaluationData.conclusions.derivacionMedico && <li><span className="font-medium">Médico:</span> {renderBoolean(evaluationData.conclusions.derivacionMedico)}</li>}
                  {evaluationData.conclusions.derivacionOtros.trim() !== '' && <li><span className="font-medium">Otros:</span> {renderString(evaluationData.conclusions.derivacionOtros)}</li>}
                </ul>

                {evaluationData.conclusions.observaciones.trim() !== '' && (
                  <li className="font-medium mt-4">Observaciones: {renderString(evaluationData.conclusions.observaciones)}</li>
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