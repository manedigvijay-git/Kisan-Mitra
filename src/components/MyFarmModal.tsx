import React, { useState } from 'react';
import { X, Sprout, Plus, Calendar, MapPin, Check, Edit3, Trash2 } from 'lucide-react';
import { Language, FarmerProfile, Field } from '../types';
import { translations } from '../locales/translations';

interface MyFarmModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onUpdateProfile: (updated: FarmerProfile) => void;
  onEditProfile?: () => void;
}

export const MyFarmModal: React.FC<MyFarmModalProps> = ({
  language,
  profile,
  onClose,
  onUpdateProfile,
  onEditProfile,
}) => {
  const t = translations[language];

  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newCrop, setNewCrop] = useState('कापूस (Cotton)');
  const [newAcreage, setNewAcreage] = useState('3');
  const [newStage, setNewStage] = useState('शाकीय वाढ (Vegetative)');
  const [newSoilType, setNewSoilType] = useState('काळी कसदार (Black Cotton)');

  const handleSelectActiveField = (fieldId: string) => {
    onUpdateProfile({
      ...profile,
      activeFieldId: fieldId,
    });
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const newField: Field = {
      id: `field_${Date.now()}`,
      name: newFieldName.trim(),
      crop: newCrop,
      acreage: parseFloat(newAcreage) || 2,
      sowingDate: new Date().toISOString().split('T')[0],
      soilType: newSoilType,
      cropStage: newStage,
      fertilizerHistory: [],
      recentProblems: [],
    };

    onUpdateProfile({
      ...profile,
      fields: [...profile.fields, newField],
      activeFieldId: newField.id,
    });

    setNewFieldName('');
    setIsAddingField(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-lime-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lime-900 rounded-xl">
              <Sprout className="w-5 h-5 text-lime-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">{t.btnMyFarm}</h3>
              <p className="text-xs text-lime-100">शेत, पिके, क्षेत्र व खतांचा इतिहास</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-lime-900 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Farmer Details Summary */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-11 h-11 bg-lime-100 text-lime-800 font-bold rounded-2xl flex items-center justify-center text-lg shrink-0">
                👨‍🌾
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-stone-900 text-sm truncate">{profile.name}</h4>
                <p className="text-xs text-stone-500 truncate">
                  {profile.location.village}, {profile.location.taluka} ({profile.location.district})
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-xs font-bold text-lime-900 bg-lime-100 px-2 py-0.5 rounded-md">
                एकूण {profile.fields.reduce((acc, f) => acc + f.acreage, 0)} एकर
              </span>
              {onEditProfile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditProfile();
                  }}
                  className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>माहिती संपादित करा</span>
                </button>
              )}
            </div>
          </div>

          {/* Fields List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase text-stone-600 tracking-wider">
                तुमची शेते (Your Fields):
              </h4>
              <button
                onClick={() => setIsAddingField(!isAddingField)}
                className="text-xs font-bold text-lime-800 hover:text-lime-900 flex items-center gap-1 bg-lime-100 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>नवीन शेत जोडा</span>
              </button>
            </div>

            {/* Add Field Form */}
            {isAddingField && (
              <form
                onSubmit={handleAddField}
                className="bg-white p-4 rounded-2xl border-2 border-lime-500 mb-3 space-y-2.5 text-xs shadow-sm"
              >
                <h5 className="font-bold text-stone-900">नवीन शेताची माहिती भरा:</h5>
                <div>
                  <label className="text-stone-600 block mb-0.5 font-medium">शेताचे नाव (Field Name):</label>
                  <input
                    type="text"
                    required
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="उदा. विहिरीचे शेत / गट क्र. १५"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-stone-600 block mb-0.5 font-medium">पीक (Crop):</label>
                    <select
                      value={newCrop}
                      onChange={(e) => setNewCrop(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                    >
                      <option value="कापूस (Cotton)">कापूस (Cotton)</option>
                      <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean)</option>
                      <option value="कांदा (Onion)">कांदा (Onion)</option>
                      <option value="गहू (Wheat)">गहू (Wheat)</option>
                      <option value="तूर (Pigeonpea)">तूर (Pigeonpea)</option>
                      <option value="ऊस (Sugarcane)">ऊस (Sugarcane)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-0.5 font-medium">क्षेत्र (Acreage):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newAcreage}
                      onChange={(e) => setNewAcreage(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-lime-700 hover:bg-lime-800 text-white font-bold py-2 rounded-lg cursor-pointer"
                  >
                    जतन करा
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingField(false)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg cursor-pointer"
                  >
                    रद्द करा
                  </button>
                </div>
              </form>
            )}

            {/* Field Cards */}
            <div className="space-y-2.5">
              {profile.fields.map((field) => {
                const isActive = field.id === profile.activeFieldId;
                return (
                  <div
                    key={field.id}
                    onClick={() => handleSelectActiveField(field.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-lime-50/80 border-lime-600 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-lime-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌱</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-extrabold text-stone-900 text-sm">{field.name}</h5>
                            {isActive && (
                              <span className="text-[10px] bg-lime-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                                सक्रिय शेत
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            {field.crop} • {field.acreage} एकर • {field.soilType}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold text-stone-500 block">
                          अवस्था: {field.cropStage}
                        </span>
                      </div>
                    </div>

                    {/* Fertilizer & Soil Summary pill */}
                    <div className="mt-2.5 pt-2 border-t border-stone-200/70 flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-2">
                      <div className="truncate max-w-[280px]">
                        <span className="font-semibold text-stone-800">खते: </span>
                        {field.fertilizerHistory.length > 0
                          ? field.fertilizerHistory.map((f) => f.productName).join(', ')
                          : 'नोंद नाही'}
                      </div>
                      <span className="text-[10px] text-lime-900 font-bold bg-lime-100 px-2 py-0.5 rounded-md">
                        पेरणी: {field.sowingDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
