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
  activeAnimalId?: string;
  animals?: Animal[];
}

export interface Field {
  id: string;
  name: string; // e.g. "Field 1", "गट क्र. ४२ (कापूस)", "विहिरीजवळचे शेत"
  crop: string;
  cropSource?: AnswerSource;
  variety?: string; // Optional crop variety
  acreage: number;
  acreageSource?: AnswerSource;
  acreageUnit?: string; // e.g. "एकर (Acres)", "गुंठे (Guntha)", "हेक्टर (Hectares)"
  location?: {
    village: string;
    taluka: string;
    district: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
  sowingDate: string;
  soilType: string; // "काळी कसदार (Black Cotton)", "तांबडी (Red)", "गाळाची (Loamy)", "हलकी मुरमाड (Light Sandy)"
  soilTypeSource?: AnswerSource;
  soilHealthSummary?: string;
  soilHealthSummarySource?: AnswerSource;
  soilReportPhotoUrl?: string;
  soilReport?: SoilReportResult;
  cropPhotoUrl?: string;
  cropPhotos?: string[]; // Multiple photos of crop
  fertilizerPhotoUrl?: string;
  cropStage: string; // "Sowing / उगवण", "Vegetative / शाकीय वाढ", "Flowering / फुले येणे", "Fruiting / बोंडे-दाणे भरणे", "Maturity / पक्वता"
  cropStageSource?: AnswerSource;
  currentPlannedFertilizer?: string;
  currentPlannedFertilizerSource?: AnswerSource;
  previousFertilizerUsed?: string;
  previousFertilizerUsedSource?: AnswerSource;
  irrigationType?: string; // "ठिबक सिंचन (Drip)", "तुषार सिंचन (Sprinkler)", "पाटपाणी (Surface)", "जिरायती (Rainfed)"
  irrigationTypeSource?: AnswerSource;
  currentCropProblem?: string; // Specific problem for this field
  recentProblems: string[];
  cropProblemSource?: AnswerSource;
  fertilizerHistory: FertilizerApplication[];
  activities?: DiaryEntry[]; // Field activity history
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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

// ==========================================
// 🐄 CATTLE & LIVESTOCK TYPES (Parts 11 - 22)
// ==========================================

export type AnimalType = 'cow' | 'buffalo' | 'bull' | 'calf' | 'goat' | 'sheep' | 'poultry' | 'other';
export type AnimalSex = 'female' | 'male';
export type PregnancyStatus = 'not_pregnant' | 'pregnant' | 'in_heat' | 'recently_delivered' | 'none' | 'unknown';

export interface Animal {
  id: string;
  name: string; // e.g., "Gauri", "Lakshmi", "Rani"
  tagNumber?: string;
  type: AnimalType; // "cow", "buffalo", etc.
  breed: string; // e.g., "Gir", "Murrah", "Khillari", "Osmanabadi"
  sex?: AnimalSex;
  ageYears: number;
  ageMonths?: number;
  dateOfBirth?: string;
  approximateWeightKg?: number;
  photoUrl?: string;
  pregnancyStatus?: PregnancyStatus;
  pregnancyDate?: string;
  inseminationDate?: string;
  expectedDeliveryDate?: string;
  lactationStage?: 'lactating' | 'dry' | 'pregnant' | 'heifer' | 'not_applicable';
  dailyMilkLiters?: number;
  healthRecords?: AnimalHealthCheck[];
  vaccinations?: AnimalVaccination[];
  treatments?: AnimalTreatment[];
  milkRecords?: MilkRecord[];
  feedRecords?: AnimalFeedRecord[];
  breedingRecords?: BreedingRecord[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnimalHealthCheck {
  id: string;
  animalId: string;
  animalName?: string;
  animalType?: AnimalType;
  date: string;
  symptomsText?: string;
  symptoms?: string[];
  photoUrl?: string;
  confidence?: ConfidenceLevel;
  possibleCauses?: string[];
  whatToCheck?: string[];
  safeNextSteps?: string[];
  warningSigns?: string[];
  veterinaryHelpRecommended?: boolean;
  isEmergency?: boolean;
  emergencyReason?: string;
  severity?: string;
  recommendedNextStep?: string;
  notes?: string;
  createdAt?: string;
}

export interface AnimalVaccination {
  id: string;
  animalId: string;
  vaccineName: string; // e.g., "FMD / लाळ्या खुरकूत", "HS / घटसर्प", "BQ / फऱ्या", "Brucellosis"
  dateAdministered?: string;
  administeredDate?: string;
  nextDueDate: string;
  veterinarian?: string;
  batchNumber?: string;
  notes?: string;
  createdAt?: string;
}

export interface AnimalTreatment {
  id: string;
  animalId: string;
  date: string;
  healthProblem: string;
  disease?: string;
  veterinarian?: string;
  treatmentSummary: string;
  treatment?: string;
  medicinePrescribed?: string;
  dose?: string;
  duration?: string;
  result?: 'recovered' | 'ongoing' | 'critical' | 'followup_needed';
  notes?: string;
  createdAt?: string;
}

export type FeedType = 'green_fodder' | 'dry_fodder' | 'concentrate' | 'mineral_mixture' | 'other';

export interface AnimalFeedRecord {
  id: string;
  animalId: string;
  date: string;
  feedType: FeedType;
  customFeedName?: string;
  quantity: number;
  unit: string; // "kg", "पेंढी / Bundles"
  feedingTime: 'morning' | 'afternoon' | 'evening';
  notes?: string;
  createdAt?: string;
}

export interface MilkRecord {
  id: string;
  animalId: string;
  date: string;
  morningLiters: number;
  eveningLiters: number;
  totalDailyLiters?: number;
  fatPercentage?: number;
  snfPercentage?: number;
  snf?: number;
  notes?: string;
  createdAt?: string;
}

export type BreedingEventType = 'heat_observed' | 'mating' | 'artificial_insemination' | 'pregnancy_confirmed' | 'delivery' | 'offspring_recorded';

export interface BreedingRecord {
  id: string;
  animalId: string;
  eventType: BreedingEventType;
  date: string;
  expectedDeliveryDate?: string;
  expectedCalvingDate?: string;
  result?: string;
  sireOrStrawDetails?: string;
  offspringCount?: number;
  offspringGender?: string;
  veterinarianOrInseminator?: string;
  notes?: string;
  createdAt?: string;
}

// ==========================================
// 📅 SMART FARMING CALENDAR & TASKS (Part 4 & 9)
// ==========================================

export type TaskCategory =
  | 'irrigation'
  | 'fertilizer'
  | 'spray'
  | 'crop_inspection'
  | 'harvest'
  | 'animal_vaccination'
  | 'animal_health_followup'
  | 'animal_breeding'
  | 'vaccination'
  | 'health'
  | 'feed'
  | 'custom'
  | string;

export interface FarmTask {
  id: string;
  title: string;
  category: TaskCategory;
  targetType?: 'field' | 'animal' | 'general';
  targetId?: string;
  targetName?: string;
  animalId?: string;
  fieldId?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  completed?: boolean;
  isCompleted?: boolean;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  createdAt?: string;
}

// ==========================================
// 💰 FARM EXPENSE & INCOME (Part 5)
// ==========================================

export type FinanceType = 'expense' | 'income';

export type ExpenseCategory =
  | 'seeds'
  | 'fertilizer'
  | 'pesticides'
  | 'labour'
  | 'irrigation'
  | 'machinery'
  | 'transport'
  | 'animal_feed'
  | 'veterinary'
  | 'other'
  | string;

export type IncomeCategory =
  | 'crop_sales'
  | 'crop_sale'
  | 'milk_sales'
  | 'dairy_sale'
  | 'animal_sales'
  | 'other'
  | string;

export interface FinanceRecord {
  id: string;
  type: FinanceType;
  category: ExpenseCategory | IncomeCategory | string;
  title?: string;
  amount: number;
  date: string;
  quantity?: number;
  unit?: string;
  buyerOrVendor?: string;
  targetType?: 'field' | 'animal' | 'general';
  targetId?: string;
  targetName?: string;
  notes?: string;
  createdAt?: string;
}

// ==========================================
// 📦 FARM INVENTORY / STOCK (Part 7)
// ==========================================

export type StockCategory = 'fertilizer' | 'seed' | 'pesticide' | 'bio_product' | 'animal_feed' | 'cattle_feed' | 'equipment' | 'other' | string;
export type InventoryCategory = StockCategory;

export interface InventoryItem {
  id: string;
  productName?: string;
  name?: string;
  category: StockCategory;
  quantity: number;
  unit: string; // "Bags / पोती", "Kg", "Liters", "Packets"
  purchaseDate?: string;
  expiryDate?: string;
  intendedTarget?: string; // e.g. "Field 2 (Soybean)" or "Cows"
  minimumThreshold?: number;
  minThreshold?: number;
  storageLocation?: string;
  cost?: number;
  photoUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

