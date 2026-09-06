import React, { useState, useMemo } from 'react';
import {
  X,
  Mic,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  Sprout,
  Compass,
  Loader2,
  Search,
  Map,
  PlusCircle,
  Edit3,
} from 'lucide-react';
import { FarmerProfile, Field, Language, AnswerSource } from '../types';
import { startVoiceRecognition } from '../utils/speech';
import {
  MAHARASHTRA_DISTRICTS,
  searchDistricts,
  searchTalukas,
  searchVillages,
} from '../data/maharashtraLocations';

interface OnboardingWizardModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onComplete: (updatedProfile: FarmerProfile) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  language: initialLang,
  profile,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;

  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  // Selected Language
  const [lang, setLang] = useState<Language>(initialLang || profile.language || 'mr');

  // Question 1: Name
  const [farmerName, setFarmerName] = useState(profile.name || '');

  // Question 2: Location
  const [locationMode, setLocationMode] = useState<'hierarchy' | 'map'>('hierarchy');
  
  const [district, setDistrict] = useState(profile.location?.district || 'Satara');
  const [isCustomDistrict, setIsCustomDistrict] = useState(profile.location?.districtSource === 'custom');
  const [customDistrict, setCustomDistrict] = useState(profile.location?.districtSource === 'custom' ? profile.location?.district || '' : '');
  const [districtQuery, setDistrictQuery] = useState('');
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  const [taluka, setTaluka] = useState(profile.location?.taluka || 'Karad');
  const [isCustomTaluka, setIsCustomTaluka] = useState(profile.location?.talukaSource === 'custom');
  const [customTaluka, setCustomTaluka] = useState(profile.location?.talukaSource === 'custom' ? profile.location?.taluka || '' : '');
  const [talukaQuery, setTalukaQuery] = useState('');
  const [isTalukaDropdownOpen, setIsTalukaDropdownOpen] = useState(false);

  const [village, setVillage] = useState(profile.location?.village || 'Malkapur');
  const [isCustomVillage, setIsCustomVillage] = useState(profile.location?.villageSource === 'custom');
  const [customVillage, setCustomVillage] = useState(profile.location?.villageSource === 'custom' ? profile.location?.village || '' : '');
  const [villageQuery, setVillageQuery] = useState('');
  const [isVillageDropdownOpen, setIsVillageDropdownOpen] = useState(false);

  const [lat, setLat] = useState<number | undefined>(profile.location?.latitude || profile.location?.lat);
  const [lon, setLon] = useState<number | undefined>(profile.location?.longitude || profile.location?.lon);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  // Filtered location data calculations
  const filteredDistricts = useMemo(() => searchDistricts(districtQuery), [districtQuery]);
  const filteredTalukas = useMemo(() => searchTalukas(district, talukaQuery), [district, talukaQuery]);
  const filteredVillages = useMemo(() => searchVillages(district, taluka, villageQuery), [district, taluka, villageQuery]);

  // Question 3: Crop
  const [crop, setCrop] = useState(activeField?.crop || 'कापूस (Cotton)');
  const [isCustomCrop, setIsCustomCrop] = useState(activeField?.cropSource === 'custom');
  const [customCrop, setCustomCrop] = useState(activeField?.cropSource === 'custom' ? activeField?.crop || '' : '');

  // Question 4: Land Area
  const [acreage, setAcreage] = useState<number>(activeField?.acreage || 4.0);
  const [acreageUnit, setAcreageUnit] = useState<string>(activeField?.acreageUnit || 'एकर (Acres)');
  const [isCustomAcreage, setIsCustomAcreage] = useState(activeField?.acreageSource === 'custom');
  const [customAcreage, setCustomAcreage] = useState(activeField?.acreageSource === 'custom' ? String(activeField?.acreage || '') : '');

  // Question 5: Crop Stage
  const [cropStage, setCropStage] = useState(activeField?.cropStage || 'फुलोरा व बोंडे भरणे (Flowering & Bolls)');
  const [isCustomCropStage, setIsCustomCropStage] = useState(activeField?.cropStageSource === 'custom');
  const [customCropStage, setCustomCropStage] = useState(activeField?.cropStageSource === 'custom' ? activeField?.cropStage || '' : '');

  // Question 6: Soil Type
  const [soilType, setSoilType] = useState(activeField?.soilType || 'काळी कसदार (Black Cotton)');
  const [isCustomSoilType, setIsCustomSoilType] = useState(activeField?.soilTypeSource === 'custom');
  const [customSoilType, setCustomSoilType] = useState(activeField?.soilTypeSource === 'custom' ? activeField?.soilType || '' : '');

  // Question 7: Soil Report
  const [soilHealthSummary, setSoilHealthSummary] = useState(activeField?.soilHealthSummary || 'सामू ७.८ (योग्य), सेंद्रिय कर्ब ०.४५%');
  const [soilReportPhoto, setSoilReportPhoto] = useState<string | null>(activeField?.soilReportPhotoUrl || null);
  const [isCustomSoilSummary, setIsCustomSoilSummary] = useState(activeField?.soilHealthSummarySource === 'custom');
  const [customSoilSummary, setCustomSoilSummary] = useState(activeField?.soilHealthSummarySource === 'custom' ? activeField?.soilHealthSummary || '' : '');

  // Question 8: Planned Fertilizer
  const [currentPlannedFertilizer, setCurrentPlannedFertilizer] = useState(activeField?.currentPlannedFertilizer || 'युरिया (Urea) ५० किलो + १०:२६:२६');
  const [isCustomPlannedFertilizer, setIsCustomPlannedFertilizer] = useState(activeField?.currentPlannedFertilizerSource === 'custom');
  const [customPlannedFertilizer, setCustomPlannedFertilizer] = useState(activeField?.currentPlannedFertilizerSource === 'custom' ? activeField?.currentPlannedFertilizer || '' : '');

  // Question 9: Previous Fertilizer
  const [previousFertilizerUsed, setPreviousFertilizerUsed] = useState(activeField?.previousFertilizerUsed || 'पेरणीवेळी डीएपी (DAP) ५० किलो');
  const [isCustomPreviousFertilizer, setIsCustomPreviousFertilizer] = useState(activeField?.previousFertilizerUsedSource === 'custom');
  const [customPreviousFertilizer, setCustomPreviousFertilizer] = useState(activeField?.previousFertilizerUsedSource === 'custom' ? activeField?.previousFertilizerUsed || '' : '');

  // Question 10: Irrigation
  const [irrigationType, setIrrigationType] = useState(activeField?.irrigationType || 'ठिबक सिंचन (Drip Irrigation)');
  const [isCustomIrrigation, setIsCustomIrrigation] = useState(activeField?.irrigationTypeSource === 'custom');
  const [customIrrigation, setCustomIrrigation] = useState(activeField?.irrigationTypeSource === 'custom' ? activeField?.irrigationType || '' : '');

  // Question 11: Crop Problem
  const [cropProblem, setCropProblem] = useState(activeField?.recentProblems?.[0] || 'पानांवर हलके पिवळे ठिपके (Yellow Spots)');
  const [isCustomCropProblem, setIsCustomCropProblem] = useState(activeField?.cropProblemSource === 'custom');
  const [customCropProblem, setCustomCropProblem] = useState(activeField?.cropProblemSource === 'custom' ? activeField?.recentProblems?.[0] || '' : '');

  // Question 12: Selected Language
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(initialLang || profile.language || 'mr');
  const [isCustomLanguage, setIsCustomLanguage] = useState(profile.languageSource === 'custom');
  const [customLanguage, setCustomLanguage] = useState(profile.languageSource === 'custom' ? profile.language || '' : '');

  // Voice Recording State
  const [isListening, setIsListening] = useState(false);
  const [listeningTarget, setListeningTarget] = useState<string | null>(null);

  // Auto GPS Location Handler
  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation API is not supported in this browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setLat(latitude);
        setLon(longitude);
        setLocationSuccess(true);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Location detection warning:', err);
        alert('स्थान आपोआप मिळवता आले नाही. कृपया खालील फॉर्ममध्ये जिल्हा व तालुका तपासा.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Voice Input Handler
  const handleTriggerVoice = (targetField: string, setter: (val: string) => void) => {
    setIsListening(true);
    setListeningTarget(targetField);
    startVoiceRecognition(
      selectedLanguage || 'mr',
      (text) => {
        setIsListening(false);
        setListeningTarget(null);
        if (text) {
          setter(text);
        }
      },
      (err) => {
        setIsListening(false);
        setListeningTarget(null);
        console.warn('Voice recognition error:', err);
      }
    );
  };

  // Photo Upload Handler for Soil Report
  const handleSoilPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSoilReportPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Finish Onboarding & Save All Answers with Sources
  const handleCompleteWizard = () => {
    const finalName = farmerName.trim() || 'शेतकरी मित्र';
    const finalNameSource: AnswerSource = 'custom';

    const finalDistrict = isCustomDistrict ? customDistrict.trim() || district : district;
    const finalDistrictSource: AnswerSource = isCustomDistrict ? 'custom' : 'recommended';

    const finalTaluka = isCustomTaluka ? customTaluka.trim() || taluka : taluka;
    const finalTalukaSource: AnswerSource = isCustomTaluka ? 'custom' : 'recommended';

    const finalVillage = isCustomVillage ? customVillage.trim() || village : village;
    const finalVillageSource: AnswerSource = isCustomVillage ? 'custom' : 'recommended';

    const finalCrop = isCustomCrop ? customCrop.trim() || crop : crop;
    const finalCropSource: AnswerSource = isCustomCrop ? 'custom' : 'recommended';

    const parsedAcreage = parseFloat(customAcreage);
    const finalAcreage = isCustomAcreage ? (!isNaN(parsedAcreage) ? parsedAcreage : acreage) : acreage;
    const finalAcreageSource: AnswerSource = isCustomAcreage ? 'custom' : 'recommended';

    const finalCropStage = isCustomCropStage ? customCropStage.trim() || cropStage : cropStage;
    const finalCropStageSource: AnswerSource = isCustomCropStage ? 'custom' : 'recommended';

    const finalSoilType = isCustomSoilType ? customSoilType.trim() || soilType : soilType;
    const finalSoilTypeSource: AnswerSource = isCustomSoilType ? 'custom' : 'recommended';

    const finalSoilSummary = isCustomSoilSummary ? customSoilSummary.trim() || soilHealthSummary : soilHealthSummary;
    const finalSoilSummarySource: AnswerSource = isCustomSoilSummary ? 'custom' : 'recommended';

    const finalPlannedFertilizer = isCustomPlannedFertilizer ? customPlannedFertilizer.trim() || currentPlannedFertilizer : currentPlannedFertilizer;
    const finalPlannedFertilizerSource: AnswerSource = isCustomPlannedFertilizer ? 'custom' : 'recommended';

    const finalPreviousFertilizer = isCustomPreviousFertilizer ? customPreviousFertilizer.trim() || previousFertilizerUsed : previousFertilizerUsed;
    const finalPreviousFertilizerSource: AnswerSource = isCustomPreviousFertilizer ? 'custom' : 'recommended';

    const finalIrrigation = isCustomIrrigation ? customIrrigation.trim() || irrigationType : irrigationType;
    const finalIrrigationSource: AnswerSource = isCustomIrrigation ? 'custom' : 'recommended';

    const finalCropProblem = isCustomCropProblem ? customCropProblem.trim() || cropProblem : cropProblem;
    const finalCropProblemSource: AnswerSource = isCustomCropProblem ? 'custom' : 'recommended';

    const finalLanguage = selectedLanguage;
    const finalLanguageSource: AnswerSource = isCustomLanguage ? 'custom' : 'recommended';

    const newFieldId = profile.fields[0]?.id || `field_${Date.now()}`;
    const newField: Field = {
      id: newFieldId,
      name: `${finalVillage} शेत (${finalCrop})`,
      crop: finalCrop,
      cropSource: finalCropSource,
      acreage: finalAcreage,
      acreageSource: finalAcreageSource,
      acreageUnit: acreageUnit,
      sowingDate: new Date().toISOString().split('T')[0],
      soilType: finalSoilType,
      soilTypeSource: finalSoilTypeSource,
      soilHealthSummary: finalSoilSummary,
      soilHealthSummarySource: finalSoilSummarySource,
      soilReportPhotoUrl: soilReportPhoto || '',
      cropStage: finalCropStage,
      cropStageSource: finalCropStageSource,
      currentPlannedFertilizer: finalPlannedFertilizer,
      currentPlannedFertilizerSource: finalPlannedFertilizerSource,
      previousFertilizerUsed: finalPreviousFertilizer,
      previousFertilizerUsedSource: finalPreviousFertilizerSource,
      irrigationType: finalIrrigation,
      irrigationTypeSource: finalIrrigationSource,
      fertilizerHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          productName: finalPlannedFertilizer,
          dosePerAcre: 'एकरी प्रमाणानुसार',
        },
      ],
      recentProblems: finalCropProblem ? [finalCropProblem] : [],
      cropProblemSource: finalCropProblemSource,
    };

    const updatedFields = profile.fields.length > 0
      ? [newField, ...profile.fields.filter((f) => f.id !== newFieldId)]
      : [newField];

    const updatedProfile: FarmerProfile = {
      ...profile,
      name: finalName,
      nameSource: finalNameSource,
      language: finalLanguage,
      languageSource: finalLanguageSource,
      preferredLanguage: finalLanguage,
      profileCompleted: true,
      location: {
        state: 'Maharashtra',
        stateSource: 'recommended',
        district: finalDistrict,
        districtSource: finalDistrictSource,
        taluka: finalTaluka,
        talukaSource: finalTalukaSource,
        village: finalVillage,
        villageSource: finalVillageSource,
        latitude: lat || 20.03,
        longitude: lon || 78.53,
      },
      activeFieldId: newFieldId,
      fields: updatedFields,
    };

    onComplete(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col my-auto max-h-[95vh]">
        {/* Wizard Header with Progress */}
        <div className="bg-emerald-900 text-white p-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-800 rounded-xl text-lg">🌾</span>
              <div>
                <h3 className="font-extrabold text-base leading-tight">
                  शेतकरी ऑनबोर्डिंग (Farmer Profile Setup)
                </h3>
                <p className="text-[11px] text-emerald-200">
                  माहिती भरा • AI सल्ला मिळवा
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-emerald-800 rounded-xl text-emerald-200 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Counter & Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-100">
              <span>प्रश्नावली प्रगती (Progress)</span>
              <span className="bg-emerald-800 px-2 py-0.5 rounded-full text-white font-mono text-xs">
                {currentStep} / {totalSteps}
              </span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-emerald-700/50">
              <div
                className="bg-gradient-to-r from-emerald-400 to-amber-300 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Wizard Body (One Question At A Time) */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* STEP 1: NAME */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न १ पैकी १२ (Question 1 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  १. तुमचे नाव काय आहे? (What is your Name?)
                </h4>
                <p className="text-xs text-stone-500">
                  तुमच्या नावाने सर्व कृषी अहवाल व दाखले तयार केले जातील.
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="उदा. रमेश पाटील / Ramesh Patil"
                    className="w-full p-3.5 pl-4 pr-12 bg-stone-50 border-2 border-stone-300 focus:border-emerald-600 rounded-2xl text-sm font-bold text-stone-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleTriggerVoice('farmerName', setFarmerName)}
                    className={`absolute right-2.5 top-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                      isListening && listeningTarget === 'farmerName'
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 flex items-center gap-1">
                  <span>💡</span>
                  <span>मायक्रोफोन दाबून मराठीत किंवा हिंदीत नाव बोला.</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: FARM LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न २ पैकी १२ (Question 2 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  २. शेताचे स्थान निवडा (Farm Location Selection)
                </h4>
                <p className="text-xs text-stone-500">
                  महाराष्ट्र राज्य, जिल्हा, तालुका व गाव निवडा किंवा नकाशावर जागा निश्चित करा.
                </p>
              </div>

              {/* Mode Selection Tabs (Hierarchy vs Google Maps) */}
              <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLocationMode('hierarchy')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    locationMode === 'hierarchy'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>पर्याय A: यादीतून निवडा</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationMode('map')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    locationMode === 'map'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Map className="w-3.5 h-3.5 text-amber-600" />
                  <span>पर्याय B: नकाशावर (Map)</span>
                </button>
              </div>

              {/* Auto GPS Detection Button */}
              <button
                type="button"
                onClick={handleAutoLocation}
                disabled={isLocating}
                className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all text-xs"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <Compass className="w-4 h-4 text-amber-300" />
                )}
                <span>
                  {isLocating
                    ? 'जीपीएस स्थान शोधत आहे...'
                    : '📍 मोबाईल GPS द्वारे स्थान आपोआप शोधा (Auto GPS)'}
                </span>
              </button>

              {locationSuccess && lat && lon && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">GPS स्थान प्राप्त झाले!</span>
                      <span className="text-[11px] text-stone-600">अक्षांश: {lat.toFixed(4)}, रेखांश: {lon.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* HIERARCHY SELECTOR WITH MANUAL ENTRY FOR ALL */}
              {locationMode === 'hierarchy' && (
                <div className="space-y-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs">
                  {/* State */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-bold text-stone-600">राज्य (State):</span>
                    <span className="font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      महाराष्ट्र (Maharashtra)
                    </span>
                  </div>

                  {/* District Selection */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-stone-800">१. जिल्हा निवडा (District):</label>
                      <span className="font-extrabold text-emerald-800">
                        {isCustomDistrict ? customDistrict || 'स्वतःचे' : district}
                      </span>
                    </div>

                    {!isCustomDistrict ? (
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={districtQuery}
                            onChange={(e) => {
                              setDistrictQuery(e.target.value);
                              setIsDistrictDropdownOpen(true);
                            }}
                            onFocus={() => setIsDistrictDropdownOpen(true)}
                            placeholder="शोधा: सातारा, पुणे, सांगली, कोल्हापूर..."
                            className="w-full p-2.5 pl-8 pr-3 bg-white border border-stone-300 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                          />
                          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                        </div>

                        {isDistrictDropdownOpen && (
                          <div className="max-h-36 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-md divide-y divide-stone-100 z-10 relative">
                            {filteredDistricts.length > 0 ? (
                              filteredDistricts.map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => {
                                    setDistrict(d.nameEn);
                                    setDistrictQuery('');
                                    setIsDistrictDropdownOpen(false);
                                    if (d.talukas.length > 0) {
                                      setTaluka(d.talukas[0].nameEn);
                                      if (d.talukas[0].villages.length > 0) {
                                        setVillage(d.talukas[0].villages[0].nameEn);
                                      }
                                    }
                                  }}
                                  className={`w-full text-left p-2 hover:bg-emerald-50 flex items-center justify-between font-bold cursor-pointer ${
                                    district.toLowerCase() === d.nameEn.toLowerCase() ? 'bg-emerald-100 text-emerald-900' : 'text-stone-800'
                                  }`}
                                >
                                  <span>{d.nameMr}</span>
                                  <span className="text-[10px] text-stone-400 font-normal">{d.nameEn}</span>
                                </button>
                              ))
                            ) : (
                              <div className="p-2 text-stone-500 text-center">जिल्हा सापडला नाही</div>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomDistrict(true);
                            if (!customDistrict) setCustomDistrict(district);
                          }}
                          className="w-full py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-amber-900 font-bold border border-stone-300 rounded-xl flex items-center justify-center gap-1 text-[11px] cursor-pointer mt-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>➕ Can't find district? Enter manually / इतर (स्वतः टाइप करा)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 bg-amber-50 p-2.5 rounded-xl border border-amber-300">
                        <div className="flex justify-between items-center text-amber-900 font-bold text-[11px]">
                          <span>जिल्ह्याचे नाव स्वतः प्रविष्ट करा:</span>
                          <button
                            type="button"
                            onClick={() => setIsCustomDistrict(false)}
                            className="text-emerald-800 underline cursor-pointer"
                          >
                            यादीतून निवडा
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={customDistrict}
                            onChange={(e) => setCustomDistrict(e.target.value)}
                            placeholder="तुमच्या जिल्ह्याचे नाव प्रविष्ट करा..."
                            className="w-full p-2.5 pl-3 pr-10 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleTriggerVoice('customDistrict', setCustomDistrict)}
                            className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg cursor-pointer ${
                              isListening && listeningTarget === 'customDistrict'
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Taluka Selection */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-stone-800">२. तालुका निवडा (Taluka):</label>
                      <span className="font-extrabold text-emerald-800">
                        {isCustomTaluka ? customTaluka || 'स्वतःचे' : taluka}
                      </span>
                    </div>

                    {!isCustomTaluka ? (
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={talukaQuery}
                            onChange={(e) => {
                              setTalukaQuery(e.target.value);
                              setIsTalukaDropdownOpen(true);
                            }}
                            onFocus={() => setIsTalukaDropdownOpen(true)}
                            placeholder={`शोधा: ${district} मधील तालुका...`}
                            className="w-full p-2.5 pl-8 pr-3 bg-white border border-stone-300 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                          />
                          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                        </div>

                        {isTalukaDropdownOpen && (
                          <div className="max-h-36 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-md divide-y divide-stone-100 z-10 relative">
                            {filteredTalukas.length > 0 ? (
                              filteredTalukas.map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    setTaluka(t.nameEn);
                                    setTalukaQuery('');
                                    setIsTalukaDropdownOpen(false);
                                    if (t.villages.length > 0) {
                                      setVillage(t.villages[0].nameEn);
                                    }
                                  }}
                                  className={`w-full text-left p-2 hover:bg-emerald-50 flex items-center justify-between font-bold cursor-pointer ${
                                    taluka.toLowerCase() === t.nameEn.toLowerCase() ? 'bg-emerald-100 text-emerald-900' : 'text-stone-800'
                                  }`}
                                >
                                  <span>{t.nameMr}</span>
                                  <span className="text-[10px] text-stone-400 font-normal">{t.nameEn}</span>
                                </button>
                              ))
                            ) : (
                              <div className="p-2 text-stone-500 text-center">तालुका सापडला नाही</div>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomTaluka(true);
                            if (!customTaluka) setCustomTaluka(taluka);
                          }}
                          className="w-full py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-amber-900 font-bold border border-stone-300 rounded-xl flex items-center justify-center gap-1 text-[11px] cursor-pointer mt-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>➕ Can't find taluka? Enter manually / इतर (स्वतः टाइप करा)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 bg-amber-50 p-2.5 rounded-xl border border-amber-300">
                        <div className="flex justify-between items-center text-amber-900 font-bold text-[11px]">
                          <span>तालुक्याचे नाव स्वतः प्रविष्ट करा:</span>
                          <button
                            type="button"
                            onClick={() => setIsCustomTaluka(false)}
                            className="text-emerald-800 underline cursor-pointer"
                          >
                            यादीतून निवडा
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={customTaluka}
                            onChange={(e) => setCustomTaluka(e.target.value)}
                            placeholder="तुमच्या तालुक्याचे नाव प्रविष्ट करा..."
                            className="w-full p-2.5 pl-3 pr-10 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleTriggerVoice('customTaluka', setCustomTaluka)}
                            className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg cursor-pointer ${
                              isListening && listeningTarget === 'customTaluka'
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Village Selection */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-stone-800">३. गाव निवडा (Village):</label>
                      <span className="font-extrabold text-emerald-800">
                        {isCustomVillage ? customVillage || 'स्वतःचे' : village}
                      </span>
                    </div>

                    {!isCustomVillage ? (
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={villageQuery}
                            onChange={(e) => {
                              setVillageQuery(e.target.value);
                              setIsVillageDropdownOpen(true);
                            }}
                            onFocus={() => setIsVillageDropdownOpen(true)}
                            placeholder={`शोधा: ${taluka} मधील गाव...`}
                            className="w-full p-2.5 pl-8 pr-3 bg-white border border-stone-300 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                          />
                          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                        </div>

                        {isVillageDropdownOpen && (
                          <div className="max-h-36 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-md divide-y divide-stone-100 z-10 relative">
                            {filteredVillages.length > 0 ? (
                              filteredVillages.map((v, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setVillage(v.nameMr || v.nameEn);
                                    setVillageQuery('');
                                    setIsVillageDropdownOpen(false);
                                  }}
                                  className={`w-full text-left p-2 hover:bg-emerald-50 flex items-center justify-between font-bold cursor-pointer ${
                                    village.toLowerCase() === v.nameEn.toLowerCase() || village === v.nameMr
                                      ? 'bg-emerald-100 text-emerald-900'
                                      : 'text-stone-800'
                                  }`}
                                >
                                  <span>{v.nameMr}</span>
                                  <span className="text-[10px] text-stone-400 font-normal">{v.nameEn}</span>
                                </button>
                              ))
                            ) : (
                              <div className="p-2 text-stone-500 text-center">गाव सापडले नाही</div>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomVillage(true);
                            if (!customVillage) setCustomVillage(village);
                          }}
                          className="w-full py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-amber-900 font-bold border border-stone-300 rounded-xl flex items-center justify-center gap-1 text-[11px] cursor-pointer mt-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>➕ Can't find village? Enter manually / इतर (स्वतः टाइप करा)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 bg-amber-50 p-2.5 rounded-xl border border-amber-300">
                        <div className="flex justify-between items-center text-amber-900 font-bold text-[11px]">
                          <span>गावाचे नाव स्वतः प्रविष्ट करा:</span>
                          <button
                            type="button"
                            onClick={() => setIsCustomVillage(false)}
                            className="text-emerald-800 underline cursor-pointer"
                          >
                            यादीतून निवडा
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={customVillage}
                            onChange={(e) => setCustomVillage(e.target.value)}
                            placeholder="तुमच्या गावाचे नाव प्रविष्ट करा..."
                            className="w-full p-2.5 pl-3 pr-10 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleTriggerVoice('customVillage', setCustomVillage)}
                            className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg cursor-pointer ${
                              isListening && listeningTarget === 'customVillage'
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MAP PIN MODE */}
              {locationMode === 'map' && (
                <div className="space-y-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-center">
                  <div className="p-4 bg-emerald-900/10 rounded-2xl border-2 border-emerald-600/30 space-y-3">
                    <Map className="w-10 h-10 text-emerald-800 mx-auto animate-bounce" />
                    <div>
                      <h5 className="font-extrabold text-stone-900 text-sm">गूगल मॅप स्थान पिन (Google Maps Pin)</h5>
                      <p className="text-stone-600 text-xs mt-1">
                        तुमच्या शेताचे अचूक अक्षांश व रेखांश निश्चित करा.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2 rounded-xl border border-stone-200">
                        <span className="block text-[10px] text-stone-500 font-bold">अक्षांश (Latitude)</span>
                        <input
                          type="number"
                          step="0.0001"
                          value={lat || 17.68}
                          onChange={(e) => setLat(parseFloat(e.target.value))}
                          className="w-full text-center font-bold text-stone-900 p-1 border border-stone-300 rounded-lg"
                        />
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-stone-200">
                        <span className="block text-[10px] text-stone-500 font-bold">रेखांश (Longitude)</span>
                        <input
                          type="number"
                          step="0.0001"
                          value={lon || 74.00}
                          onChange={(e) => setLon(parseFloat(e.target.value))}
                          className="w-full text-center font-bold text-stone-900 p-1 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: MAIN CROP */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ३ पैकी १२ (Question 3 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ३. तुमचे मुख्य पीक कोणते आहे? (Main Crop)
                </h4>
                <p className="text-xs text-stone-500">
                  निवडलेल्या पिकासाठी खताची मात्रा व रोग नियंत्रण सुचवले जाईल.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'कापूस (Cotton)',
                  'सोयाबीन (Soybean)',
                  'ऊस (Sugarcane)',
                  'गहू (Wheat)',
                  'कांदा (Onion)',
                  'तूर (Pigeonpea)',
                  'हरभरा (Gram)',
                  'भाजीपाला (Vegetables)',
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCrop(c);
                      setIsCustomCrop(false);
                    }}
                    className={`p-3 rounded-2xl border-2 font-bold text-left transition-all cursor-pointer ${
                      !isCustomCrop && crop === c
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{c}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomCrop(true)}
                  className={`col-span-2 p-3 rounded-2xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomCrop
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span>➕ Other / Enter your own (इतर / स्वतःचे प्रविष्ट करा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomCrop && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    तुमच्या पिकाचे नाव प्रविष्ट करा (Enter your crop name):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customCrop}
                      onChange={(e) => setCustomCrop(e.target.value)}
                      placeholder="उदा. ड्रॅगन फ्रूट, हळद, डाळिंब..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customCrop', setCustomCrop)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customCrop'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: LAND AREA */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ४ पैकी १२ (Question 4 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ४. शेताचे एकूण क्षेत्रफळ किती आहे? (Land Area & Unit)
                </h4>
                <p className="text-xs text-stone-500">
                  क्षेत्रफळ टाका जेणेकरून खतांचा खर्च व प्रमाण अचूक मोजता येईल.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {[1, 2.5, 4, 5, 8, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAcreage(val);
                      setIsCustomAcreage(false);
                    }}
                    className={`px-3 py-2 rounded-xl font-bold border-2 cursor-pointer transition-all ${
                      !isCustomAcreage && acreage === val
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-stone-300 bg-stone-100 hover:bg-emerald-50 text-stone-800'
                    }`}
                  >
                    {val} एकर
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomAcreage(true)}
                  className={`w-full p-3 rounded-2xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomAcreage
                      ? 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span>➕ Other / Enter custom land area (इतर / स्वतःचे क्षेत्रफळ टाका)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomAcreage && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    क्षेत्रफळ व एकक प्रविष्ट करा (Enter land area & unit):
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.1"
                        value={customAcreage}
                        onChange={(e) => setCustomAcreage(e.target.value)}
                        placeholder="उदा. 3.5"
                        className="w-full p-3 pl-3 pr-10 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleTriggerVoice('customAcreage', setCustomAcreage)}
                        className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg cursor-pointer ${
                          isListening && listeningTarget === 'customAcreage'
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <select
                      value={acreageUnit}
                      onChange={(e) => setAcreageUnit(e.target.value)}
                      className="p-3 bg-white border border-amber-400 rounded-xl font-bold text-xs text-stone-900"
                    >
                      <option value="एकर (Acres)">एकर (Acres)</option>
                      <option value="गुंठा (Guntha)">गुंठा (Guntha)</option>
                      <option value="हेक्टर (Hectares)">हेक्टर (Hectares)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CROP STAGE */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ५ पैकी १२ (Question 5 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ५. पिकाची सध्याची अवस्था कोणती आहे? (Crop Growth Stage)
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  'उगवण व कोवळी वाढ (Sowing & Germination)',
                  'शाकीय वाढ व फांद्या फुटणे (Vegetative Stage)',
                  'फुलोरा व कळ्या येणे (Flowering Stage)',
                  'शेंगा / बोंडे / दाणे भरणे (Boll / Pod Filling)',
                  'पक्वता व काढणी (Maturity & Harvest)',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setCropStage(s);
                      setIsCustomCropStage(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 font-bold text-left transition-all cursor-pointer ${
                      !isCustomCropStage && cropStage === s
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomCropStage(true)}
                  className={`w-full p-3.5 rounded-2xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomCropStage
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span>➕ Other / Enter your own (इतर / स्वतःची अवस्था प्रविष्ट करा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomCropStage && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    पिकाची अवस्था टाइप करा (Enter your crop stage):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customCropStage}
                      onChange={(e) => setCustomCropStage(e.target.value)}
                      placeholder="उदा. छाटणीनंतरची फुट, पुनर्लागवड..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customCropStage', setCustomCropStage)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customCropStage'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: SOIL TYPE */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ६ पैकी १२ (Question 6 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ६. जमिनीचा प्रकार कोणता आहे? (Soil Type)
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'काळी कसदार (Black Cotton)',
                  'मध्यम काळी (Medium Black)',
                  'तांबडी (Red Soil)',
                  'हलकी मुरमाड (Sandy/Gravel)',
                  'गाळाची जमीन (Alluvial)',
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setSoilType(st);
                      setIsCustomSoilType(false);
                    }}
                    className={`p-3 rounded-2xl border-2 font-bold text-left transition-all cursor-pointer ${
                      !isCustomSoilType && soilType === st
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomSoilType(true)}
                  className={`col-span-2 p-3 rounded-2xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomSoilType
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span>➕ Other / Enter your own (इतर / मातीचा प्रकार प्रविष्ट करा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomSoilType && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    जमिनीचा प्रकार टाइप करा (Enter your soil type):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customSoilType}
                      onChange={(e) => setCustomSoilType(e.target.value)}
                      placeholder="उदा. वालुकामय, पांढरी जमीन, चुनखडीयुक्त..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customSoilType', setCustomSoilType)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customSoilType'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: SOIL REPORT */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ७ पैकी १२ (Question 7 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ७. माती परीक्षण अहवाल (Soil Test Report)
                </h4>
                <p className="text-xs text-stone-500">
                  माती परीक्षणाचा फोटो किंवा अहवाल असल्यास येथे जोडा.
                </p>
              </div>

              {/* Upload Soil Report Photo */}
              <div className="p-4 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 text-center space-y-2">
                {soilReportPhoto ? (
                  <div className="space-y-2">
                    <img
                      src={soilReportPhoto}
                      alt="Soil Report"
                      className="max-h-36 mx-auto rounded-xl border border-stone-300"
                    />
                    <span className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> माती अहवाल जोडला गेला!
                    </span>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-1">
                    <Camera className="w-8 h-8 text-emerald-700 mx-auto" />
                    <span className="text-xs font-bold text-stone-800 block">
                      📷 अहवालाचा फोटो काढा किंवा अपलोड करा
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSoilPhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Quick Summary Recommendations & Custom */}
              <div className="space-y-2">
                <label className="font-bold text-stone-700 block text-xs">
                  माती आरोग्य विवरण (Soil Summary):
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {[
                    'सामू ७.८ (योग्य), सेंद्रिय कर्ब ०.४५%',
                    'सामू ८.२ (क्षारपड जमीन)',
                    'माती परीक्षण केलेले नाही',
                  ].map((sum) => (
                    <button
                      key={sum}
                      type="button"
                      onClick={() => {
                        setSoilHealthSummary(sum);
                        setIsCustomSoilSummary(false);
                      }}
                      className={`px-3 py-1.5 font-bold rounded-xl border-2 transition-all cursor-pointer ${
                        !isCustomSoilSummary && soilHealthSummary === sum
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                          : 'border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`}
                    >
                      {sum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsCustomSoilSummary(true)}
                    className={`w-full p-2.5 rounded-xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                      isCustomSoilSummary
                        ? 'border-amber-500 bg-amber-50 text-amber-950'
                        : 'border-amber-300 bg-amber-50/60 text-amber-900'
                    }`}
                  >
                    <span>➕ Other / Enter custom summary (इतर / स्वतः प्रविष्ट करा)</span>
                    <Edit3 className="w-4 h-4 text-amber-700" />
                  </button>
                </div>

                {isCustomSoilSummary && (
                  <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                    <label className="text-xs font-bold text-amber-950 block">
                      माती आरोग्य विवरण प्रविष्ट करा (Enter soil report details):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customSoilSummary}
                        onChange={(e) => setCustomSoilSummary(e.target.value)}
                        placeholder="उदा. नत्र कमी, स्फुरद मध्यम, पालाश भरपूर..."
                        className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleTriggerVoice('customSoilSummary', setCustomSoilSummary)}
                        className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                          isListening && listeningTarget === 'customSoilSummary'
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 8: PLANNED FERTILIZER */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ८ पैकी १२ (Question 8 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ८. सध्या देण्याचे नियोजित खत कोणते? (Planned Fertilizer)
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {['DAP (१८:४६:०)', 'युरिया (Urea)', '१०:२६:२६', '१९:१९:१९', 'सेंद्रिय खत'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setCurrentPlannedFertilizer(f);
                      setIsCustomPlannedFertilizer(false);
                    }}
                    className={`px-3 py-1.5 font-bold rounded-xl border-2 transition-all cursor-pointer ${
                      !isCustomPlannedFertilizer && currentPlannedFertilizer === f
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomPlannedFertilizer(true)}
                  className={`w-full p-2.5 rounded-xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomPlannedFertilizer
                      ? 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900'
                  }`}
                >
                  <span>➕ Other / Enter your own (इतर / तुमचे खत स्वतः प्रविष्ट करा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomPlannedFertilizer && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    नियोजित खताचे नाव टाका (Enter planned fertilizer):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customPlannedFertilizer}
                      onChange={(e) => setCustomPlannedFertilizer(e.target.value)}
                      placeholder="उदा. म्युरेट ऑफ पोटाश + एसएसपी..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customPlannedFertilizer', setCustomPlannedFertilizer)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customPlannedFertilizer'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 9: PREVIOUS FERTILIZER */}
          {currentStep === 9 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ९ पैकी १२ (Question 9 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ९. मागील हप्त्यात/हंगामात दिलेले खत कोणते? (Previous Fertilizer)
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {['पेरणीवेळी डीएपी ५० किलो', 'युरिया दुसरा हप्ता', '१०:२६:२६', 'सिंगल सुपर फॉस्फेट'].map((pf) => (
                  <button
                    key={pf}
                    type="button"
                    onClick={() => {
                      setPreviousFertilizerUsed(pf);
                      setIsCustomPreviousFertilizer(false);
                    }}
                    className={`px-3 py-1.5 font-bold rounded-xl border-2 transition-all cursor-pointer ${
                      !isCustomPreviousFertilizer && previousFertilizerUsed === pf
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    {pf}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomPreviousFertilizer(true)}
                  className={`w-full p-2.5 rounded-xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomPreviousFertilizer
                      ? 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900'
                  }`}
                >
                  <span>➕ Other / Enter your own (इतर / मागील खत स्वतः प्रविष्ट करा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomPreviousFertilizer && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    पूर्वी वापरलेले खत प्रविष्ट करा (Enter previous fertilizer):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customPreviousFertilizer}
                      onChange={(e) => setCustomPreviousFertilizer(e.target.value)}
                      placeholder="उदा. शेणखत ट्रॅक्टर ट्रॉली २, अमोनियम सल्फेट..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customPreviousFertilizer', setCustomPreviousFertilizer)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customPreviousFertilizer'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 10: IRRIGATION */}
          {currentStep === 10 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न १० पैकी १२ (Question 10 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  १०. सिंचनाची सोय कोणती आहे? (Irrigation Method)
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  'ठिबक सिंचन (Drip Irrigation)',
                  'तुषार सिंचन (Sprinkler)',
                  'पाटपाणी / विहीर (Flood/Well Water)',
                  'जिरायती / पावसाच्या पाण्यावर (Rainfed)',
                ].map((ir) => (
                  <button
                    key={ir}
                    type="button"
                    onClick={() => {
                      setIrrigationType(ir);
                      setIsCustomIrrigation(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 font-bold text-left transition-all cursor-pointer ${
                      !isCustomIrrigation && irrigationType === ir
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {ir}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomIrrigation(true)}
                  className={`w-full p-3.5 rounded-2xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomIrrigation
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span>➕ Other / Enter your own (इतर / सिंचन पद्धत स्वतः प्रविष्ट करा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomIrrigation && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    सिंचन पद्धत टाईप करा (Enter your irrigation method):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customIrrigation}
                      onChange={(e) => setCustomIrrigation(e.target.value)}
                      placeholder="उदा. कॅनॉल पाणी, रेन गन, शेततळे..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customIrrigation', setCustomIrrigation)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customIrrigation'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 11: CROP PROBLEM */}
          {currentStep === 11 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न ११ पैकी १२ (Question 11 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  ११. सध्या पिकावर कोणती समस्या किंवा कीड/रोग आहे? (Crop Problem)
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  'पानांवर पिवळे ठिपके',
                  'पाने वळणे / मावा',
                  'बोंड अळी प्रादुर्भाव',
                  'पिक निरोगी आहे (काहीही नाही)',
                ].map((prob) => (
                  <button
                    key={prob}
                    type="button"
                    onClick={() => {
                      setCropProblem(prob);
                      setIsCustomCropProblem(false);
                    }}
                    className={`px-3 py-1.5 font-bold rounded-xl border-2 transition-all cursor-pointer ${
                      !isCustomCropProblem && cropProblem === prob
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    {prob}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomCropProblem(true)}
                  className={`w-full p-2.5 rounded-xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomCropProblem
                      ? 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900'
                  }`}
                >
                  <span>➕ Other / Describe your problem (इतर / पीक समस्या स्वतः सांगा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomCropProblem && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    पीक समस्या वर्णन करा (Enter crop problem):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customCropProblem}
                      onChange={(e) => setCustomCropProblem(e.target.value)}
                      placeholder="उदा. मूळ कूज, खोड कीड, तांबेरा रोग..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customCropProblem', setCustomCropProblem)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customCropProblem'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 12: LANGUAGE */}
          {currentStep === 12 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  प्रश्न १२ पैकी १२ (Question 12 of 12)
                </span>
                <h4 className="text-lg font-extrabold text-stone-900">
                  १२. तुमची पसंतीची भाषा निवडा (Select Preferred Language)
                </h4>
                <p className="text-xs text-stone-500">
                  अ‍ॅपचा सर्व सल्ला व आवाज तुमच्या भाषेत ऐकू येईल.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { code: 'mr', name: 'मराठी (Marathi)', flag: '🚩' },
                  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
                  { code: 'en', name: 'English', flag: '🌐' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(l.code as Language);
                      setIsCustomLanguage(false);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                      !isCustomLanguage && selectedLanguage === l.code
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </span>
                    {!isCustomLanguage && selectedLanguage === l.code && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomLanguage(true)}
                  className={`w-full p-3.5 rounded-2xl border-2 font-extrabold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isCustomLanguage
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                      : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <span>➕ Other / Enter dialect (इतर / बोली किंवा भाषा टाइप करा)</span>
                  <Edit3 className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {isCustomLanguage && (
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-amber-950 block">
                    तुमची बोली किंवा भाषा प्रविष्ट करा (Enter dialect or language):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="उदा. अहिराणी, वऱ्हाडी, कोकणी..."
                      className="w-full p-3 pl-4 pr-12 bg-white border border-amber-400 rounded-xl font-bold text-stone-900 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleTriggerVoice('customLanguage', setCustomLanguage)}
                      className={`absolute right-2 top-2 p-2 rounded-lg cursor-pointer ${
                        isListening && listeningTarget === 'customLanguage'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons (Back & Next / Complete) */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="py-3 px-4 bg-white hover:bg-stone-200 text-stone-800 font-bold rounded-2xl text-xs border border-stone-300 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>मागे (Back)</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto"
            >
              <span>पुढील प्रश्न (Next)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteWizard}
              className="py-3 px-6 bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md ml-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>शेताची माहिती जतन करा व होमवर जा</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
