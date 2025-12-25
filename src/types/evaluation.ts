export interface IdentificationData {
  patientName: string;
  age: string;
  medicalHistoryToggle: boolean;
  selectedMedicalHistory: string[];
  otherMedicalHistory: string;
  swallowingHistory: string;
}

export interface RespirationData {
  noArtificialAirway: boolean;
  selectedRespirationOptions: string[];
  orotrachealIntubation: boolean;
  tracheostomy: boolean;
}

export interface NutritionData {
  hasOralFeeding: boolean;
  hasNonOralFeeding: boolean;
  hasMixedFeeding: boolean;
  selectedOralConsistency: string | undefined;
}

export interface ConsciousnessData {
  isVigil: boolean;
  hasAlteredConsciousness: boolean;
  selectedAlteredConsciousness: string[];
}

export interface CommunicationData {
  mainCommunicationOption: string | undefined;
  selectedCooperation: string | undefined;
  selectedAttention: string | undefined;
  selectedCalmness: string | undefined;
  selectedOrientation: string | undefined;
  selectedInstructionFollowing: string | undefined;
  selectedVoiceAlterationType: string | undefined;
}

export interface OrofacialEvaluationData {
  noPresentaAlteracion: boolean;
  alteracionEstructuras: boolean;
  alteracionMotora: boolean;
  rangoFuerzaRostroMandibula: boolean;
  rangoFuerzaRostroMandibulaDerecha: boolean; // New
  rangoFuerzaRostroMandibulaIzquierda: boolean; // New
  rangoFuerzaLabios: boolean;
  rangoFuerzaLabiosDerecha: boolean; // New
  rangoFuerzaLabiosIzquierda: boolean; // New
  rangoFuerzaLengua: boolean;
  rangoFuerzaLenguaDerecha: boolean; // New
  rangoFuerzaLenguaIzquierda: boolean; // New
  alteracionSensibilidad: boolean;
  sensibilidadExtraoralDerecha: boolean;
  sensibilidadExtraoralIzquierda: boolean;
  sensibilidadIntraoralDerecha: boolean;
  sensibilidadIntraoralIzquierda: boolean;
  asimetriaFacial: boolean;
  higieneOral: boolean;
  higieneBuena: boolean;
  higieneMala: boolean;
  higieneRegular: boolean;
}

export interface DentitionData {
  noPresentaAlteracion: boolean;
  perdidaPiezas: boolean;
  superior: boolean;
  inferior: boolean;
  adaptada: boolean;
  noAdaptada: boolean;
  total: boolean;
  parcial: boolean;
  usoAdhesivo: boolean;
  evaluacionConProtesis: boolean;
  evaluacionSinProtesis: boolean;
}

export interface ReflexesData {
  noPresentaAlteracion: boolean;
  presentaAlteracion: boolean;
  tosVoluntariaProductiva: boolean;
  tosVoluntariaNoProductiva: boolean;
  tosVoluntariaAusente: boolean;
  tosReflejaProductiva: boolean;
  tosReflejaNoProductiva: boolean;
  tosReflejaAusente: boolean;
}

export interface DeglutionNoNutritivaData {
  sinAlteracion: boolean;
  acumulacionSaliva: boolean;
  escapeAnterior: boolean;
  xerostomia: boolean;
  noDegluteEspontaneamente: boolean;
  rmoMasDeUnSegundo: boolean;
  excursionLaringeaAusente: boolean;
  odinofagia: boolean;
  vozHumedaSinAclaramiento: boolean;
  aclaraVozEspontanea: boolean;
  aclaraVozSolicitud: boolean;
  aclaraVozDegluciones: boolean;
  aclaraVozCarraspeo: boolean;
  aclaraVozTos: boolean;
  ascultacionCervicalHumeda: boolean;
  bdtInmediato: boolean;
  evaluacionPenetracion: boolean;
  evaluacionAspiracion: boolean;
  evaluacionAspiracionSilente: boolean;
}

// New interface for individual consistency evaluation
export interface ConsistencyEvaluation {
  volume: '3ml' | '5ml' | '10ml' | '20ml' | undefined;
  cough: boolean;
  wetVoice: boolean;
  voiceClearing: boolean;
  stridor: boolean;
  dyspnea: boolean;
  cyanosis: boolean;
  otherSignsText: string; // Text for other signs, empty if none
}

export interface DeglutionNutritivaData {
  evaluatedNutritiveDeglution: boolean;
  liquidFine?: ConsistencyEvaluation;
  liquidNectar?: ConsistencyEvaluation;
  liquidHoney?: ConsistencyEvaluation;
  puree?: ConsistencyEvaluation;
  softSolid?: ConsistencyEvaluation;
  solid?: ConsistencyEvaluation;
}

