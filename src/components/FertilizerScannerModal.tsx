import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Edit2,
  Save,
  Volume2,
  Sparkles,
  PhoneCall,
  Calculator,
  Calendar,
  Sprout,
  ShieldAlert,
  Droplets,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  Language,
  FarmerProfile,
  FertilizerEvaluationResult,
  FertilizerAdvisorSchedule,
  Field,
} from '../types';
import { translations } from '../locales/translations';
import { SAMPLE_FERTILIZERS } from '../data/agronomyKnowledge';
import { SpeechService } from '../utils/speech';
import { compressImageFile } from '../utils/imageCompressor';

interface FertilizerScannerModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onSaveToDiary: (entry: { title: string; description: string; cost?: number }) => void;
  onOpenExpert: () => void;
  initialSampleId?: string;
}

export const FertilizerScannerModal: React.FC<FertilizerScannerModalProps> = ({
  language,
  profile,
  onClose,
  onSaveToDiary,
  onOpenExpert,
  initialSampleId,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  // Primary mode tabs: "advisor" (smart dose calculator) vs "ocr_scan" (bag photo check)
  const [activeTab, setActiveTab] = useState<'advisor' | 'ocr_scan'>(
    initialSampleId ? 'ocr_scan' : 'advisor'
  );

  // --- ADVISOR STATE ---
  const [cropName, setCropName] = useState(activeField?.crop || 'कापूस (Cotton)');
  const [cropVariety, setCropVariety] = useState(activeField?.variety || 'हायब्रीड बीजी-२');
  const [cropStage, setCropStage] = useState(activeField?.cropStage || 'शाकीय वाढ व फुलोरा अवस्था');
  const [acreage, setAcreage] = useState(activeField?.acreage?.toString() || '2.5');
  const [acreageUnit, setAcreageUnit] = useState(activeField?.acreageUnit || 'एकर (Acres)');
  const [soilType, setSoilType] = useState(activeField?.soilType || 'काळी कसदार (Black Cotton)');
  const [irrigationMethod, setIrrigationMethod] = useState(
    activeField?.irrigationType || 'ठिबक सिंचन (Drip)'
  );
  const [alreadyApplied, setAlreadyApplied] = useState(
    initialSampleId === 'calcium_nitrate'
      ? 'DAP 18:46:0 (५० किलो एकरी पेरणीवेळी दिले आहे)'
      : activeField?.fertilizerHistory?.map((f) => f.productName).join(', ') || 'डीएपी (DAP) पेरणीवेळी'
  );
  const [targetGoal, setTargetGoal] = useState('चांगली शाकीय वाढ, मुळांचा विकास आणि फळ-फूल गळ रोखणे');

  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<FertilizerAdvisorSchedule | null>(null);

  // --- OCR BAG SCAN STATE ---
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(() => {
    if (initialSampleId) {
      const found = SAMPLE_FERTILIZERS.find((f) => f.id === initialSampleId);
      return found ? found.dataUrl : null;
    }
    return null;
  });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [ocrProductName, setOcrProductName] = useState(
    initialSampleId === 'calcium_nitrate' ? 'Calcium Nitrate (कॅल्शियम नायट्रेट)' : ''
  );
  const [ocrNpk, setOcrNpk] = useState(initialSampleId === 'calcium_nitrate' ? '15.5:0:0 + 18.8% Ca' : '');
  const [isEditingManually, setIsEditingManually] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<FertilizerEvaluationResult | null>(null);
  const [savedToDiary, setSavedToDiary] = useState(false);

  // Independent inputs and refs for Gallery vs Camera
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // File selection with MIME and size validation
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, source: 'gallery' | 'camera') => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    setFileValidationError(null);

    // Validate MIME
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const isImageExtension = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!validMimes.includes(file.type.toLowerCase()) && !isImageExtension) {
      const err =
        language === 'mr'
          ? 'केवळ JPG, PNG किंवा WEBP छायाचित्रे समर्थित आहेत.'
          : language === 'hi'
          ? 'केवल JPG, PNG या WEBP फोटो समर्थित हैं।'
          : 'Only JPG, PNG or WEBP image formats are supported.';
      setFileValidationError(err);
      return;
    }

    // Validate size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const err =
        language === 'mr'
          ? 'छायाचित्राचा आकार १० MB पेक्षा कमी असावा.'
          : 'Image file size must be less than 10 MB.';
      setFileValidationError(err);
      return;
    }

    setIsReadingFile(true);
    compressImageFile(file, 1200, 0.82)
      .then((compressed) => {
        setPhotoDataUrl(compressed.dataUrl);
        setSelectedFileName(file.name);
        setSelectedFileSize(compressed.formattedSize);
        setEvaluation(null);
        setSavedToDiary(false);
        setIsReadingFile(false);
      })
      .catch((compErr) => {
        console.warn('Canvas compression fallback to standard reader:', compErr);
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoDataUrl(reader.result as string);
          setSelectedFileName(file.name);
          setSelectedFileSize(
            file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.round(file.size / 1024)} KB`
          );
          setEvaluation(null);
          setSavedToDiary(false);
          setIsReadingFile(false);
        };
        reader.onerror = () => {
          setIsReadingFile(false);
          setFileValidationError('Failed to read image. Please try again.');
        };
        reader.readAsDataURL(file);
      });
  };

  const handleSelectSample = (sample: (typeof SAMPLE_FERTILIZERS)[0]) => {
    setPhotoDataUrl(sample.dataUrl);
    setSelectedFileName(`${sample.productName}_sample.jpg`);
    setSelectedFileSize('Sample');
    setOcrProductName(sample.productName);
    setOcrNpk(sample.npk);
    setEvaluation(null);
    setSavedToDiary(false);
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    setSelectedFileName(null);
    setSelectedFileSize(null);
    setEvaluation(null);
  };

  // 1. GENERATE FERTILIZER SCHEDULE (ADVISOR)
  const generateFertilizerSchedule = async () => {
    setAdvisorLoading(true);
    try {
      const response = await fetch('/api/fertilizer/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          variety: cropVariety,
          cropStage,
          acreage: parseFloat(acreage) || 2.5,
          acreageUnit,
          soilType,
          soilHealthSummary: activeField?.soilHealthSummary,
          irrigationMethod,
          previousFertilizersApplied: alreadyApplied ? [alreadyApplied] : [],
          targetOutcome: targetGoal,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate schedule');
      }

      setScheduleResult(data.schedule);
      SpeechService.speak(data.schedule.nutrientDemandSummary, language);
    } catch (err: any) {
      console.warn('Fertilizer advisor request error:', err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // 2. EVALUATE FERTILIZER BAG (OCR & COMPATIBILITY CHECK)
  const evaluateFertilizer = async () => {
    setEvalLoading(true);

    try {
      const response = await fetch('/api/fertilizer/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoDataUrl || undefined,
          mimeType: photoDataUrl?.startsWith('data:image/png')
            ? 'image/png'
            : photoDataUrl?.startsWith('data:image/webp')
            ? 'image/webp'
            : 'image/jpeg',
          manualInput: {
            productName: ocrProductName || 'Calcium Nitrate',
            npk: ocrNpk || '15.5:0:0 + 18.8% Ca',
          },
          cropName,
          cropStage,
          acreage: parseFloat(acreage) || 2.5,
          soilType,
          previousFertilizersApplied: alreadyApplied ? [alreadyApplied] : [],
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setEvaluation(data.evaluation);
      SpeechService.speak(`${data.evaluation.badgeTitle}. ${data.evaluation.summaryExplanation}`, language);
    } catch (err) {
      console.warn('Fertilizer evaluation notice:', err);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleSaveToDiary = () => {
    if (evaluation) {
      onSaveToDiary({
        title: `खत तपासणी: ${evaluation.extractedProduct.productName}`,
        description: `सुरक्षा दर्जा: ${evaluation.safetyStatus} - ${evaluation.summaryExplanation}. मात्रा: ${evaluation.recommendedDosage.dosePerAcre}`,
      });
      setSavedToDiary(true);
    } else if (scheduleResult) {
      onSaveToDiary({
        title: `खत शिफारस: ${scheduleResult.cropName} (${scheduleResult.acreage} ${scheduleResult.acreageUnit})`,
        description: `${scheduleResult.nutrientDemandSummary}. खते: ${scheduleResult.recommendedProducts.map((p) => p.productName).join(', ')}`,
      });
      setSavedToDiary(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-amber-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-800 rounded-xl">
              <FlaskConical className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">खत सल्लागार व डोस कॅल्क्युलेटर</h3>
              <p className="text-xs text-amber-100">
                {activeField?.name} • {cropName} ({acreage} {acreageUnit})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              SpeechService.stop();
              onClose();
            }}
            className="p-2 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Tab Switcher */}
        <div className="bg-white border-b border-stone-200 px-4 pt-2.5 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('advisor')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'advisor'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-700" />
            <span>खत शिफारस व डोस गणक (Advisor)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ocr_scan')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ocr_scan'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-700" />
            <span>पाकीट स्कॅन व सुसंगतता (Scan Bag)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* ============================================================ */}
          {/* TAB 1: FERTILIZER ADVISOR & DOSE CALCULATOR                  */}
          {/* ============================================================ */}
          {activeTab === 'advisor' && (
            <div className="space-y-4">
              {/* Field Information Form */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-black">
                      🌾 शेत तपशील
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      पिकाची माहिती व क्षेत्रानुसार डोस
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">पीक (Crop):</label>
                    <input
                      type="text"
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-bold text-stone-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">वाण (Variety):</label>
                    <input
                      type="text"
                      value={cropVariety}
                      onChange={(e) => setCropVariety(e.target.value)}
                      placeholder="उदा. बीजी-२ / को ८६०३२"
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-semibold text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">
                      एकूण क्षेत्र (Total Cultivated Area):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0.1"
                        value={acreage}
                        onChange={(e) => setAcreage(e.target.value)}
                        className="w-24 p-2.5 border border-stone-300 rounded-xl font-extrabold text-amber-900"
                      />
                      <select
                        value={acreageUnit}
                        onChange={(e) => setAcreageUnit(e.target.value)}
                        className="flex-1 p-2.5 border border-stone-300 rounded-xl font-semibold bg-white"
                      >
                        <option value="एकर (Acres)">एकर (Acres)</option>
                        <option value="गुंठे (Guntha)">गुंठे (Guntha)</option>
                        <option value="हेक्टर (Hectares)">हेक्टर (Hectares)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">पिकाची अवस्था (Stage):</label>
                    <input
                      type="text"
                      value={cropStage}
                      onChange={(e) => setCropStage(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-semibold text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">सिंचन पद्धत (Irrigation):</label>
                    <select
                      value={irrigationMethod}
                      onChange={(e) => setIrrigationMethod(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-semibold bg-white"
                    >
                      <option value="ठिबक सिंचन (Drip)">ठिबक सिंचन (Drip)</option>
                      <option value="तुषार सिंचन (Sprinkler)">तुषार सिंचन (Sprinkler)</option>
                      <option value="पाटपाणी (Surface Flood)">पाटपाणी (Surface Flood)</option>
                      <option value="जिरायती (Rainfed)">जिरायती / पावसाचे पाणी (Rainfed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-bold">मातीचा प्रकार (Soil):</label>
                    <input
                      type="text"
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-semibold text-stone-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-stone-700 block mb-1 font-bold">
                      आधी कोणती खते दिलेली आहेत? (Previous Fertilizers):
                    </label>
                    <input
                      type="text"
                      value={alreadyApplied}
                      onChange={(e) => setAlreadyApplied(e.target.value)}
                      placeholder="उदा. पेरणीवेळी डीएपी ५० किलो, युरिया ३० किलो"
                      className="w-full p-2.5 border border-stone-300 rounded-xl font-medium text-stone-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateFertilizerSchedule}
                  disabled={advisorLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {advisorLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>खतांचा डोस व वेळापत्रक तयार करत आहे...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span>खत डोस व संपूर्ण वेळापत्रक मिळवा (Calculate Schedule)</span>
                    </>
                  )}
                </button>
              </div>

              {/* SCHEDULE RESULT DISPLAY */}
              {scheduleResult && (
                <div className="space-y-4 pt-1">
                  {/* Nutrient Demand Summary Banner */}
                  <div className="bg-gradient-to-br from-amber-700 to-amber-800 text-white p-4 rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-amber-200">
                        ⚡ पोषक तत्वांची मागणी (Nutrient Demand)
                      </span>
                      <button
                        onClick={() =>
                          SpeechService.speak(scheduleResult.nutrientDemandSummary, language)
                        }
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                        title={t.readAloud}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-amber-50">
                      {scheduleResult.nutrientDemandSummary}
                    </p>
                  </div>

                  {/* 1. RECOMMENDED FERTILIZER PRODUCTS & TOTAL ACREAGE DOSES */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <h4 className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <FlaskConical className="w-4 h-4 text-amber-700" />
                        <span>शिफारशीत खते व डोस (Recommended Fertilizer Products):</span>
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        एकूण क्षेत्र: {scheduleResult.acreage} {scheduleResult.acreageUnit}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {scheduleResult.recommendedProducts.map((prod, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-stone-50 hover:bg-amber-50/40 rounded-xl border border-stone-200 transition-colors space-y-1.5"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-extrabold text-stone-900 text-sm">
                                🧪 {prod.productName}
                              </div>
                              {prod.npk && (
                                <div className="text-[11px] font-semibold text-stone-500">
                                  NPK: {prod.npk}
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                              {prod.applicationMethod}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-200/60">
                            <div className="bg-white p-2 rounded-lg border border-stone-200">
                              <span className="text-stone-500 block text-[10px] font-bold uppercase">
                                १ एकरासाठी डोस:
                              </span>
                              <span className="font-bold text-stone-900">{prod.dosePerAcre}</span>
                            </div>

                            <div className="bg-amber-100/70 p-2 rounded-lg border border-amber-300">
                              <span className="text-amber-900 block text-[10px] font-black uppercase">
                                तुमच्या {scheduleResult.acreage} {scheduleResult.acreageUnit} साठी एकूण डोस:
                              </span>
                              <span className="font-black text-amber-950 text-xs">
                                {prod.totalFieldDose}
                              </span>
                            </div>
                          </div>

                          {prod.timing && (
                            <p className="text-[11px] text-stone-600 pt-0.5">
                              ⏰ <span className="font-bold">वेळ व सूचना:</span> {prod.timing}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. SPLIT SCHEDULE ACROSS CROP STAGES */}
                  {scheduleResult.splitSchedule && scheduleResult.splitSchedule.length > 0 && (
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <Calendar className="w-4 h-4 text-teal-700" />
                        <span>हप्ते पाडून खते देण्याचे वेळापत्रक (Split Application Schedule):</span>
                      </h4>

                      <div className="space-y-2">
                        {scheduleResult.splitSchedule.map((split, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-extrabold text-stone-900">
                              <span>📅 {split.stage}</span>
                              <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                                {split.timingDays}
                              </span>
                            </div>
                            <div className="font-bold text-emerald-800 text-xs">
                              खतांचे प्रमाण: {split.fertilizers}
                            </div>
                            <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-200">
                              <span>एकूण क्षेत्र डोस: <strong className="text-stone-900">{split.totalAreaDose}</strong></span>
                              <span className="text-stone-500 italic">{split.method}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. TANK MIX INCOMPATIBILITIES (WHAT NOT TO MIX) */}
                  {scheduleResult.tankMixIncompatibilities &&
                    scheduleResult.tankMixIncompatibilities.length > 0 && (
                      <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl space-y-2">
                        <div className="text-xs font-extrabold text-rose-950 flex items-center gap-1.5 uppercase tracking-wide">
                          <ShieldAlert className="w-4 h-4 text-rose-700" />
                          <span>सावधान: कोणती खते एकत्र मिसळू नयेत (Chemical Incompatibilities):</span>
                        </div>
                        <ul className="text-xs text-rose-900 space-y-1.5 pl-4 list-disc leading-relaxed font-medium">
                          {scheduleResult.tankMixIncompatibilities.map((incomp, iIdx) => (
                            <li key={iIdx}>{incomp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* 4. ORGANIC & LOW COST ALTERNATIVES */}
                  {scheduleResult.organicAlternatives &&
                    scheduleResult.organicAlternatives.length > 0 && (
                      <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-2">
                        <div className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                          <Sprout className="w-4 h-4 text-emerald-700" />
                          <span>सेंद्रिय व कमी खर्चाचे पर्याय (Organic & Low-Cost Alternatives):</span>
                        </div>
                        <ul className="text-xs text-emerald-900 space-y-1 pl-4 list-disc leading-relaxed">
                          {scheduleResult.organicAlternatives.map((org, oIdx) => (
                            <li key={oIdx}>{org}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* 5. PRECAUTIONS */}
                  {scheduleResult.immediatePrecautions &&
                    scheduleResult.immediatePrecautions.length > 0 && (
                      <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                        <span className="font-bold text-stone-900 block mb-0.5">
                          ⚠️ आवश्यक दक्षता (Immediate Precautions):
                        </span>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                          {scheduleResult.immediatePrecautions.map((prec, pIdx) => (
                            <li key={pIdx}>{prec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Save to Diary */}
                  <button
                    onClick={handleSaveToDiary}
                    disabled={savedToDiary}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                      savedToDiary
                        ? 'bg-amber-800 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{savedToDiary ? 'डायरीत नोंदवले गेले!' : 'हे वेळापत्रक शेती डायरीत जतन करा'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: OCR BAG SCAN & COMPATIBILITY SAFETY CHECK            */}
          {/* ============================================================ */}
          {activeTab === 'ocr_scan' && (
            <div className="space-y-4">
              {/* Photo Input Area */}
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 bg-white text-center">
                {isReadingFile ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-stone-700">खताचा फोटो उघडत आहे...</p>
                  </div>
                ) : photoDataUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden bg-stone-900 max-h-56 flex items-center justify-center">
                      <img
                        src={photoDataUrl}
                        alt="Fertilizer bag"
                        className="max-h-56 object-contain"
                      />
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 p-1.5 bg-stone-900/80 hover:bg-stone-900 text-white rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        title="काढून टाका"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>काढा</span>
                      </button>
                    </div>

                    {selectedFileName && (
                      <div className="flex items-center justify-between bg-stone-100 px-3 py-1.5 rounded-lg text-[11px] text-stone-600">
                        <span className="truncate font-semibold text-stone-800">📄 {selectedFileName}</span>
                        {selectedFileSize && <span className="shrink-0 font-bold text-stone-500 ml-2">{selectedFileSize}</span>}
                      </div>
                    )}

                    {/* Change options */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold border border-stone-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>पुन्हा फोटो काढा</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold border border-stone-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>गॅलरीतून बदला</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-3">
                    <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-amber-100">
                      🧴
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">खताच्या पाकिटाचा स्पष्ट फोटो घ्या</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        नाव, NPK प्रमाण व घटक स्पष्ट दिसू द्या
                      </p>
                    </div>

                    {fileValidationError && (
                      <div className="bg-rose-50 text-rose-800 border border-rose-300 p-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{fileValidationError}</span>
                      </div>
                    )}

                    {/* SEPARATE BUTTONS FOR CAMERA VS FILE/GALLERY */}
                    <div className="flex flex-col sm:flex-row justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>फोटो काढा (कॅमेरा)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-4 py-2.5 rounded-xl text-xs border border-stone-300 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                      >
                        <Upload className="w-4 h-4 text-amber-700" />
                        <span>गॅलरी / फाइल निवडा</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-400">
                      समर्थित: JPG, PNG, WEBP (कमाल १० MB)
                    </p>

                    {/* Camera Input (capture="environment") */}
                    <input
                      type="file"
                      ref={cameraInputRef}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileSelected(e, 'camera')}
                    />

                    {/* Native Gallery/File Picker (NO capture attribute!) */}
                    <input
                      type="file"
                      ref={galleryInputRef}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      onChange={(e) => handleFileSelected(e, 'gallery')}
                    />
                  </div>
                )}
              </div>

              {/* Sample Bags */}
              {!photoDataUrl && (
                <div>
                  <div className="text-xs font-bold text-stone-600 mb-1.5">
                    किंवा नमुना खतांचे पाकीट निवडून पहा:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SAMPLE_FERTILIZERS.map((fert) => (
                      <button
                        key={fert.id}
                        onClick={() => handleSelectSample(fert)}
                        className="p-2.5 rounded-xl border border-stone-200 bg-white hover:border-amber-500 text-left transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <div className="text-[11px] font-bold text-amber-800">{fert.productName}</div>
                        <div className="text-xs font-black text-stone-800 mt-0.5">{fert.npk}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* OCR & Context Form */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs font-bold text-stone-800">
                    खताचे नाव व शेत तपशील (Safety Context):
                  </span>
                  <button
                    onClick={() => setIsEditingManually(!isEditingManually)}
                    className="text-xs text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isEditingManually ? 'पूर्ण झाले' : 'दुरुस्त करा'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-stone-500 block mb-0.5 font-medium">खताचे नाव (Product):</label>
                    {isEditingManually ? (
                      <input
                        type="text"
                        value={ocrProductName}
                        onChange={(e) => setOcrProductName(e.target.value)}
                        placeholder="उदा. Calcium Nitrate / 10:26:26"
                        className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                      />
                    ) : (
                      <div className="font-bold text-stone-800">{ocrProductName || 'कॅल्शियम नायट्रेट'}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-stone-500 block mb-0.5 font-medium">NPK प्रमाण:</label>
                    {isEditingManually ? (
                      <input
                        type="text"
                        value={ocrNpk}
                        onChange={(e) => setOcrNpk(e.target.value)}
                        placeholder="उदा. 15.5:0:0"
                        className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                      />
                    ) : (
                      <div className="font-bold text-stone-800">{ocrNpk || '15.5:0:0 + 18.8% Ca'}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-stone-500 block mb-0.5 font-medium">पीक व क्षेत्र:</label>
                    <div className="font-bold text-emerald-800">
                      {cropName} ({acreage} {acreageUnit})
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-500 block mb-0.5 font-medium">पिकाची अवस्था (Stage):</label>
                    <div className="font-bold text-stone-800">{cropStage}</div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-stone-700 block mb-0.5 font-bold">
                      आधी कोणती खते दिलेली आहेत? (Previous Fertilizers):
                    </label>
                    {isEditingManually ? (
                      <input
                        type="text"
                        value={alreadyApplied}
                        onChange={(e) => setAlreadyApplied(e.target.value)}
                        placeholder="उदा. DAP, युरिया, १०:२६:२६"
                        className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                      />
                    ) : (
                      <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 font-medium text-stone-800">
                        {alreadyApplied || 'काहीही नोंदवलेले नाही'}
                      </div>
                    )}
                  </div>
                </div>

                {!evaluation && (
                  <button
                    onClick={evaluateFertilizer}
                    disabled={evalLoading}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {evalLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>खताची सुरक्षितता तपासत आहे...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <span>खताची सुरक्षितता तपासा (Safety Check)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* 3-TIER SAFETY OUTCOME BANNER */}
              {evaluation && (
                <div className="space-y-4 pt-1">
                  <div
                    className={`p-4 rounded-2xl border-2 shadow-sm ${
                      evaluation.safetyStatus === 'SAFE'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                        : evaluation.safetyStatus === 'NEED_MORE_INFO'
                        ? 'bg-amber-50 border-amber-500 text-amber-950'
                        : 'bg-rose-50 border-rose-500 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {evaluation.safetyStatus === 'SAFE' ? (
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                        ) : evaluation.safetyStatus === 'NEED_MORE_INFO' ? (
                          <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-7 h-7 text-rose-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm uppercase tracking-wide">
                            {evaluation.safetyStatus === 'SAFE'
                              ? 'SAFE / सुरक्षित (शिफारशीत खत)'
                              : evaluation.safetyStatus === 'NEED_MORE_INFO'
                              ? 'NEED MORE INFO / अधिक माहिती आवश्यक'
                              : 'DO NOT RECOMMEND / वापर करू नका (धोका)'}
                          </span>
                          <button
                            onClick={() =>
                              SpeechService.speak(
                                `${evaluation.badgeTitle}. ${evaluation.summaryExplanation}`,
                                language
                              )
                            }
                            className="p-1.5 rounded-lg bg-white text-stone-800 border border-current shadow-xs"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs font-bold mt-1 leading-snug">{evaluation.badgeTitle}</p>
                        <p className="text-xs mt-1 leading-relaxed opacity-95">
                          {evaluation.summaryExplanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Warning if Conflict Detected */}
                  {evaluation.compatibilityWarning && (
                    <div className="bg-rose-100 border-2 border-rose-400 p-3.5 rounded-2xl text-rose-900 text-xs">
                      <div className="font-bold flex items-center gap-1.5 text-sm mb-1">
                        <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                        <span>{t.compatibilityWarning}</span>
                      </div>
                      <p className="leading-relaxed font-semibold">
                        {evaluation.compatibilityWarning}
                      </p>
                      <p className="mt-1 text-[11px] opacity-80">
                        कारण: {evaluation.detailedAgronomicReason}
                      </p>
                    </div>
                  )}

                  {/* Recommended Dosage Card */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2.5">
                    <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                      {t.recommendedDoseLabel}
                    </h4>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-base font-extrabold text-emerald-800">
                        {evaluation.recommendedDosage.dosePerAcre}
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        {evaluation.recommendedDosage.instructions}
                      </p>
                    </div>
                  </div>

                  {/* Save or Escalate */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveToDiary}
                      disabled={savedToDiary}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                        savedToDiary
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      <span>{savedToDiary ? 'डायरीत जतन झाले!' : 'शेती डायरीत नोंदवा'}</span>
                    </button>

                    {evaluation.safetyStatus === 'DO_NOT_RECOMMEND' && (
                      <button
                        onClick={onOpenExpert}
                        className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>तज्ज्ञांचा सल्ला घ्या</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
