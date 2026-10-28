import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Volume2,
  Save,
  Sparkles,
  PhoneCall,
  AudioLines,
  Square,
  FileText,
  ListOrdered,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Droplets,
  FlaskConical,
  Sprout,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Language, CropAnalysisResult, FarmerProfile, Field } from '../types';
import { translations } from '../locales/translations';
import { SAMPLE_CROP_PHOTOS } from '../data/agronomyKnowledge';
import { createSpeechRecognizer, SpeechService } from '../utils/speech';
import { FieldSelectorModal } from './FieldSelectorModal';
import { compressImageFile } from '../utils/imageCompressor';

interface CropScannerModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onSaveToDiary: (entry: { title: string; description: string; photoUrl?: string }) => void;
  onOpenExpert: () => void;
  initialSampleId?: string;
  onUpdateField?: (field: Field) => void;
  onSelectField?: (fieldId: string) => void;
}

export const CropScannerModal: React.FC<CropScannerModalProps> = ({
  language,
  profile,
  onClose,
  onSaveToDiary,
  onOpenExpert,
  initialSampleId,
  onUpdateField,
  onSelectField,
}) => {
  const t = translations[language];
  const [activeFieldId, setActiveFieldId] = useState<string>(profile.activeFieldId || profile.fields[0]?.id || '');
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);

  const activeField = profile.fields.find((f) => f.id === activeFieldId) || profile.fields[0];

  // Mode: Photo scan vs Direct symptom description (text/voice)
  const [inputMode, setInputMode] = useState<'photo' | 'symptoms'>('photo');
  const [symptomsText, setSymptomsText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(() => {
    if (initialSampleId) {
      const found = SAMPLE_CROP_PHOTOS.find((s) => s.id === initialSampleId);
      return found ? found.dataUrl : null;
    }
    return null;
  });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [selectedPart, setSelectedPart] = useState<'leaf' | 'fruit' | 'stem' | 'plant' | 'soil'>('leaf');
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(1);
  const [analysisResult, setAnalysisResult] = useState<CropAnalysisResult | null>(null);
  const [diarySaved, setDiarySaved] = useState(false);

  // Independent inputs and refs for Gallery File Picker vs Device Camera
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Quick symptom chips
  const symptomSuggestions =
    language === 'mr'
      ? [
          'पाने पिवळी पडली आहेत',
          'पाने वाटीसारखी वर वळली आहेत (चुरमडा)',
          'पानांवर तपकिरी-काळे ठिपके दिसत आहेत',
          'शेंडे सुकत आहेत व कळ्या गळत आहेत',
          'खोड पोखरले असून झाड वाळत आहे',
          'पानाच्या खाली बारीक पांढरी माशी/किडे आहेत',
        ]
      : language === 'hi'
      ? [
          'पत्तियां पीली पड़ रही हैं',
          'पत्तियां ऊपर की ओर मुड़ रही हैं',
          'पत्तियों पर भूरे-काले धब्बे हैं',
          'ऊपरी शाखाएं सूख रही हैं और फूल गिर रहे हैं',
          'तना छेदक कीट के लक्षण हैं',
          'पत्ती के नीचे सफेद मक्खी या छोटे कीट हैं',
        ]
      : [
          'Leaves turning yellow',
          'Leaves curling upwards like a cup',
          'Brown and dark concentric leaf spots',
          'Terminal shoots wilting and flower drop',
          'Stem borer holes with dry frass',
          'Sucking pests/whiteflies on leaf undersides',
        ];

  // Robust file selection handler with MIME & size validation
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, source: 'gallery' | 'camera') => {
    const file = e.target.files?.[0];
    // Reset input value so re-selecting same file triggers event
    e.target.value = '';

    if (!file) return;

    setFileValidationError(null);

    // 1. Validate file type
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

    // 2. Validate file size (10 MB maximum)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const err =
        language === 'mr'
          ? 'छायाचित्राचा आकार १० MB पेक्षा कमी असावा.'
          : language === 'hi'
          ? 'फोटो का आकार 10 MB से कम होना चाहिए।'
          : 'Image file size must be less than 10 MB.';
      setFileValidationError(err);
      return;
    }

    // 3. Compress image on client (scales 10MB down to ~150KB in 40ms without losing agronomic detail)
    setIsReadingFile(true);
    compressImageFile(file, 1200, 0.82)
      .then((compressed) => {
        setPhotoDataUrl(compressed.dataUrl);
        setSelectedFileName(file.name);
        setSelectedFileSize(compressed.formattedSize);
        setAnalysisResult(null);
        setDiarySaved(false);
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
          setAnalysisResult(null);
          setDiarySaved(false);
          setIsReadingFile(false);
        };
        reader.onerror = () => {
          setIsReadingFile(false);
          setFileValidationError(
            language === 'mr'
              ? 'फोटो उघडण्यात अडचण आली. कृपया दुसरा फोटो निवडा.'
              : 'Failed to read image file. Please try another.'
          );
        };
        reader.readAsDataURL(file);
      });
  };

  const handleSelectSample = (sample: (typeof SAMPLE_CROP_PHOTOS)[0]) => {
    setPhotoDataUrl(sample.dataUrl);
    setSelectedFileName(`${sample.crop}_sample.jpg`);
    setSelectedFileSize('Sample');
    setFileValidationError(null);
    setAnalysisResult(null);
    setDiarySaved(false);
    setSelectedPart(sample.part as any);
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    setSelectedFileName(null);
    setSelectedFileSize(null);
    setFileValidationError(null);
    setAnalysisResult(null);
  };

  const startVoiceRecording = () => {
    const rec = createSpeechRecognizer(
      language,
      (result) => {
        const text = typeof result === 'string' ? result : result.transcript;
        if (text) {
          setSymptomsText(text);
        }
        if (result.isFinal) {
          setIsRecording(false);
        }
      },
      (err) => {
        console.warn('Voice rec error in CropScanner:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (rec) {
      try {
        rec.start();
        setIsRecording(true);
        setRecognizer(rec);
      } catch (e) {
        console.error('Failed to start voice rec:', e);
      }
    }
  };

  const stopVoiceRecording = () => {
    if (recognizer) {
      try {
        recognizer.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const runAnalysis = async () => {
    if (!photoDataUrl && !symptomsText.trim()) return;

    setLoading(true);
    setAnalysisStep(1);
    setFileValidationError(null);

    const stepTimer1 = setTimeout(() => setAnalysisStep(2), 650);
    const stepTimer2 = setTimeout(() => setAnalysisStep(3), 1500);

    try {
      const response = await fetch('/api/crop/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoDataUrl || undefined,
          mimeType: photoDataUrl?.startsWith('data:image/png')
            ? 'image/png'
            : photoDataUrl?.startsWith('data:image/webp')
            ? 'image/webp'
            : 'image/jpeg',
          symptomsText: symptomsText.trim() || undefined,
          userNotes: symptomsText.trim() || undefined,
          cropName: activeField?.crop || 'Cotton / कापूस',
          cropStage: activeField?.cropStage || 'Vegetative',
          partType: selectedPart,
          acreage: activeField?.acreage,
          soilType: activeField?.soilType,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.analysis) {
        throw new Error(data.error || 'Failed to analyze crop');
      }

      setAnalysisResult(data.analysis);

      // Rural voice assistance read-aloud: direct answer first!
      const speechSummary = data.analysis.directAnswer || `${data.analysis.issueNameLocal}. ${data.analysis.immediateAction}`;
      SpeechService.speak(speechSummary, language);
    } catch (err: any) {
      console.warn('Crop analysis request error:', err);
      const errMsg =
        language === 'mr'
          ? 'निदान करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा किंवा इंटरनेट तपासा.'
          : language === 'hi'
          ? 'निदान में त्रुटि हुई। कृपया पुन: प्रयास करें।'
          : 'Diagnosis error encountered. Please retry.';
      setFileValidationError(errMsg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  const handleSaveToDiary = () => {
    if (!analysisResult || !activeField) return;
    const directText = analysisResult.directAnswer || analysisResult.immediateAction;
    onSaveToDiary({
      title: `${activeField.crop} - ${analysisResult.issueNameLocal}`,
      description: `शेत: ${activeField.name}. थेट उपाय: ${directText}. लक्षणे: ${(analysisResult.symptomsObserved || []).join(', ')}`,
      photoUrl: photoDataUrl || '',
    });
    if (onUpdateField) {
      const updatedField: Field = {
        ...activeField,
        currentCropProblem: analysisResult.issueNameLocal,
        recentProblems: [analysisResult.issueNameLocal, ...(activeField.recentProblems || []).filter((p) => p !== analysisResult.issueNameLocal)],
        cropPhotoUrl: photoDataUrl || activeField.cropPhotoUrl,
        cropPhotos: photoDataUrl ? [photoDataUrl, ...(activeField.cropPhotos || [])] : activeField.cropPhotos,
        updatedAt: new Date().toISOString(),
      };
      onUpdateField(updatedField);
    }
    setDiarySaved(true);
  };

  const readDiagnosisAloud = () => {
    if (!analysisResult) return;
    const direct = analysisResult.directAnswer || analysisResult.immediateAction;
    const text = `${analysisResult.issueNameLocal}. ${direct}. पुढील उपाय: ${
      analysisResult.stepByStepSteps?.[0] || analysisResult.safeTreatmentOrganic?.[0] || ''
    }`;
    SpeechService.speak(text, language);
  };

  // Build numbered steps from result
  const actionSteps: string[] =
    analysisResult?.stepByStepSteps && analysisResult.stepByStepSteps.length > 0
      ? analysisResult.stepByStepSteps
      : analysisResult
      ? [
          analysisResult.immediateAction,
          ...(analysisResult.safeTreatmentOrganic || []).map((s) => `सेंद्रिय उपाय: ${s}`),
          ...(analysisResult.safeTreatmentChemical || []).map((s) => `रासायनिक उपचार: ${s}`),
        ].filter(Boolean)
      : [];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800 rounded-xl">
              <Camera className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">{t.cropScanTitle}</h3>
              <p className="text-xs text-emerald-100">
                {activeField?.name} • {activeField?.crop} ({activeField?.cropStage})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              SpeechService.stop();
              onClose();
            }}
            className="p-2 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Field Banner */}
        {activeField && (
          <div className="bg-emerald-50/90 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-emerald-800 font-bold">तपासणीसाठी शेत:</span>
              <span className="font-extrabold text-emerald-950 truncate">
                🌾 {activeField.name} — {activeField.crop}
                <span className="text-stone-500 font-normal ml-1">({activeField.cropStage} • {activeField.acreage} {activeField.acreageUnit || 'एकर'})</span>
              </span>
            </div>
            {profile.fields.length > 1 && (
              <button
                type="button"
                onClick={() => setIsFieldSelectorOpen(true)}
                className="shrink-0 ml-2 px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors shadow-xs cursor-pointer"
              >
                बदला
              </button>
            )}
          </div>
        )}

        {/* Mode Selector Tabs (Photo Scan vs Symptom Diagnosis) */}
        <div className="bg-white border-b border-stone-200 px-4 pt-2.5 flex gap-2">
          <button
            type="button"
            onClick={() => setInputMode('photo')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              inputMode === 'photo'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t.tabPhotoScan}</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('symptoms')}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              inputMode === 'symptoms'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabSymptomDescribe}</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Plant Part Selector */}
          <div>
            <label className="text-xs font-bold text-stone-700 mb-1.5 block">
              {t.selectPhotoType}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'leaf', label: t.partLeaf, icon: '🍃' },
                { id: 'fruit', label: t.partFruit, icon: '🍎' },
                { id: 'stem', label: t.partStem, icon: '🎋' },
                { id: 'plant', label: t.partPlant, icon: '🌿' },
                { id: 'soil', label: t.partSoil, icon: '🟤' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPart(p.id as any)}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                    selectedPart === p.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base mb-0.5">{p.icon}</div>
                  <div className="truncate text-[11px]">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* INPUT MODE: PHOTO SCAN */}
          {inputMode === 'photo' && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 bg-white text-center">
                {isReadingFile ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-stone-700">छायाचित्र लोड होत आहे...</p>
                  </div>
                ) : photoDataUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden bg-stone-900 max-h-64 flex items-center justify-center">
                      <img
                        src={photoDataUrl}
                        alt="Captured crop"
                        className="max-h-64 object-contain"
                      />
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 p-1.5 bg-stone-900/80 hover:bg-stone-900 text-white rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-md"
                        title="काढून टाका"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>काढा</span>
                      </button>
                    </div>

                    {/* File Meta Info Badge */}
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

                    {!analysisResult && (
                      <button
                        onClick={runAnalysis}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t.analyzingCrop}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 text-amber-300" />
                            <span>{t.diagnoseButton}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-4 space-y-3">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-emerald-100">
                      📸
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">{t.cropScanTitle}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        पानाचा किंवा पिकाचा जवळून स्पष्ट फोटो काढा किंवा गॅलरीतून निवडा
                      </p>
                    </div>

                    {fileValidationError && (
                      <div className="bg-rose-50 text-rose-800 border border-rose-300 p-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{fileValidationError}</span>
                      </div>
                    )}

                    {/* Independent Buttons for Camera vs Gallery Picker */}
                    <div className="flex flex-col sm:flex-row justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{t.takePhoto} (कॅमेरा)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-4 py-2.5 rounded-xl text-xs border border-stone-300 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                      >
                        <Upload className="w-4 h-4 text-emerald-700" />
                        <span>{t.chooseGallery} (फाइल / गॅलरी)</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-400">
                      समर्थित फॉरमॅट: JPG, PNG, WEBP (कमाल १० MB)
                    </p>

                    {/* SEPARATE HTML INPUT FOR CAMERA ONLY (with capture="environment") */}
                    <input
                      type="file"
                      ref={cameraInputRef}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileSelected(e, 'camera')}
                    />

                    {/* SEPARATE HTML INPUT FOR NATIVE FILE/GALLERY PICKER (NO capture attribute!) */}
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

              {/* Sample Photos for Quick Demonstration */}
              {!photoDataUrl && (
                <div>
                  <div className="text-xs font-bold text-stone-600 mb-1.5 flex items-center gap-1">
                    <span>{t.useSamplePhoto}:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SAMPLE_CROP_PHOTOS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className="p-2.5 rounded-xl border border-stone-200 bg-white hover:border-emerald-500 text-left transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                          <span className="truncate">{sample.crop}</span>
                          <span className="text-[10px] bg-stone-100 px-1 rounded">{sample.badge}</span>
                        </div>
                        <p className="text-xs font-semibold text-stone-800 mt-1 line-clamp-1">
                          {sample.title[language] || sample.title.mr}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INPUT MODE: SYMPTOM DIAGNOSIS (ZERO PHOTO REQUIRED) */}
          {inputMode === 'symptoms' && (
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>पिकावरील लक्षणे वर्णन करा (फोटो नसला तरी चालेल):</span>
                </label>
                <button
                  type="button"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <AudioLines className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'थांबवा' : t.speakSymptomsButton}</span>
                </button>
              </div>

              <textarea
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                placeholder={t.describeSymptomsPlaceholder}
                rows={3}
                className="w-full p-3 border border-stone-300 rounded-xl text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {/* Quick Suggestion Chips */}
              <div>
                <div className="text-[11px] font-bold text-stone-500 mb-1.5">
                  सामान्य लक्षणे (टॅप करून जोडा):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {symptomSuggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() =>
                        setSymptomsText((prev) => (prev ? `${prev}, ${suggestion}` : suggestion))
                      }
                      className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={runAnalysis}
                disabled={loading || !symptomsText.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.analyzingCrop}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>{t.diagnoseButton}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Active progressive analysis loading state */}
          {loading && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-extrabold text-xs text-emerald-900">
                    {language === 'mr'
                      ? 'AI कृषी तज्ज्ञ विश्लेषण करत आहे...'
                      : language === 'hi'
                      ? 'AI कृषि विशेषज्ञ विश्लेषण कर रहे हैं...'
                      : 'AI Agronomist Analyzing...'}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                  {analysisStep}/3
                </span>
              </div>
              <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(analysisStep / 3) * 100}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <span>⚡</span>
                <span>
                  {analysisStep === 1 && (
                    language === 'mr'
                      ? '१/३: छायाचित्र व लक्षणांची बारकाईने तपासणी सुरू आहे...'
                      : language === 'hi'
                      ? '१/३: फोटो और लक्षणों का गहन विश्लेषण जारी है...'
                      : '1/3: Analyzing crop photo & symptom patterns...'
                  )}
                  {analysisStep === 2 && (
                    language === 'mr'
                      ? '२/३: Gemini Flash AI द्वारे अचूक कीड/रोग निदान शोधत आहे...'
                      : language === 'hi'
                      ? '२/३: Gemini Flash AI द्वारा सटीक कीट/रोग पहचान की जा रही है...'
                      : '2/3: Identifying precise pest or nutrient deficiency with Gemini AI...'
                  )}
                  {analysisStep === 3 && (
                    language === 'mr'
                      ? '३/३: एकरी रासायनिक व सेंद्रिय डोस, फवारणी मात्रा तयार होत आहे...'
                      : language === 'hi'
                      ? '३/३: प्रति एकड़ रासायनिक व जैविक खुराक और प्रबंधन योजना तैयार हो रही है...'
                      : '3/3: Finalizing per-acre dosages and crop recovery plan...'
                  )}
                </span>
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* DETAILED 11-SECTION AGRONOMIC ANALYSIS RESULTS DISPLAY         */}
          {/* ============================================================== */}
          {analysisResult && (
            <div className="space-y-4 pt-1">
              {/* 1. DIRECT ASSESSMENT & ANSWER BANNER (AT VERY TOP) */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">⚡</span>
                    <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-100">
                      {t.directAnswerLabel}
                    </span>
                  </div>
                  <button
                    onClick={readDiagnosisAloud}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-transform active:scale-95"
                    title={t.readAloud}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-extrabold leading-relaxed text-emerald-50">
                  {analysisResult.directAnswer || analysisResult.directAssessment ||
                    `${analysisResult.issueNameLocal} — ${analysisResult.immediateAction}`}
                </h4>
              </div>

              {/* DETAILED PARAGRAPHS ANALYSIS SECTION */}
              {analysisResult.detailedAnalysisParagraphs && (
                <div className="bg-white p-4.5 rounded-2xl border border-emerald-200 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center justify-center">
                      📖
                    </div>
                    <h4 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider">
                      सविस्तर कृषी माहिती व सखोल विश्लेषण (Detailed Agronomic Analysis)
                    </h4>
                  </div>
                  <div className="text-xs text-stone-800 leading-relaxed space-y-3 pt-1 font-medium whitespace-pre-line">
                    {analysisResult.detailedAnalysisParagraphs}
                  </div>
                </div>
              )}

              {/* Confidence Meter Banner */}
              <div
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 shadow-xs ${
                  analysisResult.confidenceLevel === 'HIGH'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : analysisResult.confidenceLevel === 'MODERATE'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {analysisResult.confidenceLevel === 'HIGH' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : analysisResult.confidenceLevel === 'MODERATE' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs uppercase tracking-wide">
                        {analysisResult.confidenceLevel === 'HIGH'
                          ? t.highConfidence
                          : analysisResult.confidenceLevel === 'MODERATE'
                          ? t.moderateConfidence
                          : t.lowConfidence}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-white/80 border border-current">
                        {analysisResult.confidenceScore}% निश्चितता
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed opacity-90 font-medium">
                      {analysisResult.confidenceReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. IDENTIFIED ISSUE HEADER */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="border-b border-stone-100 pb-2.5 flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                      ओळखलेली समस्या (Problem Identified)
                    </div>
                    <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                      {analysisResult.issueNameLocal}
                    </h4>
                    <div className="text-xs text-stone-500 italic mt-0.5">
                      {analysisResult.issueNameScientific} • वर्गवारी: {analysisResult.category}
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {analysisResult.identifiedCrop}
                  </span>
                </div>

                {/* Direct Assessment */}
                {analysisResult.directAssessment && (
                  <div className="text-xs text-stone-700 leading-relaxed font-medium bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <span className="font-bold text-stone-900">थेट मूल्यांकन: </span>
                    {analysisResult.directAssessment}
                  </div>
                )}

                {/* 3. PHOTO ANALYSIS INSIGHTS (WHAT CAN & CANNOT BE CONCLUDED) */}
                {(analysisResult.whatCanBeConcluded || analysisResult.whatCannotBeConcluded) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {analysisResult.whatCanBeConcluded && (
                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-950">
                        <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-800 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>फोटोवरून काय खात्री पटते:</span>
                        </div>
                        <p className="leading-relaxed">{analysisResult.whatCanBeConcluded}</p>
                      </div>
                    )}
                    {analysisResult.whatCannotBeConcluded && (
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-950">
                        <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-800 mb-1">
                          <Info className="w-3.5 h-3.5 text-amber-600" />
                          <span>केवळ फोटोवरून काय सांगता येत नाही:</span>
                        </div>
                        <p className="leading-relaxed">{analysisResult.whatCannotBeConcluded}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. POSSIBLE CAUSES (RANKED BY LIKELIHOOD) */}
                {analysisResult.possibleCauses && analysisResult.possibleCauses.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="text-xs font-extrabold text-stone-800">
                      संभाव्य कारणे (Causes Ranked by Likelihood):
                    </div>
                    <div className="space-y-1.5">
                      {analysisResult.possibleCauses.map((item, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="font-bold text-stone-900">{item.cause}</div>
                            {item.explanation && (
                              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">{item.explanation}</p>
                            )}
                          </div>
                          <span
                            className={`shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              item.likelihood === 'HIGH'
                                ? 'bg-rose-100 text-rose-800'
                                : item.likelihood === 'MEDIUM'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {item.likelihood === 'HIGH' ? 'जास्त शक्यता' : item.likelihood === 'MEDIUM' ? 'मध्यम शक्यता' : 'कमी शक्यता'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. VISIBLE SYMPTOMS OBSERVED */}
                {analysisResult.symptomsObserved && analysisResult.symptomsObserved.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <div className="text-xs font-bold text-stone-800 mb-1">
                      {t.symptomsLabel}
                    </div>
                    <ul className="list-disc pl-4 text-xs text-stone-600 space-y-1 leading-relaxed">
                      {analysisResult.symptomsObserved.map((sym, idx) => (
                        <li key={idx}>{sym}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 6. ADDITIONAL INFO NEEDED */}
                {analysisResult.additionalInfoNeeded && analysisResult.additionalInfoNeeded.length > 0 && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700">
                    <div className="font-bold flex items-center gap-1.5 text-stone-900 mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
                      <span>निदानाची १००% खात्री करण्यासाठी पुढील माहिती तपासा:</span>
                    </div>
                    <ul className="list-disc pl-4 text-[11px] space-y-0.5">
                      {analysisResult.additionalInfoNeeded.map((info, idx) => (
                        <li key={idx}>{info}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 7. NUMBERED STEP-BY-STEP ACTION PLAN */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-emerald-700" />
                  <span>{t.stepByStepActionPlanLabel}</span>
                </div>

                <div className="space-y-2">
                  {actionSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 hover:bg-emerald-50/50 rounded-xl border border-stone-200 flex items-start gap-2.5 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-stone-800 font-medium leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. FERTILIZER & NUTRIENT RECOMMENDATIONS (PER ACRE & TOTAL AREA) */}
              {analysisResult.fertilizerNutrientRecommendations && (
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                  <div className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-amber-600" />
                    <span>खते व अन्नद्रव्य शिफारस (Fertilizer & Nutrient Dosage):</span>
                  </div>

                  {analysisResult.fertilizerNutrientRecommendations.demandSummary && (
                    <p className="text-xs text-stone-700 leading-relaxed font-medium bg-amber-50/50 p-2.5 rounded-xl border border-amber-200">
                      {analysisResult.fertilizerNutrientRecommendations.demandSummary}
                    </p>
                  )}

                  {analysisResult.fertilizerNutrientRecommendations.products &&
                    analysisResult.fertilizerNutrientRecommendations.products.length > 0 && (
                      <div className="space-y-2">
                        {analysisResult.fertilizerNutrientRecommendations.products.map((prod, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-stone-900">
                              <span>🧪 {prod.productName}</span>
                              {prod.npk && (
                                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                                  {prod.npk}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-stone-600 pt-1">
                              <div>
                                <span className="font-semibold text-stone-700">एकरी मात्रा: </span>
                                <span className="font-bold text-emerald-800">{prod.dosePerAcre}</span>
                              </div>
                              {prod.totalFieldDose && (
                                <div>
                                  <span className="font-semibold text-stone-700">एकूण शेतासाठी: </span>
                                  <span className="font-bold text-emerald-900">{prod.totalFieldDose}</span>
                                </div>
                              )}
                            </div>
                            {prod.timing && (
                              <div className="text-[11px] text-stone-500 pt-0.5">
                                ⏰ वेळ व पद्धत: {prod.timing} ({prod.applicationMethod})
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {/* 9. PEST & DISEASE MANAGEMENT (IPM & FORMULATIONS) */}
              {analysisResult.pestDiseaseManagement && (
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                  <div className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>एकात्मिक कीड व रोग व्यवस्थापन (IPM & Spray Formulations):</span>
                  </div>

                  {analysisResult.pestDiseaseManagement.chemicalFormulations &&
                    analysisResult.pestDiseaseManagement.chemicalFormulations.length > 0 && (
                      <div className="space-y-2">
                        {analysisResult.pestDiseaseManagement.chemicalFormulations.map((chem, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-bold text-stone-900">{chem.name}</div>
                              <div className="text-emerald-800 font-semibold mt-0.5">
                                प्रमाण: {chem.dosage}
                              </div>
                            </div>
                            {chem.waitingPeriod && (
                              <span className="shrink-0 text-[10px] bg-stone-200 text-stone-800 px-2 py-1 rounded-lg font-bold">
                                प्रतीक्षा: {chem.waitingPeriod}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {/* 10. ORGANIC ALTERNATIVES */}
              {analysisResult.organicAlternatives && analysisResult.organicAlternatives.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl space-y-1.5">
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    <span>सेंद्रिय व कमी खर्चाचे पर्याय (Organic & Low-Cost Alternatives):</span>
                  </div>
                  <ul className="text-xs text-emerald-900 space-y-1 pl-4 list-disc leading-relaxed">
                    {analysisResult.organicAlternatives.map((org, oIdx) => (
                      <li key={oIdx}>{org}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 11. IRRIGATION, SOIL & WEATHER */}
              {analysisResult.irrigationAndSoilConsiderations && (
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <Droplets className="w-4 h-4 text-blue-700" />
                    <span>पाणी व्यवस्थापन, जमीन व हवामान सल्ला:</span>
                  </div>
                  <p className="leading-relaxed font-medium">{analysisResult.irrigationAndSoilConsiderations}</p>
                </div>
              )}

              {/* 12. SAFETY PRECAUTIONS & COMPATIBILITY WARNINGS (WHAT NOT TO MIX) */}
              {analysisResult.safetyAndMixingWarnings && analysisResult.safetyAndMixingWarnings.length > 0 && (
                <div className="bg-rose-50 border border-rose-300 p-3.5 rounded-2xl space-y-1.5">
                  <div className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    <span>सुरक्षा खबरदारी व काय एकत्र मिसळू नये (Compatibility Warnings):</span>
                  </div>
                  <ul className="text-xs text-rose-900 space-y-1 pl-4 list-disc leading-relaxed font-medium">
                    {analysisResult.safetyAndMixingWarnings.map((warn, wIdx) => (
                      <li key={wIdx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 13. IMMEDIATE FIRST-AID & DAMAGE MITIGATION (IF ANY) */}
              {analysisResult.immediateFirstAid && (
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span>{t.immediateFirstAidLabel}</span>
                  </div>
                  <p className="text-xs font-semibold text-amber-950 mt-1 leading-relaxed">
                    {analysisResult.immediateFirstAid}
                  </p>
                </div>
              )}

              {/* Follow-up monitoring */}
              {analysisResult.followUpMonitoring && (
                <div className="bg-stone-100 p-3 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <span className="font-bold text-stone-900">पुढील देखरेख (Follow-up): </span>
                  {analysisResult.followUpMonitoring}
                </div>
              )}

              {/* 14. SECONDARY CROP SCAN RECOMMENDATION (ONLY IF AMBIGUOUS OR WITHOUT PHOTO) */}
              {(analysisResult.recommendedScanReason || (!photoDataUrl && analysisResult.confidenceLevel !== 'HIGH')) && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-700" />
                      <span>पिकाचा फोटो काढून अधिक अचूक खात्री करा</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {analysisResult.recommendedScanReason || t.recommendedScanNotice}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode('photo');
                      cameraInputRef.current?.click();
                    }}
                    className="shrink-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>फोटो जोडा</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* 15. EXPERT ESCALATION / KISAN CALL CENTER */}
              {analysisResult.expertEscalationRecommended && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-rose-700" />
                    <span>गंभीर लक्षणे: कृषी तज्ज्ञांचा किंवा सरकारी हेल्पलाइनचा सल्ला घ्या</span>
                  </div>
                  <p className="text-[11px] text-rose-800">
                    {t.kisanCallCenterNotice}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <a
                      href="tel:18001801551"
                      className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>किसान कॉल सेंटर (1800-180-1551)</span>
                    </a>
                    <button
                      onClick={onOpenExpert}
                      className="px-3 py-2.5 bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      स्थानिक तज्ज्ञ
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons: Save to Diary & Reset */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSaveToDiary}
                  disabled={diarySaved}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    diarySaved
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{diarySaved ? t.savedToDiarySuccess : t.saveToDiary}</span>
                </button>

                <button
                  onClick={() => {
                    setAnalysisResult(null);
                    setDiarySaved(false);
                    setSymptomsText('');
                    setPhotoDataUrl(null);
                    setSelectedFileName(null);
                    setSelectedFileSize(null);
                  }}
                  className="py-3 px-3.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  title="नवीन तपासणी करा"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>नवीन</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isFieldSelectorOpen && (
        <FieldSelectorModal
          language={language}
          fields={profile.fields}
          activeFieldId={activeFieldId}
          onSelectField={(id) => {
            setActiveFieldId(id);
            if (onSelectField) onSelectField(id);
            setIsFieldSelectorOpen(false);
          }}
          onClose={() => setIsFieldSelectorOpen(false)}
        />
      )}
    </div>
  );
};
