import React, { useState } from 'react';
import { X, Save, Sprout, MapPin, Calendar, Layers, AlertCircle, Camera, Check } from 'lucide-react';
import { Field } from '../types';

interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Field) => void;
  initialField?: Field | null;
  defaultLocation?: {
    village: string;
    taluka: string;
    district: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
  fieldNumberSuggestion?: number;
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
  'हळद (Turmeric)',
  'आले (Ginger)',
  'इतर (Other)',
];

const SOIL_TYPES = [
  'काळी कसदार (Black Cotton)',
  'मध्यम काळी (Medium Black)',
  'तांबडी / लाल (Red Loamy)',
  'हलकी मुरमाड (Light Sandy/Gravelly)',
  'गाळाची जमीन (Alluvial Soil)',
];

const CROP_STAGES = [
  'उगवण / पेरणी (Sowing & Germination)',
  'शाकीय वाढ (Vegetative Growth)',
  'फुलोरा अवस्था (Flowering Stage)',
  'फळधारणा / बोंडे भरणे (Fruiting / Pod Formation)',
  'पक्वता व काढणी (Maturity & Harvest)',
];

const IRRIGATION_METHODS = [
  'ठिबक सिंचन (Drip Irrigation)',
  'तुषार सिंचन (Sprinkler Irrigation)',
  'पाटपाणी / प्रवाही (Surface Canal/Well)',
  'जिरायती / पावसावर (Rainfed)',
];

