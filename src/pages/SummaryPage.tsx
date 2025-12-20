"use client";

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { EvaluationData } from '@/types/evaluation'; // Import the main interface

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const evaluationData: EvaluationData | undefined = location.state?.evaluationData;

  if (!evaluationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-700">No hay datos de evaluación para mostrar.</p>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    // Placeholder for PDF generation logic
    alert('Funcionalidad de descarga de PDF no implementada.');
  };

  const handleFinishEvaluation = () => {
    // Navigate to the final message page
    navigate('/final-message');
  };

  const renderBoolean = (value: boolean | undefined) => (value ? 'Sí' : 'No');
  const renderString = (value: string | undefined) => value || 'No especificado';
  const renderArray = (arr: string[] | undefined) => arr && arr.length > 0 ? arr.join(', ') : 'Ninguno';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-[#e99e7c] mb-6 text-center">Resumen de la Evaluación</h1>

        {/* Etapa 1 - Identificación */}
        {evaluationData.identification && (
          <div className="mb-8 p-4 border rounded-lg bg-blue-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 1 - Identificación</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Nombre Paciente:</span> {renderString(evaluationData.identification.patientName)}</li>
              <li><span className="font-medium">Edad Paciente:</span> {renderString(evaluationData.identification.age)}</li>
              <li><span className="font-medium">Antecedentes médicos:</span> {renderBoolean(evaluationData.identification.medicalHistoryToggle)}</li>
              {evaluationData.identification.medicalHistoryToggle && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {evaluationData.identification.selectedMedicalHistory.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                  {evaluationData.identification.selectedMedicalHistory.includes("OTRO") && evaluationData.identification.otherMedicalHistory && (
                    <li>OTRO: {renderString(evaluationData.identification.otherMedicalHistory)}</li>
                  )}
                </ul>
              )}
              <li><span className="font-medium">Antecedentes de deglución previo:</span> {renderString(evaluationData.identification.swallowingHistory)}</li>
            </ul>
          </div>
        )}

        {/* Etapa 2 - Respiración */}
        {evaluationData.respiration && (
          <div className="mb-8 p-4 border rounded-lg bg-green-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 2 - Respiración</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Sin uso de vía aérea artificial:</span> {renderBoolean(evaluationData.respiration.noArtificialAirway)}</li>
              {evaluationData.respiration.noArtificialAirway && (
                <li><span className="font-medium">Opciones de respiración:</span> {renderArray(evaluationData.respiration.selectedRespirationOptions)}</li>
              )}
              <li><span className="font-medium">Presentó intubación orotraqueal:</span> {renderBoolean(evaluationData.respiration.orotrachealIntubation)}</li>
              <li><span className="font-medium">Presenta uso de traqueostomía:</span> {renderBoolean(evaluationData.respiration.tracheostomy)}</li>
            </ul>
          </div>
        )}

        {/* Etapa 3 - Nutrición */}
        {evaluationData.nutrition && (
          <div className="mb-8 p-4 border rounded-lg bg-yellow-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 3 - Nutrición</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Presenta alimentación oral:</span> {renderBoolean(evaluationData.nutrition.hasOralFeeding)}</li>
              {evaluationData.nutrition.hasOralFeeding && (
                <li><span className="font-medium">Consistencia oral seleccionada:</span> {renderString(evaluationData.nutrition.selectedOralConsistency)}</li>
              )}
              <li><span className="font-medium">Presenta alimentación no oral:</span> {renderBoolean(evaluationData.nutrition.hasNonOralFeeding)}</li>
              <li><span className="font-medium">Presenta alimentación mixta:</span> {renderBoolean(evaluationData.nutrition.hasMixedFeeding)}</li>
            </ul>
          </div>
        )}

        {/* Etapa 4 - Estado de conciencia */}
        {evaluationData.consciousness && (
          <div className="mb-8 p-4 border rounded-lg bg-purple-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 4 - Estado de conciencia</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Vigil:</span> {renderBoolean(evaluationData.consciousness.isVigil)}</li>
              <li><span className="font-medium">Alteración de conciencia:</span> {renderBoolean(evaluationData.consciousness.hasAlteredConsciousness)}</li>
              {evaluationData.consciousness.hasAlteredConsciousness && (
                <li><span className="font-medium">Tipos de alteración:</span> {renderArray(evaluationData.consciousness.selectedAlteredConsciousness)}</li>
              )}
            </ul>
          </div>
        )}

        {/* Etapa 5 - Comunicación */}
        {evaluationData.communication && (
          <div className="mb-8 p-4 border rounded-lg bg-red-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 5 - Comunicación</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Opción principal de comunicación:</span> {renderString(evaluationData.communication.mainCommunicationOption)}</li>
              {evaluationData.communication.mainCommunicationOption === "alteracion_cognitiva_conductual" && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li><span className="font-medium">Cooperación:</span> {renderString(evaluationData.communication.selectedCooperation)}</li>
                  <li><span className="font-medium">Atención:</span> {renderString(evaluationData.communication.selectedAttention)}</li>
                  <li><span className="font-medium">Tranquilidad:</span> {renderString(evaluationData.communication.selectedCalmness)}</li>
                  <li><span className="font-medium">Orientación:</span> {renderString(evaluationData.communication.selectedOrientation)}</li>
                  <li><span className="font-medium">Seguimiento de Instrucciones:</span> {renderString(evaluationData.communication.selectedInstructionFollowing)}</li>
                </ul>
              )}
              {evaluationData.communication.mainCommunicationOption === "si_alteracion_voz" && (
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
              <li><span className="font-medium">No presenta alteración:</span> {renderBoolean(evaluationData.orofacialEvaluation.noPresentaAlteracion)}</li>
              <li><span className="font-medium">Alteración de estructuras orofaciales:</span> {renderBoolean(evaluationData.orofacialEvaluation.alteracionEstructuras)}</li>
              <li><span className="font-medium">Alteración motora:</span> {renderBoolean(evaluationData.orofacialEvaluation.alteracionMotora)}</li>
              {evaluationData.orofacialEvaluation.alteracionMotora && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {evaluationData.orofacialEvaluation.rangoFuerzaRostroMandibula && <li>Rango, fuerza y coordinación rostro y mandíbula</li>}
                  {evaluationData.orofacialEvaluation.rangoFuerzaLabios && <li>Rango, fuerza y coordinación labios</li>}
                  {evaluationData.orofacialEvaluation.rangoFuerzaLengua && <li>Rango, fuerza y coordinación lengua</li>}
                </ul>
              )}
              <li><span className="font-medium">Alteración de sensibilidad oral:</span> {renderBoolean(evaluationData.orofacialEvaluation.alteracionSensibilidad)}</li>
              {evaluationData.orofacialEvaluation.alteracionSensibilidad && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {evaluationData.orofacialEvaluation.sensibilidadExtraoralDerecha && <li>Sensibilidad extraoral derecha</li>}
                  {evaluationData.orofacialEvaluation.sensibilidadExtraoralIzquierda && <li>Sensibilidad extraoral izquierda</li>}
                  {evaluationData.orofacialEvaluation.sensibilidadIntraoralDerecha && <li>Sensibilidad intraoral derecha</li>}
                  {evaluationData.orofacialEvaluation.sensibilidadIntraoralIzquierda && <li>Sensibilidad intraoral izquierda</li>}
                </ul>
              )}
              <li><span className="font-medium">Asimetría facial:</span> {renderBoolean(evaluationData.orofacialEvaluation.asimetriaFacial)}</li>
              <li><span className="font-medium">Higiene oral:</span> {renderBoolean(evaluationData.orofacialEvaluation.higieneOral)}</li>
              {evaluationData.orofacialEvaluation.higieneOral && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  {evaluationData.orofacialEvaluation.higieneBuena && <li>Buena</li>}
                  {evaluationData.orofacialEvaluation.higieneMala && <li>Mala</li>}
                  {evaluationData.orofacialEvaluation.higieneRegular && <li>Regular</li>}
                </ul>
              )}
            </ul>
          </div>
        )}

        {/* Etapa 7 - Dentición */}
        {evaluationData.dentition && (
          <div className="mb-8 p-4 border rounded-lg bg-pink-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 7 - Dentición</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">No presenta alteración de la dentición:</span> {renderBoolean(evaluationData.dentition.noPresentaAlteracion)}</li>
              <li><span className="font-medium">Pérdida de piezas dentales con o sin uso de prótesis dental:</span> {renderBoolean(evaluationData.dentition.perdidaPiezas)}</li>
              {evaluationData.dentition.perdidaPiezas && (
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
              )}
            </ul>
          </div>
        )}

        {/* Etapa 8 - Reflejos */}
        {evaluationData.reflexes && (
          <div className="mb-8 p-4 border rounded-lg bg-teal-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 8 - Reflejos</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">No presenta alteración de los reflejos:</span> {renderBoolean(evaluationData.reflexes.noPresentaAlteracion)}</li>
              <li><span className="font-medium">Presenta alteración de los reflejos:</span> {renderBoolean(evaluationData.reflexes.presentaAlteracion)}</li>
              {evaluationData.reflexes.presentaAlteracion && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li><span className="font-medium">Tos voluntaria:</span>
                    {evaluationData.reflexes.tosVoluntariaProductiva && ' Presente productiva'}
                    {evaluationData.reflexes.tosVoluntariaNoProductiva && ' Presente no productiva'}
                    {evaluationData.reflexes.tosVoluntariaAusente && ' Ausente'}
                  </li>
                  <li><span className="font-medium">Tos refleja:</span>
                    {evaluationData.reflexes.tosReflejaProductiva && ' Presente productiva'}
                    {evaluationData.reflexes.tosReflejaNoProductiva && ' Presente no productiva'}
                    {evaluationData.reflexes.tosReflejaAusente && ' Ausente'}
                  </li>
                </ul>
              )}
            </ul>
          </div>
        )}

        {/* Etapa 9 - Deglución no nutritiva */}
        {evaluationData.deglutionNoNutritiva && (
          <div className="mb-8 p-4 border rounded-lg bg-cyan-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 9 - Deglución no nutritiva</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Sin alteración en deglución no nutritiva:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.sinAlteracion)}</li>
              {!evaluationData.deglutionNoNutritiva.sinAlteracion && (
                <>
                  <li><span className="font-medium">Acumulación de saliva:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.acumulacionSaliva)}</li>
                  {evaluationData.deglutionNoNutritiva.acumulacionSaliva && <li><span className="font-medium">Escape anterior:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.escapeAnterior)}</li>}
                  <li><span className="font-medium">Xerostomía:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.xerostomia)}</li>
                  <li><span className="font-medium">No deglute saliva espontáneamente:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.noDegluteEspontaneamente)}</li>
                  <li><span className="font-medium">RMO (más de 1 segundo):</span> {renderBoolean(evaluationData.deglutionNoNutritiva.rmoMasDeUnSegundo)}</li>
                  <li><span className="font-medium">Excursión laríngea ausente:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.excursionLaringeaAusente)}</li>
                  <li><span className="font-medium">Odinofagia:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.odinofagia)}</li>
                  <li><span className="font-medium">Voz húmeda sin aclaramiento:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.vozHumedaSinAclaramiento)}</li>
                  {evaluationData.deglutionNoNutritiva.vozHumedaSinAclaramiento && (
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      <li><span className="font-medium">Aclara la voz de forma espontánea:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozEspontanea)}</li>
                      <li><span className="font-medium">Aclara la voz a solicitud:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozSolicitud)}</li>
                      <li><span className="font-medium">Aclara la voz con degluciones consecutivas:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozDegluciones)}</li>
                      <li><span className="font-medium">Aclara la voz con carraspeo:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozCarraspeo)}</li>
                      <li><span className="font-medium">Aclara la voz con tos:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.aclaraVozTos)}</li>
                    </ul>
                  )}
                  <li><span className="font-medium">Ascultación cervical húmeda:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.ascultacionCervicalHumeda)}</li>
                  <li><span className="font-medium">BDT (+) inmediato:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.bdtInmediato)}</li>
                  <li><span className="font-medium">Evaluación instrumental presenta penetración:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.evaluacionPenetracion)}</li>
                  <li><span className="font-medium">Evaluación instrumental presenta aspiración:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.evaluacionAspiracion)}</li>
                  <li><span className="font-medium">Evaluación instrumental presenta aspiración silente:</span> {renderBoolean(evaluationData.deglutionNoNutritiva.evaluacionAspiracionSilente)}</li>
                </>
              )}
            </ul>
            {evaluationData.deglutionNoNutritivaScore !== undefined && (
              <p className="mt-4 text-lg font-bold text-gray-800">Puntaje de Deglución No Nutritiva: {evaluationData.deglutionNoNutritivaScore}%</p>
            )}
          </div>
        )}

        {/* Etapa 10 - Deglución Nutritiva */}
        {evaluationData.deglutionNutritiva && (
          <div className="mb-8 p-4 border rounded-lg bg-orange-50">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 10 - Deglución Nutritiva</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Evaluación de deglución nutritiva realizada:</span> {renderBoolean(evaluationData.deglutionNutritiva.evaluatedNutritiveDeglution)}</li>
              {/* Add more details for nutritive deglution here if available */}
            </ul>
          </div>
        )}

        {/* Etapa 10.4 - Conclusiones */}
        {evaluationData.conclusions && (
          <div className="mb-8 p-4 border rounded-lg bg-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Etapa 10.4 - Conclusiones</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><span className="font-medium">Sin trastorno de la deglución:</span> {renderBoolean(evaluationData.conclusions.sinTrastornoDeglucion)}</li>
              <li><span className="font-medium">Trastorno de la deglución:</span> {renderBoolean(evaluationData.conclusions.trastornoDeglucion)}</li>
              {evaluationData.conclusions.trastornoDeglucion && (
                <li><span className="font-medium">Origen del trastorno:</span> {renderString(evaluationData.conclusions.trastornoOrigen)}</li>
              )}
              <li><span className="font-medium">No es posible determinar (general):</span> {renderBoolean(evaluationData.conclusions.noEsPosibleDeterminarGeneral)}</li>
              <li><span className="font-medium">Escala de severidad:</span> {renderBoolean(evaluationData.conclusions.escalaSeveridad)}</li>
              {evaluationData.conclusions.escalaSeveridad && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li><span className="font-medium">DOSS:</span> {renderString(evaluationData.conclusions.doss)}</li>
                  <li><span className="font-medium">FILS:</span> {renderString(evaluationData.conclusions.fils)}</li>
                  <li><span className="font-medium">FOIS:</span> {renderString(evaluationData.conclusions.fois)}</li>
                </ul>
              )}
              <li><span className="font-medium">Alimentación total por boca:</span> {renderBoolean(evaluationData.conclusions.alimentacionTotalBoca)}</li>
              <li><span className="font-medium">Alimentación enteral:</span> {renderBoolean(evaluationData.conclusions.alimentacionEnteral)}</li>
              <li><span className="font-medium">Alimentación mixta:</span> {renderBoolean(evaluationData.conclusions.alimentacionMixta)}</li>
              <li><span className="font-medium">Sólo con especialista:</span> {renderBoolean(evaluationData.conclusions.soloConEspecialista)}</li>
              <li><span className="font-medium">Alimentos permitidos:</span> {renderBoolean(evaluationData.conclusions.alimentosPermitidos)}</li>
              {evaluationData.conclusions.alimentosPermitidos && (
                <li><span className="font-medium">Consistencias de alimentos permitidos:</span> {renderArray(evaluationData.conclusions.alimentosPermitidosConsistencias)}</li>
              )}
              <li><span className="font-medium">Bebidas permitidas:</span> {renderBoolean(evaluationData.conclusions.bebidasPermitidas)}</li>
              {evaluationData.conclusions.bebidasPermitidas && (
                <li><span className="font-medium">Consistencias de bebidas permitidas:</span> {renderArray(evaluationData.conclusions.bebidasPermitidasConsistencias)}</li>
              )}
              <li><span className="font-medium">Ninguna viscosidad permitida:</span> {renderBoolean(evaluationData.conclusions.ningunaViscosidadPermitida)}</li>

              <li className="font-bold mt-4">Otras Recomendaciones:</li>
              <li><span className="font-medium">Asistencia/Vigilancia:</span> {renderBoolean(evaluationData.conclusions.asistenciaVigilancia)}</li>
              <li><span className="font-medium">Posición de 45° a 90°:</span> {renderBoolean(evaluationData.conclusions.posicion45a90)}</li>
              <li><span className="font-medium">Maniobra deglutoria:</span> {renderBoolean(evaluationData.conclusions.maniobraDeglutoria)}</li>
              <li><span className="font-medium">Verificar residuos en boca:</span> {renderBoolean(evaluationData.conclusions.verificarResiduosBoca)}</li>
              <li><span className="font-medium">Modificación de volumen:</span> {renderBoolean(evaluationData.conclusions.modificacionVolumen)}</li>
              <li><span className="font-medium">Modificación de velocidad:</span> {renderBoolean(evaluationData.conclusions.modificacionVelocidad)}</li>
              <li><span className="font-medium">Modificación de temperatura:</span> {renderBoolean(evaluationData.conclusions.modificacionTemperatura)}</li>
              <li><span className="font-medium">Modificación de sabor:</span> {renderBoolean(evaluationData.conclusions.modificacionSabor)}</li>
              <li><span className="font-medium">Modificación de textura:</span> {renderBoolean(evaluationData.conclusions.modificacionTextura)}</li>
              <li><span className="font-medium">Modificación de consistencia:</span> {renderBoolean(evaluationData.conclusions.modificacionConsistencia)}</li>
              <li><span className="font-medium">Uso espesante:</span> {renderBoolean(evaluationData.conclusions.usoEspesante)}</li>
              <li><span className="font-medium">Uso cuchara medidora:</span> {renderBoolean(evaluationData.conclusions.usoCucharaMedidora)}</li>
              <li><span className="font-medium">Uso vaso adaptado:</span> {renderBoolean(evaluationData.conclusions.usoVasoAdaptado)}</li>
              <li><span className="font-medium">Uso jeringa:</span> {renderBoolean(evaluationData.conclusions.usoJeringa)}</li>
              <li><span className="font-medium">Uso bombilla:</span> {renderBoolean(evaluationData.conclusions.usoBombilla)}</li>
              <li><span className="font-medium">Uso prótesis dental:</span> {renderBoolean(evaluationData.conclusions.usoProtesisDental)}</li>
              <li><span className="font-medium">Optimizar higiene oral:</span> {renderBoolean(evaluationData.conclusions.optimizarHigieneOral)}</li>
              <li><span className="font-medium">Ninguna recomendación:</span> {renderBoolean(evaluationData.conclusions.ningunaRecomendacion)}</li>
              <li><span className="font-medium">Instalación de vía alternativa:</span> {renderBoolean(evaluationData.conclusions.instalacionViaAlternativa)}</li>
              {evaluationData.conclusions.instalacionViaAlternativa && (
                <li><span className="font-medium">Tipos de vía alternativa:</span> {renderArray(evaluationData.conclusions.viaAlternativaTipos)}</li>
              )}
              <li><span className="font-medium">Evaluación complementaria:</span> {renderBoolean(evaluationData.conclusions.evaluacionComplementaria)}</li>
              <li><span className="font-medium">Terapia de deglución:</span> {renderBoolean(evaluationData.conclusions.terapiaDeglucion)}</li>
              <li><span className="font-medium">Evaluación comunicativa:</span> {renderBoolean(evaluationData.conclusions.evaluacionComunicativa)}</li>

              <li className="font-bold mt-4">Uso de estimulación:</li>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                <li><span className="font-medium">Sensorial:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionSensorial)}</li>
                <li><span className="font-medium">Térmica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionTermica)}</li>
                <li><span className="font-medium">Mecánica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionMecanica)}</li>
                <li><span className="font-medium">Eléctrica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionElectrica)}</li>
                <li><span className="font-medium">Farmacológica:</span> {renderBoolean(evaluationData.conclusions.usoEstimulacionFarmacologica)}</li>
                <li><span className="font-medium">Otros:</span> {renderString(evaluationData.conclusions.usoEstimulacionOtros)}</li>
              </ul>

              <li className="font-bold mt-4">Rehabilitación deglutoria:</li>
              <li><span className="font-medium">Requiere rehabilitación:</span> {renderBoolean(evaluationData.conclusions.rehabilitacionDeglutoria)}</li>
              {evaluationData.conclusions.rehabilitacionDeglutoria && (
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li><span className="font-medium">Tipos:</span> {renderArray(evaluationData.conclusions.rehabilitacionDeglutoriaTipos)}</li>
                  {evaluationData.conclusions.rehabilitacionDeglutoriaTipos.includes('otros') && (
                    <li><span className="font-medium">Otros (especificado):</span> {renderString(evaluationData.conclusions.rehabilitacionDeglutoriaOtros)}</li>
                  )}
                </ul>
              )}

              <li className="font-bold mt-4">Derivación a:</li>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                <li><span className="font-medium">Nutricionista:</span> {renderBoolean(evaluationData.conclusions.derivacionNutricionista)}</li>
                <li><span className="font-medium">Kinesiólogo:</span> {renderBoolean(evaluationData.conclusions.derivacionKinesiologo)}</li>
                <li><span className="font-medium">Terapeuta Ocupacional:</span> {renderBoolean(evaluationData.conclusions.derivacionTerapeutaOcupacional)}</li>
                <li><span className="font-medium">Médico:</span> {renderBoolean(evaluationData.conclusions.derivacionMedico)}</li>
                <li><span className="font-medium">Otros:</span> {renderString(evaluationData.conclusions.derivacionOtros)}</li>
              </ul>

              <li className="font-medium mt-4">Observaciones: {renderString(evaluationData.conclusions.observaciones)}</li>
            </ul>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPdf}
            className="p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Descargar PDF
          </Button>
          <Button
            type="button"
            onClick={handleFinishEvaluation}
            className="p-3 bg-[#e99e7c] text-white font-medium rounded-lg hover:bg-[#ea8a66] transition-colors"
          >
            Finalizar Evaluación
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;