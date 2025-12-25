"use client";

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import Header from '@/components/Header';
import { ConclusionsData, EvaluationData } from '@/types/evaluation'; // Import interfaces

const trastornoOrigenOptions = [
  { value: 'neurogenico', label: 'Origen neurogénico' },
  { value: 'mecanico', label: 'Origen mecánico' },
  { value: 'iatrogenico', label: 'Origen iatrogénico' },
  { value: 'mixto', label: 'Origen mixto' },
  { value: 'no_determinar', label: 'No es posible determinar' },
];

const dossOptions = ['1', '2', '3', '4', '5', '6', '7'];
const filsOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const foisOptions = ['1', '2', '3', '4', '5', '6', '7'];

const consistenciaOptions = [
  { value: 'liquido_fino', label: 'Líquido fino' },
  { value: 'liquido_espeso', label: 'Líquido espeso' },
  { value: 'papilla_licuada', label: 'Papilla licuada' }, // Added new option
  { value: 'papilla_espesa', label: 'Papilla espesa' },  // Added new option
  { value: 'papilla', label: 'Papilla' },
  { value: 'solido_blando', label: 'Sólido blando' },
  { value: 'solidos', label: 'Sólidos' },
];

const rehabilitacionTiposOptions = [
  { value: 'ejercicios_fuerza', label: 'Ejercicios de fuerza' },
  { value: 'ejercicios_rango', label: 'Ejercicios de rango' },
  { value: 'maniobras_compensatorias', label: 'Maniobras compensatorias' },
  { value: 'terapia_miofuncional', label: 'Terapia miofuncional' },
  { value: 'otros', label: 'Otros' },
];

const viaAlternativaOptions = [
  { value: 'SNG', label: 'SNG' },
  { value: 'SNY', label: 'SNY' },
  { value: 'SOG', label: 'SOG' },
  { value: 'GTT', label: 'GTT' },
  { value: 'YTT', label: 'YTT' },
  { value: 'NPT', label: 'NPT' },
];

const ConclusionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEvaluationData: EvaluationData | undefined = location.state?.evaluationData; // Get previous data

  const [conclusionsData, setConclusionsData] = useState<ConclusionsData>({
    sinTrastornoDeglucion: false,
    trastornoDeglucion: false,
    trastornoOrigen: undefined,
    noEsPosibleDeterminarGeneral: false,
    escalaSeveridad: false,
    doss: undefined,
    fils: undefined,
    fois: undefined,
    alimentacionTotalBoca: false,
    alimentacionEnteral: false,
    alimentacionMixta: false,
    soloConEspecialista: false,
    alimentosPermitidos: false,
    alimentosPermitidosConsistencias: [],
    bebidasPermitidas: false,
    bebidasPermitidasConsistencias: [],
    ningunaViscosidadPermitida: false,
    asistenciaVigilancia: false,
    posicion45a90: false,
    maniobraDeglutoria: false,
    verificarResiduosBoca: false,
    modificacionVolumen: false,
    modificacionVelocidad: false,
    modificacionTemperatura: false,
    modificacionSabor: false,
    modificacionTextura: false,
    modificacionConsistencia: false,
    usoEspesante: false,
    usoCucharaMedidora: false,
    usoVasoAdaptado: false,
    usoJeringa: false,
    usoBombilla: false,
    usoProtesisDental: false,
    usoEstimulacionSensorial: false,
    usoEstimulacionTermica: false,
    usoEstimulacionMecanica: false,
    usoEstimulacionElectrica: false,
    usoEstimulacionFarmacologica: false,
    usoEstimulacionOtros: '',
    rehabilitacionDeglutoria: false,
    rehabilitacionDeglutoriaTipos: [],
    rehabilitacionDeglutoriaOtros: '',
    derivacionNutricionista: false,
    derivacionKinesiologo: false,
    derivacionTerapeutaOcupacional: false,
    derivacionMedico: false,
    derivacionOtros: '',
    observaciones: '',
    optimizarHigieneOral: false,
    ningunaRecomendacion: false,
    instalacionViaAlternativa: false,
    viaAlternativaTipos: [],
    evaluacionComplementaria: false,
    terapiaDeglucion: false,
    evaluacionComunicativa: false,
  });

  const handleSwitchChange = (field: keyof ConclusionsData, checked: boolean) => {
    setConclusionsData((prev) => {
      const newState = { ...prev, [field]: checked };

      // Mutual exclusivity for main diagnosis
      if (field === 'sinTrastornoDeglucion' && checked) {
        newState.trastornoDeglucion = false;
        newState.noEsPosibleDeterminarGeneral = false;
        newState.trastornoOrigen = undefined;
      } else if (field === 'trastornoDeglucion' && checked) {
        newState.sinTrastornoDeglucion = false;
        newState.noEsPosibleDeterminarGeneral = false;
      } else if (field === 'noEsPosibleDeterminarGeneral' && checked) {
        newState.sinTrastornoDeglucion = false;
        newState.trastornoDeglucion = false;
        newState.trastornoOrigen = undefined;
      }

      // Reset sub-options if main switch is turned off
      if (field === 'trastornoDeglucion' && !checked) {
        newState.trastornoOrigen = undefined;
      }
      if (field === 'escalaSeveridad' && !checked) {
        newState.doss = undefined;
        newState.fils = undefined;
        newState.fois = undefined;
      }
      if (field === 'alimentosPermitidos' && !checked) {
        newState.alimentosPermitidosConsistencias = [];
      }
      if (field === 'bebidasPermitidas' && !checked) {
        newState.bebidasPermitidasConsistencias = [];
      }
      if (field === 'ningunaViscosidadPermitida' && checked) {
        newState.alimentosPermitidos = false;
        newState.alimentosPermitidosConsistencias = [];
        newState.bebidasPermitidas = false;
        newState.bebidasPermitidasConsistencias = [];
      } else if ((field === 'alimentosPermitidos' || field === 'bebidasPermitidas') && checked) {
        newState.ningunaViscosidadPermitida = false;
      }
      if (field === 'rehabilitacionDeglutoria' && !checked) {
        newState.rehabilitacionDeglutoriaTipos = [];
        newState.rehabilitacionDeglutoriaOtros = '';
      }
      if (field === 'usoEstimulacionOtros' && !checked) {
        newState.usoEstimulacionOtros = '';
      }
      if (field === 'derivacionOtros' && !checked) {
        newState.derivacionOtros = '';
      }

      // New logic for "Ninguna recomendación"
      if (field === 'ningunaRecomendacion' && checked) {
        // If "Ninguna recomendación" is checked, clear all other recommendations
        return {
          ...prev,
          ningunaRecomendacion: true,
          asistenciaVigilancia: false,
          posicion45a90: false,
          maniobraDeglutoria: false,
          verificarResiduosBoca: false,
          modificacionVolumen: false,
          modificacionVelocidad: false,
          modificacionTemperatura: false,
          modificacionSabor: false,
          modificacionTextura: false,
          modificacionConsistencia: false,
          usoEspesante: false,
          usoCucharaMedidora: false,
          usoVasoAdaptado: false,
          usoJeringa: false,
          usoBombilla: false,
          usoProtesisDental: false,
          usoEstimulacionSensorial: false,
          usoEstimulacionTermica: false,
          usoEstimulacionMecanica: false,
          usoEstimulacionElectrica: false,
          usoEstimulacionFarmacologica: false,
          usoEstimulacionOtros: '',
          rehabilitacionDeglutoria: false,
          rehabilitacionDeglutoriaTipos: [],
          rehabilitacionDeglutoriaOtros: '',
          derivacionNutricionista: false,
          derivacionKinesiologo: false,
          derivacionTerapeutaOcupacional: false,
          derivacionMedico: false,
          derivacionOtros: '',
          optimizarHigieneOral: false,
          instalacionViaAlternativa: false,
          viaAlternativaTipos: [],
          evaluacionComplementaria: false,
          terapiaDeglucion: false,
          evaluacionComunicativa: false,
        };
      } else if (field !== 'ningunaRecomendacion' && checked) {
        // If any other recommendation is checked, uncheck "Ninguna recomendación"
        newState.ningunaRecomendacion = false;
      }

      // Logic for "Instalación de vía alternativa"
      if (field === 'instalacionViaAlternativa' && !checked) {
        newState.viaAlternativaTipos = [];
      }

      return newState;
    });
  };

  const handleRadioChange = (field: keyof ConclusionsData, value: string) => {
    setConclusionsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxGroupChange = (field: keyof ConclusionsData, optionValue: string, checked: boolean) => {
    setConclusionsData((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = checked
        ? [...currentArray, optionValue]
        : currentArray.filter((item) => item !== optionValue);
      return { ...prev, [field]: newArray };
    });
  };

  const handleBack = () => {
    // Decide whether to go back to deglution-result or deglution-nutritiva based on prevEvaluationData
    if (prevEvaluationData?.deglutionNutritiva?.evaluatedNutritiveDeglution) {
      navigate('/deglution-nutritiva', { state: { evaluationData: prevEvaluationData } });
    } else {
      navigate('/deglution-result', { state: { evaluationData: prevEvaluationData } });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (conclusionsData.trastornoDeglucion && !conclusionsData.trastornoOrigen) {
      toast.error('Por favor, seleccione el origen del trastorno de la deglución.');
      return;
    }
    if (conclusionsData.escalaSeveridad && (!conclusionsData.doss || !conclusionsData.fils || !conclusionsData.fois)) {
      toast.error('Por favor, complete todas las escalas de severidad (DOSS, FILS, FOIS).');
      return;
    }
    if (conclusionsData.alimentosPermitidos && conclusionsData.alimentosPermitidosConsistencias.length === 0) {
      toast.error('Por favor, seleccione al menos una consistencia de alimentos permitidos.');
      return;
    }
    if (conclusionsData.bebidasPermitidas && conclusionsData.bebidasPermitidasConsistencias.length === 0) {
      toast.error('Por favor, seleccione al menos una consistencia de bebidas permitidas.');
      return;
    }
    if (conclusionsData.rehabilitacionDeglutoria && conclusionsData.rehabilitacionDeglutoriaTipos.length === 0 && !conclusionsData.rehabilitacionDeglutoriaOtros) {
      toast.error('Por favor, seleccione al menos un tipo de rehabilitación deglutoria o especifique "Otros".');
      return;
    }
    if (conclusionsData.instalacionViaAlternativa && conclusionsData.viaAlternativaTipos.length === 0) {
      toast.error('Por favor, seleccione al menos un tipo de vía alternativa.');
      return;
    }

    const evaluationData: EvaluationData = {
      ...prevEvaluationData, // Spread previous data
      conclusions: conclusionsData,
    };

    toast.success('Evaluación finalizada y conclusiones registradas. Redirigiendo al resumen...');
    navigate('/summary', { state: { evaluationData } }); // Pass all data to the summary page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8">
        <h1 className="text-2xl font-semibold text-efodea-blue mb-6 text-center">Etapa 10.4 - Conclusiones</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            {/* Sin trastorno de la deglución */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sinTrastornoDeglucion" className="text-gray-700 font-medium">Sin trastorno de la deglución</Label>
              <Switch
                id="sinTrastornoDeglucion"
                checked={conclusionsData.sinTrastornoDeglucion}
                onCheckedChange={(checked) => handleSwitchChange('sinTrastornoDeglucion', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Trastorno de la deglución */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="trastornoDeglucion" className="text-gray-700 font-medium">Trastorno de la deglución</Label>
                <Switch
                  id="trastornoDeglucion"
                  checked={conclusionsData.trastornoDeglucion}
                  onCheckedChange={(checked) => handleSwitchChange('trastornoDeglucion', checked)}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {conclusionsData.trastornoDeglucion && (
                <div className="ml-8 mt-4 space-y-2 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Origen:</h3>
                  <RadioGroup
                    onValueChange={(value) => handleRadioChange('trastornoOrigen', value as any)}
                    value={conclusionsData.trastornoOrigen}
                    className="flex flex-col space-y-2"
                  >
                    {trastornoOrigenOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`origen-${option.value}`} />
                        <Label htmlFor={`origen-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>

            {/* No es posible determinar (General) */}
            <div className="flex items-center justify-between">
              <Label htmlFor="noEsPosibleDeterminarGeneral" className="text-gray-700 font-medium">No es posible determinar</Label>
              <Switch
                id="noEsPosibleDeterminarGeneral"
                checked={conclusionsData.noEsPosibleDeterminarGeneral}
                onCheckedChange={(checked) => handleSwitchChange('noEsPosibleDeterminarGeneral', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Escala de severidad */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="escalaSeveridad" className="text-gray-700 font-medium">Escala de severidad</Label>
                <Switch
                  id="escalaSeveridad"
                  checked={conclusionsData.escalaSeveridad}
                  onCheckedChange={(checked) => handleSwitchChange('escalaSeveridad', checked)}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {conclusionsData.escalaSeveridad && (
                <div className="ml-8 mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">DOSS:</Label>
                    <RadioGroup
                      onValueChange={(value) => handleRadioChange('doss', value)}
                      value={conclusionsData.doss}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                    >
                      {dossOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`doss-${option}`} />
                          <Label htmlFor={`doss-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">FILS:</Label>
                    <RadioGroup
                      onValueChange={(value) => handleRadioChange('fils', value)}
                      value={conclusionsData.fils}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                    >
                      {filsOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`fils-${option}`} />
                          <Label htmlFor={`fils-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">FOIS:</Label>
                    <RadioGroup
                      onValueChange={(value) => handleRadioChange('fois', value)}
                      value={conclusionsData.fois}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                    >
                      {foisOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`fois-${option}`} />
                          <Label htmlFor={`fois-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Alimentación */}
            <div className="flex items-center justify-between">
              <Label htmlFor="alimentacionTotalBoca" className="text-gray-700 font-medium">Alimentación total por boca</Label>
              <Switch
                id="alimentacionTotalBoca"
                checked={conclusionsData.alimentacionTotalBoca}
                onCheckedChange={(checked) => setConclusionsData(prev => ({
                  ...prev,
                  alimentacionTotalBoca: checked,
                  alimentacionEnteral: checked ? false : prev.alimentacionEnteral,
                  alimentacionMixta: checked ? false : prev.alimentacionMixta,
                }))}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="alimentacionEnteral" className="text-gray-700 font-medium">Alimentación enteral</Label>
              <Switch
                id="alimentacionEnteral"
                checked={conclusionsData.alimentacionEnteral}
                onCheckedChange={(checked) => setConclusionsData(prev => ({
                  ...prev,
                  alimentacionEnteral: checked,
                  alimentacionTotalBoca: checked ? false : prev.alimentacionTotalBoca,
                  alimentacionMixta: checked ? false : prev.alimentacionMixta,
                }))}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="alimentacionMixta" className="text-gray-700 font-medium">Alimentación mixta</Label>
              <Switch
                id="alimentacionMixta"
                checked={conclusionsData.alimentacionMixta}
                onCheckedChange={(checked) => setConclusionsData(prev => ({
                  ...prev,
                  alimentacionMixta: checked,
                  alimentacionTotalBoca: checked ? false : prev.alimentacionTotalBoca,
                  alimentacionEnteral: checked ? false : prev.alimentacionEnteral,
                }))}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Sólo con especialista */}
            <div className="flex items-center justify-between">
              <Label htmlFor="soloConEspecialista" className="text-gray-700 font-medium">Sólo con especialista</Label>
              <Switch
                id="soloConEspecialista"
                checked={conclusionsData.soloConEspecialista}
                onCheckedChange={(checked) => handleSwitchChange('soloConEspecialista', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Alimentos permitidos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alimentosPermitidos" className="text-gray-700 font-medium">Alimentos permitidos</Label>
                <Switch
                  id="alimentosPermitidos"
                  checked={conclusionsData.alimentosPermitidos}
                  onCheckedChange={(checked) => handleSwitchChange('alimentosPermitidos', checked)}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {conclusionsData.alimentosPermitidos && (
                <div className="ml-8 mt-4 space-y-2 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Consistencias:</h3>
                  {consistenciaOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`alimentos-${option.value}`}
                        checked={conclusionsData.alimentosPermitidosConsistencias.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxGroupChange('alimentosPermitidosConsistencias', option.value, checked as boolean)}
                        className="data-[state=checked]:bg-efodea-blue"
                      />
                      <Label htmlFor={`alimentos-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bebidas permitidas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="bebidasPermitidas" className="text-gray-700 font-medium">Bebidas permitidas</Label>
                <Switch
                  id="bebidasPermitidas"
                  checked={conclusionsData.bebidasPermitidas}
                  onCheckedChange={(checked) => handleSwitchChange('bebidasPermitidas', checked)}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {conclusionsData.bebidasPermitidas && (
                <div className="ml-8 mt-4 space-y-2 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Consistencias:</h3>
                  {consistenciaOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bebidas-${option.value}`}
                        checked={conclusionsData.bebidasPermitidasConsistencias.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxGroupChange('bebidasPermitidasConsistencias', option.value, checked as boolean)}
                        className="data-[state=checked]:bg-efodea-blue"
                      />
                      <Label htmlFor={`bebidas-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            </div>

            {/* Ninguna viscosidad permitida */}
            <div className="flex items-center justify-between">
              <Label htmlFor="ningunaViscosidadPermitida" className="text-gray-700 font-medium">Ninguna viscosidad permitida</Label>
              <Switch
                id="ningunaViscosidadPermitida"
                checked={conclusionsData.ningunaViscosidadPermitida}
                onCheckedChange={(checked) => handleSwitchChange('ningunaViscosidadPermitida', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Otras recomendaciones */}
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Otras Recomendaciones</h2>

            <div className="flex items-center justify-between">
              <Label htmlFor="asistenciaVigilancia" className="text-gray-700 font-medium">Asistencia/Vigilancia</Label>
              <Switch
                id="asistenciaVigilancia"
                checked={conclusionsData.asistenciaVigilancia}
                onCheckedChange={(checked) => handleSwitchChange('asistenciaVigilancia', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="posicion45a90" className="text-gray-700 font-medium">Posición de 45° a 90°</Label>
              <Switch
                id="posicion45a90"
                checked={conclusionsData.posicion45a90}
                onCheckedChange={(checked) => handleSwitchChange('posicion45a90', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maniobraDeglutoria" className="text-gray-700 font-medium">Maniobra deglutoria</Label>
              <Switch
                id="maniobraDeglutoria"
                checked={conclusionsData.maniobraDeglutoria}
                onCheckedChange={(checked) => handleSwitchChange('maniobraDeglutoria', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="verificarResiduosBoca" className="text-gray-700 font-medium">Verificar residuos en boca</Label>
              <Switch
                id="verificarResiduosBoca"
                checked={conclusionsData.verificarResiduosBoca}
                onCheckedChange={(checked) => handleSwitchChange('verificarResiduosBoca', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="modificacionVolumen" className="text-gray-700 font-medium">Modificación de volumen</Label>
              <Switch
                id="modificacionVolumen"
                checked={conclusionsData.modificacionVolumen}
                onCheckedChange={(checked) => handleSwitchChange('modificacionVolumen', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="modificacionVelocidad" className="text-gray-700 font-medium">Modificación de velocidad</Label>
              <Switch
                id="modificacionVelocidad"
                checked={conclusionsData.modificacionVelocidad}
                onCheckedChange={(checked) => handleSwitchChange('modificacionVelocidad', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="modificacionTemperatura" className="text-gray-700 font-medium">Modificación de temperatura</Label>
              <Switch
                id="modificacionTemperatura"
                checked={conclusionsData.modificacionTemperatura}
                onCheckedChange={(checked) => handleSwitchChange('modificacionTemperatura', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="modificacionSabor" className="text-gray-700 font-medium">Modificación de sabor</Label>
              <Switch
                id="modificacionSabor"
                checked={conclusionsData.modificacionSabor}
                onCheckedChange={(checked) => handleSwitchChange('modificacionSabor', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="modificacionTextura" className="text-gray-700 font-medium">Modificación de textura</Label>
              <Switch
                id="modificacionTextura"
                checked={conclusionsData.modificacionTextura}
                onCheckedChange={(checked) => handleSwitchChange('modificacionTextura', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="modificacionConsistencia" className="text-gray-700 font-medium">Modificación de consistencia</Label>
              <Switch
                id="modificacionConsistencia"
                checked={conclusionsData.modificacionConsistencia}
                onCheckedChange={(checked) => handleSwitchChange('modificacionConsistencia', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usoEspesante" className="text-gray-700 font-medium">Uso espesante</Label>
              <Switch
                id="usoEspesante"
                checked={conclusionsData.usoEspesante}
                onCheckedChange={(checked) => handleSwitchChange('usoEspesante', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usoCucharaMedidora" className="text-gray-700 font-medium">Uso cuchara medidora</Label>
              <Switch
                id="usoCucharaMedidora"
                checked={conclusionsData.usoCucharaMedidora}
                onCheckedChange={(checked) => handleSwitchChange('usoCucharaMedidora', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usoVasoAdaptado" className="text-gray-700 font-medium">Uso vaso adaptado</Label>
              <Switch
                id="usoVasoAdaptado"
                checked={conclusionsData.usoVasoAdaptado}
                onCheckedChange={(checked) => handleSwitchChange('usoVasoAdaptado', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usoJeringa" className="text-gray-700 font-medium">Uso jeringa</Label>
              <Switch
                id="usoJeringa"
                checked={conclusionsData.usoJeringa}
                onCheckedChange={(checked) => handleSwitchChange('usoJeringa', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usoBombilla" className="text-gray-700 font-medium">Uso bombilla</Label>
              <Switch
                id="usoBombilla"
                checked={conclusionsData.usoBombilla}
                onCheckedChange={(checked) => handleSwitchChange('usoBombilla', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usoProtesisDental" className="text-gray-700 font-medium">Uso prótesis dental</Label>
              <Switch
                id="usoProtesisDental"
                checked={conclusionsData.usoProtesisDental}
                onCheckedChange={(checked) => handleSwitchChange('usoProtesisDental', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* NEW: Optimizar higiene oral */}
            <div className="flex items-center justify-between">
              <Label htmlFor="optimizarHigieneOral" className="text-gray-700 font-medium">Optimizar higiene oral</Label>
              <Switch
                id="optimizarHigieneOral"
                checked={conclusionsData.optimizarHigieneOral}
                onCheckedChange={(checked) => handleSwitchChange('optimizarHigieneOral', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* NEW: Ninguna recomendación */}
            <div className="flex items-center justify-between">
              <Label htmlFor="ningunaRecomendacion" className="text-gray-700 font-medium">Ninguna recomendación</Label>
              <Switch
                id="ningunaRecomendacion"
                checked={conclusionsData.ningunaRecomendacion}
                onCheckedChange={(checked) => handleSwitchChange('ningunaRecomendacion', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* NEW: Instalación de vía alternativa */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="instalacionViaAlternativa" className="text-gray-700 font-medium">Instalación de vía alternativa</Label>
                <Switch
                  id="instalacionViaAlternativa"
                  checked={conclusionsData.instalacionViaAlternativa}
                  onCheckedChange={(checked) => handleSwitchChange('instalacionViaAlternativa', checked)}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {conclusionsData.instalacionViaAlternativa && (
                <div className="ml-8 mt-4 space-y-2 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Tipos de vía alternativa:</h3>
                  {viaAlternativaOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`via-alternativa-${option.value}`}
                        checked={conclusionsData.viaAlternativaTipos.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxGroupChange('viaAlternativaTipos', option.value, checked as boolean)}
                        className="data-[state=checked]:bg-efodea-blue"
                      />
                      <Label htmlFor={`via-alternativa-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NEW: Evaluación complementaria */}
            <div className="flex items-center justify-between">
              <Label htmlFor="evaluacionComplementaria" className="text-gray-700 font-medium">Evaluación complementaria</Label>
              <Switch
                id="evaluacionComplementaria"
                checked={conclusionsData.evaluacionComplementaria}
                onCheckedChange={(checked) => handleSwitchChange('evaluacionComplementaria', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* NEW: Terapia de deglución */}
            <div className="flex items-center justify-between">
              <Label htmlFor="terapiaDeglucion" className="text-gray-700 font-medium">Terapia de deglución</Label>
              <Switch
                id="terapiaDeglucion"
                checked={conclusionsData.terapiaDeglucion}
                onCheckedChange={(checked) => handleSwitchChange('terapiaDeglucion', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* NEW: Evaluación comunicativa */}
            <div className="flex items-center justify-between">
              <Label htmlFor="evaluacionComunicativa" className="text-gray-700 font-medium">Evaluación comunicativa</Label>
              <Switch
                id="evaluacionComunicativa"
                checked={conclusionsData.evaluacionComunicativa}
                onCheckedChange={(checked) => handleSwitchChange('evaluacionComunicativa', checked)}
                className="data-[state=checked]:bg-efodea-blue"
              />
            </div>

            {/* Uso de estimulación */}
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Uso de estimulación:</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="usoEstimulacionSensorial" className="text-gray-700 font-medium">Sensorial</Label>
                <Switch
                  id="usoEstimulacionSensorial"
                  checked={conclusionsData.usoEstimulacionSensorial}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, usoEstimulacionSensorial: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="usoEstimulacionTermica" className="text-gray-700 font-medium">Térmica</Label>
                <Switch
                  id="usoEstimulacionTermica"
                  checked={conclusionsData.usoEstimulacionTermica}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, usoEstimulacionTermica: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="usoEstimulacionMecanica" className="text-gray-700 font-medium">Mecánica</Label>
                <Switch
                  id="usoEstimulacionMecanica"
                  checked={conclusionsData.usoEstimulacionMecanica}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, usoEstimulacionMecanica: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="usoEstimulacionElectrica" className="text-gray-700 font-medium">Eléctrica</Label>
                <Switch
                  id="usoEstimulacionElectrica"
                  checked={conclusionsData.usoEstimulacionElectrica}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, usoEstimulacionElectrica: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="usoEstimulacionFarmacologica" className="text-gray-700 font-medium">Farmacológica</Label>
                <Switch
                  id="usoEstimulacionFarmacologica"
                  checked={conclusionsData.usoEstimulacionFarmacologica}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, usoEstimulacionFarmacologica: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="usoEstimulacionOtros" className="text-gray-700 font-medium">Otros</Label>
                <Switch
                  id="usoEstimulacionOtros"
                  checked={!!conclusionsData.usoEstimulacionOtros}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, usoEstimulacionOtros: checked ? prev.usoEstimulacionOtros : '' }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {!!conclusionsData.usoEstimulacionOtros && (
                <Input
                  id="usoEstimulacionOtrosText"
                  type="text"
                  placeholder="Especificar otros tipos de estimulación..."
                  value={conclusionsData.usoEstimulacionOtros}
                  onChange={(e) => setConclusionsData(prev => ({ ...prev, usoEstimulacionOtros: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mt-2"
                />
              )}
            </div>

            {/* Rehabilitación deglutoria */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="rehabilitacionDeglutoria" className="text-gray-700 font-medium">Rehabilitación deglutoria</Label>
                <Switch
                  id="rehabilitacionDeglutoria"
                  checked={conclusionsData.rehabilitacionDeglutoria}
                  onCheckedChange={(checked) => handleSwitchChange('rehabilitacionDeglutoria', checked)}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {conclusionsData.rehabilitacionDeglutoria && (
                <div className="ml-8 mt-4 space-y-2 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Tipos:</h3>
                  {rehabilitacionTiposOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rehab-${option.value}`}
                        checked={conclusionsData.rehabilitacionDeglutoriaTipos.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxGroupChange('rehabilitacionDeglutoriaTipos', option.value, checked as boolean)}
                        className="data-[state=checked]:bg-efodea-blue"
                      />
                      <Label htmlFor={`rehab-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                  {conclusionsData.rehabilitacionDeglutoriaTipos.includes('otros') && (
                    <Input
                      id="rehabilitacionDeglutoriaOtros"
                      type="text"
                      placeholder="Especificar otros tipos de rehabilitación..."
                      value={conclusionsData.rehabilitacionDeglutoriaOtros}
                      onChange={(e) => setConclusionsData(prev => ({ ...prev, rehabilitacionDeglutoriaOtros: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mt-2"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Derivación a otros profesionales */}
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Derivación a:</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="derivacionNutricionista" className="text-gray-700 font-medium">Nutricionista</Label>
                <Switch
                  id="derivacionNutricionista"
                  checked={conclusionsData.derivacionNutricionista}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, derivacionNutricionista: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="derivacionKinesiologo" className="text-gray-700 font-medium">Kinesiólogo</Label>
                <Switch
                  id="derivacionKinesiologo"
                  checked={conclusionsData.derivacionKinesiologo}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, derivacionKinesiologo: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="derivacionTerapeutaOcupacional" className="text-gray-700 font-medium">Terapeuta Ocupacional</Label>
                <Switch
                  id="derivacionTerapeutaOcupacional"
                  checked={conclusionsData.derivacionTerapeutaOcupacional}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, derivacionTerapeutaOcupacional: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="derivacionMedico" className="text-gray-700 font-medium">Médico</Label>
                <Switch
                  id="derivacionMedico"
                  checked={conclusionsData.derivacionMedico}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, derivacionMedico: checked }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="derivacionOtros" className="text-gray-700 font-medium">Otros</Label>
                <Switch
                  id="derivacionOtros"
                  checked={!!conclusionsData.derivacionOtros}
                  onCheckedChange={(checked) => setConclusionsData(prev => ({ ...prev, derivacionOtros: checked ? prev.derivacionOtros : '' }))}
                  className="data-[state=checked]:bg-efodea-blue"
                />
              </div>
              {!!conclusionsData.derivacionOtros && (
                <Input
                  id="derivacionOtrosText"
                  type="text"
                  placeholder="Especificar otros profesionales..."
                  value={conclusionsData.derivacionOtros}
                  onChange={(e) => setConclusionsData(prev => ({ ...prev, derivacionOtros: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mt-2"
                />
              )}
            </div>

            {/* Observaciones */}
            <div className="mt-6">
              <Label htmlFor="observaciones" className="block text-gray-700 font-medium mb-2">Observaciones</Label>
              <Textarea
                id="observaciones"
                rows={4}
                placeholder="Ingrese cualquier observación adicional..."
                value={conclusionsData.observaciones}
                onChange={(e) => setConclusionsData(prev => ({ ...prev, observaciones: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              className="p-3 bg-efodea-blue text-white font-medium rounded-lg hover:bg-efodea-blue-hover transition-colors"
            >
              Finalizar Evaluación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConclusionsPage;