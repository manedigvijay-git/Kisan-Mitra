import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Calendar,
  IndianRupee,
  Mic,
  Camera,
  Trash2,
  Volume2,
} from 'lucide-react';
import { Language, FarmerProfile, FarmDiaryEntry } from '../types';
import { translations } from '../locales/translations';
import { SpeechService } from '../utils/speech';

interface FarmDiaryModalProps {
  language: Language;
  profile: FarmerProfile;
  diaryEntries: FarmDiaryEntry[];
  onClose: () => void;
  onAddEntry: (entry: Omit<FarmDiaryEntry, 'id'>) => void;
}

export const FarmDiaryModal: React.FC<FarmDiaryModalProps> = ({
  language,
  profile,
  diaryEntries,
  onClose,
  onAddEntry,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  const [isAdding, setIsAdding] = useState(false);
  const [activityType, setActivityType] = useState<
    'sowing' | 'fertilizer' | 'spray' | 'irrigation' | 'harvest' | 'problem' | 'other'
  >('spray');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEntry({
      date,
      fieldId: activeField?.id || 'field_1',
      activityType,
      title: title.trim(),
      description: description.trim(),
      cost: cost ? parseFloat(cost) : 0,
    });

    setTitle('');
    setDescription('');
    setCost('');
    setIsAdding(false);
  };

  const totalCost = diaryEntries.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fertilizer':
        return '🧴';
      case 'spray':
        return '🚿';
      case 'sowing':
        return '🌱';
      case 'irrigation':
        return '💧';
      case 'harvest':
        return '🌾';
      case 'problem':
        return '⚠️';
      default:
        return '📝';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900 rounded-xl">
              <BookOpen className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">{t.btnFarmDiary}</h3>
              <p className="text-xs text-emerald-100">
                {activeField?.name} • एकूण खर्च: ₹{totalCost.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-900 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Top Add Button */}
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-stone-700 tracking-wider">
              शेती दैनंदिनी नोंदी ({diaryEntries.length}):
            </h4>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन नोंद करा</span>
            </button>
          </div>

          {/* Add Entry Form */}
          {isAdding && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded-2xl border-2 border-emerald-600 space-y-3 text-xs shadow-sm"
            >
              <h5 className="font-extrabold text-stone-900 text-sm">शेती कामाची नोंद:</h5>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-600 block mb-0.5 font-medium">तारीख:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="text-stone-600 block mb-0.5 font-medium">कामाचा प्रकार:</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                  >
                    <option value="spray">🚿 फवारणी (Spraying)</option>
                    <option value="fertilizer">🧴 खत देणे (Fertilizer)</option>
                    <option value="sowing">🌱 पेरणी (Sowing)</option>
                    <option value="irrigation">💧 पाणी देणे (Irrigation)</option>
                    <option value="harvest">🌾 काढणी (Harvest)</option>
                    <option value="problem">⚠️ रोग / कीड आढळली</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-600 block mb-0.5 font-medium">शीर्षक (Title):</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. निंबोळी अर्क ५% फवारणी केली"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-stone-600 block mb-0.5 font-medium">तपशील व औषध मात्रा:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="उदा. १५ लिटर पंपाला ४५ मिली निम अर्क + स्टिकर वापरले."
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-stone-600 block mb-0.5 font-medium">झालेला खर्च (₹ Cost):</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="उदा. 450"
                  className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  नोंद जतन करा
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl cursor-pointer"
                >
                  रद्द करा
                </button>
              </div>
            </form>
          )}

          {/* Diary Entries List */}
          <div className="space-y-2.5">
            {diaryEntries.length === 0 ? (
              <div className="text-center py-8 text-stone-500 bg-white rounded-2xl border border-stone-200">
                <div className="text-3xl mb-1">📖</div>
                <p className="text-xs">अजून कोणतीही नोंद केलेली नाही.</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  वरील 'नवीन नोंद करा' बटनावर टॅप करा.
                </p>
              </div>
            ) : (
              diaryEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all shadow-2xs space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1 bg-stone-100 rounded-lg">
                        {getActivityIcon(entry.activityType)}
                      </span>
                      <div>
                        <h5 className="font-extrabold text-stone-900 text-sm leading-snug">
                          {entry.title}
                        </h5>
                        <span className="text-[11px] text-stone-500">{entry.date}</span>
                      </div>
                    </div>

                    {entry.cost && (
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        ₹{entry.cost}
                      </span>
                    )}
                  </div>

                  {entry.description && (
                    <p className="text-xs text-stone-700 pl-9 leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
