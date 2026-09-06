export type Language = 'mr' | 'hi' | 'en';

export type AnswerSource = 'recommended' | 'custom';

export interface FarmerProfile {
  id: string;
  uid?: string;
  email?: string;
  photoURL?: string;
  isFirebaseUser?: boolean;
  profileCompleted?: boolean;
  name: string;
  nameSource?: AnswerSource;
  phoneNumber: string;
  preferredLanguage?: Language;
  language?: Language;
  languageSource?: AnswerSource;
  location: {
    village: string;
    villageSource?: AnswerSource;
    taluka: string;
    talukaSource?: AnswerSource;
    district: string;
    districtSource?: AnswerSource;
    state: string;
    stateSource?: AnswerSource;
    lat?: number;
    lon?: number;
    latitude?: number;
    longitude?: number;
  };
  activeFieldId: string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string; // e.g. "गट क्र. ४२ (कापूस)", "विहिरीजवळचे शेत"
  crop: string;
  cropSource?: AnswerSource;
  variety?: string;
  acreage: number;
  acreageSource?: AnswerSource;
  acreageUnit?: string;
  sowingDate: string;
  soilType: string; // "काळी कसदार (Black Cotton)", "तांबडी (Red)", "गाळाची (Loamy)", "हलकी मुरमाड (Light Sandy)"
  soilTypeSource?: AnswerSource;
  soilHealthSummary?: string;
  soilHealthSummarySource?: AnswerSource;
  soilReportPhotoUrl?: string;
  cropPhotoUrl?: string;
  fertilizerPhotoUrl?: string;
  cropStage: string; // "Sowing / उगवण", "Vegetative / शाकीय वाढ", "Flowering / फुले येणे", "Fruiting / बोंडे-दाणे भरणे", "Maturity / पक्वता"
  cropStageSource?: AnswerSource;
  currentPlannedFertilizer?: string;
  currentPlannedFertilizerSource?: AnswerSource;
  previousFertilizerUsed?: string;
  previousFertilizerUsedSource?: AnswerSource;
  irrigationType?: string; // "ठिबक सिंचन (Drip)", "तुषार सिंचन (Sprinkler)", "पाटपाणी (Surface)", "जिरायती (Rainfed)"
  irrigationTypeSource?: AnswerSource;
  fertilizerHistory: FertilizerApplication[];
  recentProblems: string[];
  cropProblemSource?: AnswerSource;
}

export interface FertilizerApplication {
  id?: string;
  date: string;
  productName: string;
  npk?: string;
  quantityBags?: number;
  bagWeightKg?: number;
  costPerBag?: number;
  totalCost?: number;
  stage?: string;
  dosePerAcre?: string;
  applicationMethod?: string;
  notes?: string;
}

export interface DiaryEntry {
  id: string;
  fieldId: string;
  date: string;
  activityType: 'sowing' | 'fertilizer' | 'spray' | 'irrigation' | 'problem' | 'harvest' | 'general' | 'other';
  title: string;
  description: string;
  cost?: number;
  photoUrl?: string;
  voiceNoteDurationSec?: number;
}

export type FarmDiaryEntry = DiaryEntry;

export type ConfidenceLevel = 'HIGH' | 'MODERATE' | 'LOW';

export interface CropAnalysisResult {
  identifiedCrop: string;
  issueNameLocal: string;
  issueNameScientific: string;
  category: 'pest' | 'disease' | 'deficiency' | 'environmental' | 'healthy' | 'uncertain';
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  confidenceReason: string;
  symptomsObserved: string[];
  immediateAction: string;
  safeTreatmentOrganic: string[];
  safeTreatmentChemical: string[];
  preventionTips: string[];
  questionsForFarmer: string[];
  expertEscalationRecommended: boolean;
}

export type SafetyStatus = 'SAFE' | 'NEED_MORE_INFO' | 'DO_NOT_RECOMMEND';

export interface FertilizerEvaluationResult {
  extractedProduct: {
    productName: string;
    npk: string;
    nutrients: string[];
    manufacturer: string;
    fertilizerType: 'water_soluble' | 'granular_soil' | 'bio_fertilizer' | 'micronutrient' | 'organic';
    confidenceOcr: number;
  };
  safetyStatus: SafetyStatus;
  badgeTitle: string;
  summaryExplanation: string;
  detailedAgronomicReason: string;
  recommendedDosage: {
    dosePerAcre: string;
    applicationMethod: 'soil_application' | 'foliar_spray' | 'fertigation_drip';
    instructions: string;
  };
  compatibilityWarning: string | null;
  missingInformationNeeded: string[];
  expertEscalationRequired: boolean;
}

export interface SoilReportParameter {
  parameter: string;
  value: number | null;
  unit: string;
  rating: 'LOW' | 'MEDIUM' | 'NORMAL' | 'HIGH' | 'DEFICIENT' | 'SUFFICIENT' | 'NOT_TESTED';
  localExplanation: string;
}

export interface SoilReportResult {
  labName?: string | null;
  sampleDate?: string | null;
  soilParameters: SoilReportParameter[];
  micronutrients?: {
    name: string;
    value: number | null;
    rating: 'DEFICIENT' | 'SUFFICIENT' | 'NOT_TESTED';
    localAdvice: string;
  }[];
  overallSoilHealth: 'POOR' | 'MODERATE' | 'GOOD' | 'EXCELLENT';
  simpleHealthSummary: string;
  keyRecommendations: string[];
  organicAmendments: string[];
  recommendedCrops: string[];
}

export interface WeatherData {
  location: string;
  coordinates: { lat: number; lon: number };
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    rain: number;
    weatherCode: number;
  };
  daily: {
    date: string;
    maxTemp: number;
    minTemp: number;
    rainSum: number;
    rainProb: number;
    weatherCode: number;
  }[];
  agroAdvisories: {
    type: 'danger' | 'warning' | 'info' | 'good';
    title: string;
    advice: string;
  }[];
}
