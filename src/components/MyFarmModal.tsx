import React, { useState } from 'react';
import {
  X,
  Sprout,
  Plus,
  Calendar,
  MapPin,
  Check,
  Edit3,
  Trash2,
  ChevronLeft,
  Camera,
  FlaskConical,
  Bug,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { Language, FarmerProfile, Field, FertilizerApplication } from '../types';
import { translations } from '../locales/translations';
import { FieldFormModal } from './FieldFormModal';

interface MyFarmModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onUpdateProfile: (updated: FarmerProfile) => void;
  onEditProfile?: () => void;
  initialSelectedFieldId?: string;
  onOpenCropScanner?: () => void;
  onOpenFertilizerScanner?: () => void;
  onOpenSoilReport?: () => void;
}

const COMMON_CROPS = [
  'ऊस (Sugarcane)',
  'सोयाबीन (Soybean)',
  'कांदा (Onion)',
  'कापूस (Cotton)',
  'गहू (Wheat)',
  'तूर (Pigeonpea)',
  'मका (Maize)',
  'हरभरा (Gram)',
  'डाळिंब (Pomegranate)',
  'टोमॅटो (Tomato)',
];

const CROP_STAGES = [
  'उगवण / पेरणी (Sowing & Germination)',
  'शाकीय वाढ (Vegetative Growth)',
  'फुलोरा अवस्था (Flowering Stage)',
  'फळधारणा / बोंडे भरणे (Fruiting / Pod Formation)',
  'पक्वता व काढणी (Maturity & Harvest)',
];

export const MyFarmModal: React.FC<MyFarmModalProps> = ({
  language,
  profile,
  onClose,
  onUpdateProfile,
  onEditProfile,
  initialSelectedFieldId,
  onOpenCropScanner,
  onOpenFertilizerScanner,
  onOpenSoilReport,
}) => {
  const t = translations[language];

  // Currently opened field (shows ONLY that field's info)
  const [openedFieldId, setOpenedFieldId] = useState<string | null>(
    initialSelectedFieldId || null
  );

  // Field Form Modal (for Add or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<Field | null>(null);

  // Sub-action Modals
  const [showCropChangeModal, setShowCropChangeModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showAddFertilizerModal, setShowAddFertilizerModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showSoilReportModal, setShowSoilReportModal] = useState(false);

  // Quick Action form states
  const [tempCrop, setTempCrop] = useState('');
  const [tempStage, setTempStage] = useState('');
  const [fertDate, setFertDate] = useState(new Date().toISOString().split('T')[0]);
  const [fertProduct, setFertProduct] = useState('');
  const [fertQuantity, setFertQuantity] = useState('');
  const [fertCost, setFertCost] = useState('');
  const [soilText, setSoilText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const openedField = profile.fields.find((f) => f.id === openedFieldId) || null;

  const getCropEmoji = (cropName: string = '') => {
    const lower = cropName.toLowerCase();
    if (lower.includes('ऊस') || lower.includes('sugar')) return '🎋';
    if (lower.includes('कांदा') || lower.includes('onion')) return '🧅';
    if (lower.includes('सोयाबीन') || lower.includes('soy')) return '🌱';
    if (lower.includes('गहू') || lower.includes('wheat')) return '🌾';
    if (lower.includes('कापूस') || lower.includes('cotton')) return '☁️';
    if (lower.includes('तूर') || lower.includes('pigeon')) return '🌿';
    if (lower.includes('मका') || lower.includes('maize')) return '🌽';
    if (lower.includes('टोमॅटो') || lower.includes('tomato')) return '🍅';
    if (lower.includes('डाळिंब') || lower.includes('pom')) return '🍎';
    return '🌱';
  };

  const handleSelectActiveField = (fieldId: string) => {
    onUpdateProfile({
      ...profile,
      activeFieldId: fieldId,
    });
  };

  const handleSaveField = (savedField: Field) => {
    const existingIndex = profile.fields.findIndex((f) => f.id === savedField.id);
    let updatedFields: Field[];

    if (existingIndex >= 0) {
      updatedFields = [...profile.fields];
      updatedFields[existingIndex] = savedField;
    } else {
      updatedFields = [...profile.fields, savedField];
    }

    onUpdateProfile({
      ...profile,
      fields: updatedFields,
      activeFieldId: profile.activeFieldId || savedField.id,
    });

    setOpenedFieldId(savedField.id);
  };

  const handleDeleteField = (fieldId: string) => {
    if (profile.fields.length <= 1) {
      alert('कमीत कमी एक शेत असणे आवश्यक आहे. हे शेत हटवता येणार नाही.');
      return;
    }

    const fieldToDelete = profile.fields.find((f) => f.id === fieldId);
    const confirmDelete = window.confirm(
      `तुम्हाला खात्री आहे का? "${fieldToDelete?.name || 'हे शेत'}" हटवले जाईल.`
    );
    if (!confirmDelete) return;

    const remainingFields = profile.fields.filter((f) => f.id !== fieldId);
    const newActiveId =
      profile.activeFieldId === fieldId ? remainingFields[0].id : profile.activeFieldId;

    onUpdateProfile({
      ...profile,
      fields: remainingFields,
      activeFieldId: newActiveId,
    });

    setOpenedFieldId(null);
  };

  // Quick action: Change crop
  const handleChangeCrop = () => {
    if (!openedField || !tempCrop.trim()) return;
    const updated: Field = {
      ...openedField,
      crop: tempCrop.trim(),
      updatedAt: new Date().toISOString(),
    };
    handleSaveField(updated);
    setShowCropChangeModal(false);
  };

  // Quick action: Update crop stage
  const handleUpdateStage = () => {
    if (!openedField || !tempStage.trim()) return;
    const updated: Field = {
      ...openedField,
      cropStage: tempStage.trim(),
      updatedAt: new Date().toISOString(),
    };
    handleSaveField(updated);
    setShowStageModal(false);
  };

  // Quick action: Add fertilizer
  const handleAddFertilizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openedField || !fertProduct.trim()) return;

    const newApp: FertilizerApplication = {
      id: `fert_${Date.now()}`,
      date: fertDate || new Date().toISOString().split('T')[0],
      productName: fertProduct.trim(),
      quantityBags: fertQuantity ? parseFloat(fertQuantity) : undefined,
      totalCost: fertCost ? parseFloat(fertCost) : undefined,
      stage: openedField.cropStage,
    };

    const updated: Field = {
      ...openedField,
      fertilizerHistory: [newApp, ...(openedField.fertilizerHistory || [])],
      currentPlannedFertilizer: fertProduct.trim(),
      updatedAt: new Date().toISOString(),
    };

    handleSaveField(updated);
    setFertProduct('');
    setFertQuantity('');
    setFertCost('');
    setShowAddFertilizerModal(false);
  };

  // Quick action: Add crop photo
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openedField || !photoUrl) return;

    const updated: Field = {
      ...openedField,
      cropPhotoUrl: photoUrl,
      cropPhotos: [photoUrl, ...(openedField.cropPhotos || [])],
      updatedAt: new Date().toISOString(),
    };

    handleSaveField(updated);
    setPhotoUrl('');
    setShowAddPhotoModal(false);
  };

  // Quick action: Update soil report
  const handleUpdateSoil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openedField || !soilText.trim()) return;

    const updated: Field = {
      ...openedField,
      soilHealthSummary: soilText.trim(),
      updatedAt: new Date().toISOString(),
    };

    handleSaveField(updated);
    setSoilText('');
    setShowSoilReportModal(false);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalAcreage = profile.fields.reduce((acc, f) => acc + (f.acreage || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/85 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {openedField ? (
              <button
                type="button"
                onClick={() => setOpenedFieldId(null)}
                className="p-1.5 bg-emerald-900 hover:bg-emerald-700 rounded-xl text-emerald-100 flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>सर्व शेते</span>
              </button>
            ) : (
              <div className="p-2 bg-emerald-900 rounded-xl">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base leading-snug">
                {openedField ? openedField.name : 'माझी शेते (My Fields)'}
              </h3>
              <p className="text-xs text-emerald-200">
                {openedField
                  ? `${openedField.crop} • ${openedField.acreage} ${openedField.acreageUnit || 'एकर'}`
                  : `एकूण ${profile.fields.length} शेते • ${totalAcreage} एकर क्षेत्र`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!openedField && (
              <button
                type="button"
                onClick={() => {
                  setFieldToEdit(null);
                  setIsFormOpen(true);
                }}
                className="bg-lime-500 hover:bg-lime-400 text-stone-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>नवीन शेत</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-emerald-700 rounded-xl text-emerald-100 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-stone-800">
          {/* ================= VIEW 1: SINGLE FIELD VIEW (When farmer opened a field) ================= */}
          {openedField ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Field Identity & Active Status Card */}
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-600/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0 border border-emerald-200">
                    {getCropEmoji(openedField.crop)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-stone-900">{openedField.name}</h4>
                      {openedField.id === profile.activeFieldId ? (
                        <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          ✓ सक्रिय शेत (Active)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectActiveField(openedField.id)}
                          className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                        >
                          सक्रिय करा (Make Active)
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 font-bold mt-0.5">
                      <span className="text-emerald-800">{openedField.crop}</span>
                      {openedField.variety ? ` (वाण: ${openedField.variety})` : ''} •{' '}
                      {openedField.acreage} {openedField.acreageUnit || 'एकर'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFieldToEdit(openedField);
                      setIsFormOpen(true);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer border border-stone-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>संपादित करा (Edit)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteField(openedField.id)}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer border border-rose-200"
                    title="शेत हटवा"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Quick-Buttons for THIS field */}
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                  या शेतासाठी जलद कृती (Actions for this field):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempCrop(openedField.crop);
                      setShowCropChangeModal(true);
                    }}
                    className="p-2.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer transition-all shadow-2xs"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">पीक बदला</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTempStage(openedField.cropStage);
                      setShowStageModal(true);
                    }}
                    className="p-2.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer transition-all shadow-2xs"
                  >
                    <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">अवस्था बदला</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddFertilizerModal(true)}
                    className="p-2.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer transition-all shadow-2xs"
                  >
                    <FlaskConical className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">+ खत नोंदवा</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddPhotoModal(true)}
                    className="p-2.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer transition-all shadow-2xs"
                  >
                    <Camera className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="truncate">+ फोटो जोडा</span>
                  </button>
                </div>
              </div>

              {/* ONLY THIS FIELD'S INFORMATION (Parameters Grid) */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs text-xs">
                <h5 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>या शेताची सविस्तर माहिती (Field Details)</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-medium block">पेरणी / लागवड तारीख:</span>
                    <span className="font-bold text-stone-900 text-xs">
                      {openedField.sowingDate || 'नोंद नाही'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-medium block">वाढीची अवस्था (Crop Stage):</span>
                    <span className="font-bold text-stone-900 text-xs">{openedField.cropStage}</span>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-medium block">जमिनीचा प्रकार (Soil Type):</span>
                    <span className="font-bold text-stone-900 text-xs">{openedField.soilType}</span>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 font-medium block">सिंचन पद्धत (Irrigation):</span>
                    <span className="font-bold text-stone-900 text-xs">
                      {openedField.irrigationType || 'पाटपाणी'}
                    </span>
                  </div>
                </div>

                {/* Fertilizers Status */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-950 block">खतांची स्थिती:</span>
                  <p className="text-stone-700">
                    <span className="font-semibold text-stone-900">नियोजित: </span>
                    {openedField.currentPlannedFertilizer || 'काही नाही'}
                  </p>
                  <p className="text-stone-700">
                    <span className="font-semibold text-stone-900">मागील दिलेले: </span>
                    {openedField.previousFertilizerUsed || 'काही नाही'}
                  </p>
                </div>

                {/* Soil Report Status */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-emerald-950 block">माती परीक्षण अहवाल:</span>
                    <p className="text-stone-700 mt-0.5">
                      {openedField.soilHealthSummary || 'अहवाल जोडलेला नाही.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSoilReportModal(true)}
                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] shrink-0 cursor-pointer"
                  >
                    अहवाल बदला
                  </button>
                </div>

                {/* Current Crop Problem (if any) */}
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950 flex items-center gap-1">
                      <Bug className="w-3.5 h-3.5 text-rose-600" />
                      <span>चालू कीड / रोग समस्या:</span>
                    </span>
                    {onOpenCropScanner && (
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectActiveField(openedField.id);
                          onClose();
                          onOpenCropScanner();
                        }}
                        className="text-[10px] font-extrabold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-0.5 rounded cursor-pointer"
                      >
                        कॅमेऱ्याने स्कॅन करा →
                      </button>
                    )}
                  </div>
                  <p className="text-stone-800 font-medium">
                    {openedField.currentCropProblem || openedField.recentProblems?.[0] || 'कोणतीही समस्या नोंदवलेली नाही (पीक निरोगी आहे)'}
                  </p>
                </div>

                {/* Field Location */}
                {openedField.location && (
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                    <span className="text-stone-700">
                      स्थान: {openedField.location.village}, {openedField.location.taluka} ({openedField.location.district})
                    </span>
                  </div>
                )}

                {/* Notes */}
                {openedField.notes && (
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-700 block mb-0.5">नोंदी (Notes):</span>
                    <p className="text-stone-600">{openedField.notes}</p>
                  </div>
                )}
              </div>

              {/* Photos Gallery for THIS Field */}
              {openedField.cropPhotos && openedField.cropPhotos.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2.5 shadow-2xs">
                  <h5 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-purple-600" />
                    <span>या शेतातील पिकाचे फोटो ({openedField.cropPhotos.length}):</span>
                  </h5>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {openedField.cropPhotos.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Field photo ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-xl border border-stone-200 shadow-2xs"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Fertilizer History for THIS Field */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>या शेतातील खतांचा इतिहास (Fertilizer History):</span>
                  </h5>
                  <button
                    type="button"
                    onClick={() => setShowAddFertilizerModal(true)}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded-lg cursor-pointer"
                  >
                    + खत जोडा
                  </button>
                </div>

                {openedField.fertilizerHistory && openedField.fertilizerHistory.length > 0 ? (
                  <div className="space-y-2">
                    {openedField.fertilizerHistory.map((fert, idx) => (
                      <div
                        key={fert.id || idx}
                        className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-stone-900 block">{fert.productName}</span>
                          <span className="text-[11px] text-stone-500">
                            तारीख: {fert.date} {fert.quantityBags ? `• ${fert.quantityBags} बॅग` : ''}
                          </span>
                        </div>
                        {fert.totalCost ? (
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                            ₹{fert.totalCost}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic py-2">
                    अद्याप कोणत्याही खताची नोंद नाही. वर &quot;+ खत नोंदवा&quot; बटनावर क्लिक करा.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: ALL FIELDS LIST (My Fields) ================= */
            <div className="space-y-4 animate-fadeIn">
              {/* Farmer Summary Banner */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-11 bg-lime-100 text-lime-800 font-bold rounded-2xl flex items-center justify-center text-xl shrink-0 border border-lime-200">
                    👨‍🌾
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-stone-900 text-sm truncate">{profile.name}</h4>
                    <p className="text-xs text-stone-500 truncate font-medium">
                      {profile.location.village}, {profile.location.taluka} ({profile.location.district})
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-xl">
                    एकूण {totalAcreage} एकर ({profile.fields.length} शेते)
                  </span>
                  {onEditProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditProfile();
                      }}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>माहिती बदला</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Explanation note */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  प्रत्येक शेतावर वेगळे पीक (उदा. ऊस, सोयाबीन, कांदा), खते व माती असते. शेतावर टॅप करून
                  त्याची माहिती पहा किंवा संपादन करा.
                </p>
              </div>

              {/* Fields List Header */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="text-xs font-black uppercase text-stone-700 tracking-wider flex items-center gap-1.5">
                  <span>तुमची शेते (My Fields):</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setFieldToEdit(null);
                    setIsFormOpen(true);
                  }}
                  className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ शेत जोडा (Add Field)</span>
                </button>
              </div>

              {/* The Fields List Cards */}
              <div className="space-y-3">
                {profile.fields.map((field, index) => {
                  const isActive = field.id === profile.activeFieldId;
                  const emoji = getCropEmoji(field.crop);

                  return (
                    <div
                      key={field.id}
                      className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                        isActive
                          ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/10'
                          : 'bg-white border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          onClick={() => setOpenedFieldId(field.id)}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <span className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center text-xl shrink-0 border border-stone-200">
                            {emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-black text-stone-900 text-sm truncate">
                                {field.name || `Field ${index + 1}`}
                              </h5>
                              {isActive && (
                                <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full shrink-0">
                                  ✓ सक्रिय शेत
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-700 font-bold mt-0.5 truncate">
                              <span className="text-emerald-900">{field.crop}</span> • {field.acreage}{' '}
                              {field.acreageUnit || 'एकर'}
                              {field.cropStage ? ` • ${field.cropStage.split('/')[0]}` : ''}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              माती: {field.soilType?.split('(')[0] || 'काळी'} • पेरणी:{' '}
                              {field.sowingDate}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setOpenedFieldId(field.id)}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                          >
                            <span>माहिती पहा</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => handleSelectActiveField(field.id)}
                              className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-lg cursor-pointer"
                            >
                              सक्रिय करा
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bottom row summary badges */}
                      <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-2">
                        <div className="truncate max-w-[260px]">
                          <span className="font-semibold text-stone-800">खते: </span>
                          {field.fertilizerHistory && field.fertilizerHistory.length > 0
                            ? field.fertilizerHistory.map((f) => f.productName).join(', ')
                            : field.currentPlannedFertilizer || 'काही नाही'}
                        </div>
                        {field.currentCropProblem || field.recentProblems?.[0] ? (
                          <span className="text-[10px] text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                            ⚠️ {field.currentCropProblem || field.recentProblems?.[0]}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                            पीक निरोगी
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Big Add Field button */}
              <button
                type="button"
                onClick={() => {
                  setFieldToEdit(null);
                  setIsFormOpen(true);
                }}
                className="w-full py-3.5 bg-lime-100 hover:bg-lime-200 border-2 border-dashed border-lime-500 text-lime-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-lime-800 stroke-[3]" />
                <span>+ आणखी नवीन शेत जोडा (Add Unlimited Fields)</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
          {openedField ? (
            <button
              type="button"
              onClick={() => setOpenedFieldId(null)}
              className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>सर्व शेतांची यादी</span>
            </button>
          ) : (
            <span className="text-xs text-stone-500 font-medium">
              सक्रिय शेत:{' '}
              <strong className="text-stone-900">
                {profile.fields.find((f) => f.id === profile.activeFieldId)?.name || 'Field 1'}
              </strong>
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
          >
            पूर्ण झाले (Done)
          </button>
        </div>
      </div>

      {/* ================= MODAL: Add / Edit Full Field ================= */}
      {isFormOpen && (
        <FieldFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setFieldToEdit(null);
          }}
          onSave={handleSaveField}
          initialField={fieldToEdit}
          defaultLocation={profile.location}
          fieldNumberSuggestion={profile.fields.length + 1}
        />
      )}

      {/* ================= MODAL: Quick Change Crop ================= */}
      {showCropChangeModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-4 shadow-2xl border border-stone-200 space-y-3">
            <h4 className="font-extrabold text-sm text-stone-900">पीक बदला (Change Crop)</h4>
            <p className="text-xs text-stone-500">या शेतातील पीक निवडा किंवा लिहा:</p>
            <select
              value={tempCrop}
              onChange={(e) => setTempCrop(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border-2 border-stone-300 rounded-xl text-xs font-bold"
            >
              {COMMON_CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={tempCrop}
              onChange={(e) => setTempCrop(e.target.value)}
              placeholder="किंवा स्वतः पिकाचे नाव टाका"
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCropChangeModal(false)}
                className="flex-1 py-2 bg-stone-200 text-stone-800 font-bold rounded-xl text-xs"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={handleChangeCrop}
                className="flex-1 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                बदल करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Quick Update Stage ================= */}
      {showStageModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-4 shadow-2xl border border-stone-200 space-y-3">
            <h4 className="font-extrabold text-sm text-stone-900">
              वाढीची अवस्था बदला (Update Crop Stage)
            </h4>
            <div className="space-y-1.5">
              {CROP_STAGES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTempStage(st)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    tempStage === st
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-950'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowStageModal(false)}
                className="flex-1 py-2 bg-stone-200 text-stone-800 font-bold rounded-xl text-xs"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={handleUpdateStage}
                className="flex-1 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                जतन करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Quick Add Fertilizer ================= */}
      {showAddFertilizerModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <form
            onSubmit={handleAddFertilizer}
            className="bg-white w-full max-w-sm rounded-3xl p-4 shadow-2xl border border-stone-200 space-y-3 text-xs"
          >
            <h4 className="font-extrabold text-sm text-stone-900">
              या शेतात खत नोंदवा (Add Fertilizer)
            </h4>
            <div>
              <label className="text-stone-600 font-medium block mb-1">दिलेले खत (Product Name):</label>
              <input
                type="text"
                required
                value={fertProduct}
                onChange={(e) => setFertProduct(e.target.value)}
                placeholder="उदा. युरिया (Urea) / १०:२६:२६ / डीएपी"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-600 font-medium block mb-1">प्रमाण (Bags/Qty):</label>
                <input
                  type="number"
                  step="0.5"
                  value={fertQuantity}
                  onChange={(e) => setFertQuantity(e.target.value)}
                  placeholder="उदा. 2"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-stone-600 font-medium block mb-1">एकूण खर्च ₹ (Cost):</label>
                <input
                  type="number"
                  value={fertCost}
                  onChange={(e) => setFertCost(e.target.value)}
                  placeholder="उदा. 1200"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-stone-600 font-medium block mb-1">तारीख (Date):</label>
              <input
                type="date"
                value={fertDate}
                onChange={(e) => setFertDate(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddFertilizerModal(false)}
                className="flex-1 py-2 bg-stone-200 text-stone-800 font-bold rounded-xl text-xs"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-700 text-white font-bold rounded-xl text-xs"
              >
                नोंदवा
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: Quick Add Photo ================= */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <form
            onSubmit={handleAddPhoto}
            className="bg-white w-full max-w-sm rounded-3xl p-4 shadow-2xl border border-stone-200 space-y-3 text-xs"
          >
            <h4 className="font-extrabold text-sm text-stone-900">
              पिकाचा फोटो जोडा (Add Crop Photo)
            </h4>
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-3 text-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Crop preview"
                  className="w-full h-36 object-contain rounded-lg"
                />
              ) : (
                <label className="cursor-pointer block py-4 text-stone-600 font-bold">
                  <Upload className="w-8 h-8 mx-auto text-stone-400 mb-1" />
                  <span>फोटो निवडा किंवा कॅमेऱ्याने काढा</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setPhotoUrl)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl('');
                  setShowAddPhotoModal(false);
                }}
                className="flex-1 py-2 bg-stone-200 text-stone-800 font-bold rounded-xl text-xs"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                disabled={!photoUrl}
                className="flex-1 py-2 bg-purple-700 disabled:bg-stone-300 text-white font-bold rounded-xl text-xs"
              >
                फोटो सेव्ह करा
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: Quick Soil Report ================= */}
      {showSoilReportModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <form
            onSubmit={handleUpdateSoil}
            className="bg-white w-full max-w-sm rounded-3xl p-4 shadow-2xl border border-stone-200 space-y-3 text-xs"
          >
            <h4 className="font-extrabold text-sm text-stone-900">
              माती अहवाल जोडा (Upload / Update Soil Report)
            </h4>
            <div>
              <label className="text-stone-600 font-medium block mb-1">
                अहवाल निष्कर्ष किंवा नोंदी:
              </label>
              <textarea
                rows={3}
                required
                value={soilText}
                onChange={(e) => setSoilText(e.target.value)}
                placeholder="उदा. सामू ७.६, सेंद्रिय कर्ब ०.४२%, नत्र १८० किलो, स्फुरद १२ किलो, पालाश ३२० किलो"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSoilReportModal(false)}
                className="flex-1 py-2 bg-stone-200 text-stone-800 font-bold rounded-xl text-xs"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                अहवाल सेव्ह करा
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