export interface ConclusionsData {
  sinTrastornoDeglucion: boolean;
  trastornoDeglucion: boolean;
  trastornoOrigen: 'neurogenico' | 'mecanico' | 'iatrogenico' | 'mixto' | 'no_determinar' | undefined;
  noEsPosibleDeterminarGeneral: boolean;
  escalaSeveridad: boolean;
  doss: string | undefined;
  fils: string | undefined;
  fois: string | undefined;
  alimentacionTotalBoca: boolean;
  alimentacionEnteral: boolean;
  alimentacionMixta: boolean;
  soloConEspecialista: boolean;
  alimentosPermitidos: boolean;
  alimentosPermitidosConsistencias: string[];
  bebidasPermitidas: boolean;
  bebidasPermitidasConsistencias: string[];
  ningunaViscosidadPermitida: boolean;
  asistenciaVigilancia: boolean;
  posicion45a90: boolean;
  verificarResiduosBoca: boolean;

  // Maniobras Posturales
  maniobrasPosturales: boolean;
  maniobrasPosturalesTipos: string[]; // 'chin_up', 'chin_down', etc.

  // Modificación Sensorial
  modificacionSensorial: boolean;
  modificacionSensorialTipos: string[]; // 'uso_chip_hielo', 'aplicacion_termo_tactil'

  // Modificación de Volumen
  modificacionVolumen: boolean; // Keep existing switch
  modificacionVolumenCustom: string; // Optional text input

  // Modificación de Velocidad
  modificacionVelocidad: boolean; // Keep existing switch
  modificacionVelocidadOpciones: '3s' | '5s' | '7s' | '10s' | 'post_deglucion' | undefined;

  // Modificación de Temperatura
  modificacionTemperatura: boolean; // Keep existing switch
  modificacionTemperaturaCustom: string; // Optional text input

  // Modificación de Sabor
  modificacionSabor: boolean; // Keep existing switch

  // Modificación de Textura
  modificacionTextura: boolean; // Keep existing switch

  // Modificación de Consistencia
  modificacionConsistencia: boolean; // Keep existing switch
  modificacionConsistenciaTipos: string[]; // 'liquidos', 'semiliquidos', 'semisolidos', 'solidos'

  // Modificación de Viscosidad
  modificacionViscosidad: boolean;
  modificacionViscosidadTipos: string[]; // 'liquido_fino', 'nectar', 'miel', 'pudding'

  usoEspesante: boolean;
  usoCucharaMedidora: boolean;
  usoVasoAdaptado: boolean;
  usoJeringa: boolean;
  usoBombilla: boolean;
  usoProtesisDental: boolean;
  usoEstimulacionSensorial: boolean;
  usoEstimulacionTermica: boolean;
  usoEstimulacionMecanica: boolean;
  usoEstimulacionElectrica: boolean;
  usoEstimulacionFarmacologica: boolean;
  usoEstimulacionOtros: string;

  // Terapia Fonoaudiológica (replaces old rehabilitacionDeglutoria and terapiaDeglucion)
  terapiaFonoaudiologica: boolean;
  terapiaFonoaudiologicaTipos: string[]; // 'terapia_deglucion', 'terapia_voz', 'terapia_motricidad_orofacial', 'terapia_lenguaje', 'terapia_cognitivo_comunicativa', 'terapia_habla'
  terapiaDeglucionSubManiobrasRehabilitadoras: boolean; // If 'terapia_deglucion' is selected, this enables specific rehab maneuvers
  terapiaDeglucionSubManiobrasCompensatorias: boolean; // If 'terapia_deglucion' is selected, this enables specific comp. maneuvers
  rehabilitacionDeglutoriaTipos: string[]; // Specific types under "Maniobras rehabilitadoras" (ejercicios_fuerza, deglucion_con_esfuerzo, etc.)
  rehabilitacionDeglutoriaOtros: string; // Custom text for "Maniobras rehabilitadoras - Otros"

  derivacionNutricionista: boolean;
  derivacionKinesiologo: boolean;
  derivacionTerapeutaOcupacional: boolean;
  derivacionMedico: boolean;
  derivacionOtros: string;
  observaciones: string;
  optimizarHigieneOral: boolean;
  ningunaRecomendacion: boolean;
  instalacionViaAlternativa: boolean;
  viaAlternativaTipos: string[];
  evaluacionComplementaria: boolean;
  // terapiaDeglucion: boolean; // REMOVED, now part of terapiaFonoaudiologicaTipos
  evaluacionComunicativa: boolean;
}

export interface EvaluationData {
  identification?: IdentificationData;
  respiration?: RespirationData;
  nutrition?: NutritionData;
  consciousness?: ConsciousnessData;
  communication?: CommunicationData;
  orofacialEvaluation?: OrofacialEvaluationData;
  dentition?: DentitionData;
  reflexes?: ReflexesData;
  deglutionNoNutritiva?: DeglutionNoNutritivaData;
  deglutionNutritiva?: DeglutionNutritivaData;
  conclusions?: ConclusionsData;
  deglutionNoNutritivaScore?: number; // To pass the calculated score
  deglutionNutritivaScore?: number; // New: To pass the calculated score for nutritive deglutition
}