export const FieldFormModal: React.FC<FieldFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialField,
  defaultLocation,
  fieldNumberSuggestion = 1,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialField);

  // Form states
  const [name, setName] = useState(initialField?.name || `Field ${fieldNumberSuggestion}`);
  const [crop, setCrop] = useState(initialField?.crop || 'ऊस (Sugarcane)');
  const [customCrop, setCustomCrop] = useState(
    initialField && !COMMON_CROPS.includes(initialField.crop) ? initialField.crop : ''
  );
  const [isOtherCrop, setIsOtherCrop] = useState(
    initialField ? !COMMON_CROPS.includes(initialField.crop) : false
  );
  const [variety, setVariety] = useState(initialField?.variety || '');
  const [acreage, setAcreage] = useState(initialField?.acreage ? String(initialField.acreage) : '2');
  const [acreageUnit, setAcreageUnit] = useState(initialField?.acreageUnit || 'एकर (Acres)');
  const [sowingDate, setSowingDate] = useState(
    initialField?.sowingDate || new Date().toISOString().split('T')[0]
  );
  const [cropStage, setCropStage] = useState(
    initialField?.cropStage || 'शाकीय वाढ (Vegetative Growth)'
  );
  const [soilType, setSoilType] = useState(
    initialField?.soilType || 'काळी कसदार (Black Cotton)'
  );
  const [irrigationType, setIrrigationType] = useState(
    initialField?.irrigationType || 'ठिबक सिंचन (Drip Irrigation)'
  );
  const [soilHealthSummary, setSoilHealthSummary] = useState(
    initialField?.soilHealthSummary || ''
  );
  const [currentPlannedFertilizer, setCurrentPlannedFertilizer] = useState(
    initialField?.currentPlannedFertilizer || ''
  );
  const [previousFertilizerUsed, setPreviousFertilizerUsed] = useState(
    initialField?.previousFertilizerUsed || ''
  );
  const [currentCropProblem, setCurrentCropProblem] = useState(
    initialField?.currentCropProblem || initialField?.recentProblems?.[0] || ''
  );
  const [notes, setNotes] = useState(initialField?.notes || '');

  // Specific field location
  const [hasCustomLocation, setHasCustomLocation] = useState(
    Boolean(initialField?.location?.village && defaultLocation && initialField.location.village !== defaultLocation.village)
  );
  const [village, setVillage] = useState(
    initialField?.location?.village || defaultLocation?.village || ''
  );
  const [taluka, setTaluka] = useState(
    initialField?.location?.taluka || defaultLocation?.taluka || ''
  );
  const [district, setDistrict] = useState(
    initialField?.location?.district || defaultLocation?.district || 'सातारा'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCrop = isOtherCrop && customCrop.trim() ? customCrop.trim() : crop;
    const finalAcreage = parseFloat(acreage) || 1.0;

    const fieldId = initialField?.id || `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const savedField: Field = {
      id: fieldId,
      name: name.trim() || `Field ${fieldNumberSuggestion}`,
      crop: finalCrop,
      variety: variety.trim() || undefined,
      acreage: finalAcreage,
      acreageUnit: acreageUnit,
      location: {
        village: village.trim() || defaultLocation?.village || '',
        taluka: taluka.trim() || defaultLocation?.taluka || '',
        district: district.trim() || defaultLocation?.district || '',
        state: 'Maharashtra',
        latitude: defaultLocation?.latitude,
        longitude: defaultLocation?.longitude,
      },
      sowingDate: sowingDate || new Date().toISOString().split('T')[0],
      cropStage: cropStage,
      soilType: soilType,
      soilHealthSummary: soilHealthSummary.trim() || undefined,
      soilReportPhotoUrl: initialField?.soilReportPhotoUrl,
      soilReport: initialField?.soilReport,
      irrigationType: irrigationType,
      currentPlannedFertilizer: currentPlannedFertilizer.trim() || undefined,
      previousFertilizerUsed: previousFertilizerUsed.trim() || undefined,
      currentCropProblem: currentCropProblem.trim() || undefined,
      recentProblems: currentCropProblem.trim()
        ? [currentCropProblem.trim(), ...(initialField?.recentProblems || []).filter((p) => p !== currentCropProblem.trim())]
        : (initialField?.recentProblems || []),
      cropPhotoUrl: initialField?.cropPhotoUrl,
      cropPhotos: initialField?.cropPhotos || [],
      fertilizerPhotoUrl: initialField?.fertilizerPhotoUrl,
      fertilizerHistory: initialField?.fertilizerHistory || [],
      activities: initialField?.activities || [],
      notes: notes.trim() || undefined,
      createdAt: initialField?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedField);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900 rounded-xl">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {isEditing ? 'शेत माहिती संपादन (Edit Field)' : 'नवीन शेत जोडा (Add New Field)'}
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                प्रत्येक शेताचे पीक, क्षेत्र, माती व खतांची स्वतंत्र नोंद ठेवा
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-xl text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* 1. Field Name & Acreage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                शेताचे नाव (Field Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. Field 1 / विहिरीचे शेत / गट क्र. १२"
                className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                क्षेत्र / आकारमान (Area & Unit) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={acreage}
                  onChange={(e) => setAcreage(e.target.value)}
                  placeholder="उदा. 2"
                  className="w-24 p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-900 focus:outline-none"
                />
                <select
                  value={acreageUnit}
                  onChange={(e) => setAcreageUnit(e.target.value)}
                  className="flex-1 p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-800 focus:outline-none"
                >
                  <option value="एकर (Acres)">एकर (Acres)</option>
                  <option value="गुंठे (Guntha)">गुंठे (Guntha)</option>
                  <option value="हेक्टर (Hectares)">हेक्टर (Hectares)</option>
                  <option value="विघा (Bigha)">विघा (Bigha)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Crop & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                या शेतातील मुख्य पीक (Crop) <span className="text-red-500">*</span>
              </label>
              <select
                value={isOtherCrop ? 'इतर (Other)' : crop}
                onChange={(e) => {
                  if (e.target.value === 'इतर (Other)') {
                    setIsOtherCrop(true);
                  } else {
                    setIsOtherCrop(false);
                    setCrop(e.target.value);
                  }
                }}
                className="w-full p-2.5 bg-stone-50 border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-900 focus:outline-none"
              >
                {COMMON_CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {isOtherCrop && (
                <input
                  type="text"
                  required
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  placeholder="पिकाचे नाव लिहा (उदा. स्ट्रॉबेरी, ड्रॅगनफ्रूट)"
                  className="mt-2 w-full p-2 bg-amber-50 border border-amber-300 rounded-lg font-bold text-stone-900"
                />
              )}
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                पिकाचा वाण / व्हरायटी (Crop Variety - ऐच्छिक)
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="उदा. को. ८६०३२, जेएस ३३५, पंचगंगा, प्रशांत"
                className="w-full p-2.5 bg-stone-50 border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-medium text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Sowing Date & Crop Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                पेरणी / लागवड तारीख (Sowing Date)
              </label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                सध्याची वाढीची अवस्था (Crop Stage)
              </label>
              <select
                value={cropStage}
                onChange={(e) => setCropStage(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-900 focus:outline-none"
              >
                {CROP_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Soil Type & Irrigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                जमिनीचा / मातीचा प्रकार (Soil Type)
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-900 focus:outline-none"
              >
                {SOIL_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                पाणी / सिंचन पद्धत (Irrigation Method)
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-bold text-stone-900 focus:outline-none"
              >
                {IRRIGATION_METHODS.map((im) => (
                  <option key={im} value={im}>
                    {im}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Fertilizers: Planned & Previous */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2.5">
            <h4 className="font-extrabold text-stone-800 text-xs flex items-center gap-1.5">
              <span>🧴</span>
              <span>या शेतातील खतांची माहिती (Fertilizer Details):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-stone-600 block mb-1 font-medium">
                  नियोजित खत (Planned Fertilizer):
                </label>
                <input
                  type="text"
                  value={currentPlannedFertilizer}
                  onChange={(e) => setCurrentPlannedFertilizer(e.target.value)}
                  placeholder="उदा. युरिया ५० किलो + १०:२६:२६"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-medium">
                  मागील दिलेले खत (Previous Fertilizer Used):
                </label>
                <input
                  type="text"
                  value={previousFertilizerUsed}
                  onChange={(e) => setPreviousFertilizerUsed(e.target.value)}
                  placeholder="उदा. पेरणीवेळी डीएपी ५० किलो"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* 6. Current Crop Problem & Soil Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                सध्याची समस्या / कीड-रोग (Crop Problem - असल्यास)
              </label>
              <input
                type="text"
                value={currentCropProblem}
                onChange={(e) => setCurrentCropProblem(e.target.value)}
                placeholder="उदा. रसशोषक किडी, पिवळे ठिपके, करपा"
                className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-medium text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                माती परीक्षण निष्कर्ष (Soil Health Report Summary)
              </label>
              <input
                type="text"
                value={soilHealthSummary}
                onChange={(e) => setSoilHealthSummary(e.target.value)}
                placeholder="उदा. सामू ७.६, सेंद्रिय कर्ब ०.४२%"
                className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-medium text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          {/* 7. Field Location (if different village) */}
          <div className="p-3 bg-stone-100 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-700 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCustomLocation}
                  onChange={(e) => setHasCustomLocation(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>हे शेत दुसऱ्या गावात किंवा ठिकाणी आहे का? (Different Location?)</span>
              </label>
            </div>

            {hasCustomLocation && (
              <div className="grid grid-cols-3 gap-2 pt-1 animate-fadeIn">
                <div>
                  <label className="text-stone-600 block mb-0.5 text-[11px]">गाव:</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-0.5 text-[11px]">तालुका:</label>
                  <input
                    type="text"
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-0.5 text-[11px]">जिल्हा:</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 8. Notes */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              नोंदी व विशेष शेरा (Field Notes - ऐच्छिक)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="या शेताबाबत इतर काही विशेष माहिती..."
              className="w-full p-2.5 bg-white border-2 border-stone-300 focus:border-emerald-600 rounded-xl font-medium text-stone-900 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs cursor-pointer"
            >
              रद्द करा (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'बदल जतन करा (Save Changes)' : 'शेत जोडा (Save Field)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
