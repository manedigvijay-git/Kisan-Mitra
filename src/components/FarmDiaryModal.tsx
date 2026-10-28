import React, { useState, useRef } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Calendar,
  IndianRupee,
  AudioLines,
  Square,
  Camera,
  Trash2,
  Volume2,
  Filter,
} from 'lucide-react';
import { Language, FarmerProfile, FarmDiaryEntry } from '../types';
import { translations } from '../locales/translations';
import { SpeechService, createSpeechRecognizer } from '../utils/speech';
import { compressImageFile } from '../utils/imageCompressor';

interface FarmDiaryModalProps {
  language: Language;
  profile: FarmerProfile;
  diaryEntries: FarmDiaryEntry[];
  onClose: () => void;
  onAddEntry: (entry: Omit<FarmDiaryEntry, 'id'>) => void;
  onDeleteEntry?: (entryId: string) => void;
}

export const FarmDiaryModal: React.FC<FarmDiaryModalProps> = ({
  language,
  profile,
  diaryEntries,
  onClose,
  onAddEntry,
  onDeleteEntry,
}) => {
  const t = translations[language];
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('all');

  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  const [isAdding, setIsAdding] = useState(false);
  const [activityType, setActivityType] = useState<
    'sowing' | 'fertilizer' | 'spray' | 'irrigation' | 'harvest' | 'problem' | 'other'
  >('spray');
  const [selectedFieldId, setSelectedFieldId] = useState<string>(activeField?.id || 'field_1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  // Speech to Text state for voice input
  const [isRecording, setIsRecording] = useState(false);
  const [speechTarget, setSpeechTarget] = useState<'title' | 'description' | null>(null);
  const [recognizer, setRecognizer] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered entries
  const filteredEntries =
    selectedFieldFilter === 'all'
      ? diaryEntries
      : diaryEntries.filter((e) => e.fieldId === selectedFieldFilter);

  const totalCost = filteredEntries.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const handleStartVoice = (target: 'title' | 'description') => {
    if (isRecording) {
      if (recognizer) {
        try { recognizer.stop(); } catch (e) {}
      }
      setIsRecording(false);
      setSpeechTarget(null);
      return;
    }

    setSpeechTarget(target);
    const rec = createSpeechRecognizer(
      language,
      (result) => {
        const text = typeof result === 'string' ? result : result.transcript;
        if (text) {
          if (target === 'title') {
            setTitle(text);
          } else {
            setDescription(text);
          }
        }
        if (result.isFinal) {
          setIsRecording(false);
          setSpeechTarget(null);
        }
      },
      (err) => {
        console.warn('Voice recording error in FarmDiary:', err);
        setIsRecording(false);
        setSpeechTarget(null);
      },
      () => {
        setIsRecording(false);
        setSpeechTarget(null);
      }
    );

    if (rec) {
      try {
        rec.start();
        setIsRecording(true);
        setRecognizer(rec);
      } catch (e) {
        console.error('Failed to start voice in FarmDiary:', e);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 800, 0.8)
      .then((res) => setPhotoDataUrl(res.dataUrl))
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEntry({
      date,
      fieldId: selectedFieldId,
      activityType,
      title: title.trim(),
      description: description.trim(),
      cost: cost ? parseFloat(cost) : 0,
      photoUrl: photoDataUrl || undefined,
    });

    setTitle('');
    setDescription('');
    setCost('');
    setPhotoDataUrl(null);
    setIsAdding(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fertilizer':
        return '🧴';
      case 'spray':
        return 'ቸ';
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

  const getFieldName = (fieldId: string) => {
    const found = profile.fields.find((f) => f.id === fieldId);
    return found ? found.name : 'शेत';
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
              <h3 className="font-bold text-base leading-snug">{t.btnFarmDiary} (Farm Diary)</h3>
              <p className="text-xs text-emerald-100">
                {profile.name} • एकूण खर्च: ₹{totalCost.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              SpeechService.stop();
              onClose();
            }}
            className="p-2 hover:bg-emerald-900 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Field Filter Selector & Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <Filter className="w-4 h-4 text-stone-500 shrink-0" />
              <button
                type="button"
                onClick={() => setSelectedFieldFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedFieldFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                सर्व नोंदी ({diaryEntries.length})
              </button>

              {profile.fields.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFieldFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors truncate max-w-[120px] cursor-pointer ${
                    selectedFieldFilter === f.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  🌾 {f.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'फॉर्म बंद करा' : 'नवीन नोंद करा'}</span>
            </button>
          </div>

          {/* Add Entry Form */}
          {isAdding && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded-2xl border-2 border-emerald-600 space-y-3 text-xs shadow-md"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h5 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                  <span>📝</span>
                  <span>नवीन शेती कामाची नोंद:</span>
                </h5>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  आवाज / टाईप करा
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-stone-700 block mb-1 font-bold">शेत निवडा:</label>
                  <select
                    value={selectedFieldId}
                    onChange={(e) => setSelectedFieldId(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {profile.fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        🌾 {f.name} ({f.crop})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-bold">तारीख:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-bold">कामाचा प्रकार:</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-xl font-bold bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="spray">🚿 फवारणी (Spraying)</option>
                    <option value="fertilizer">🧴 खत देणे (Fertilizer)</option>
                    <option value="sowing">🌱 पेरणी (Sowing)</option>
                    <option value="irrigation">💧 पाणी देणे (Irrigation)</option>
                    <option value="harvest">🌾 काढणी (Harvest)</option>
                    <option value="problem">⚠️ रोग / कीड आढळली</option>
                    <option value="other">📝 इतर काम</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-700 font-bold">शीर्षक (Title):</label>
                  <button
                    type="button"
                    onClick={() => handleStartVoice('title')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                      isRecording && speechTarget === 'title'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {isRecording && speechTarget === 'title' ? (
                      <Square className="w-3 h-3 fill-current" />
                    ) : (
                      <AudioLines className="w-3 h-3 text-emerald-700" />
                    )}
                    <span>{isRecording && speechTarget === 'title' ? 'बोलणे थांबवा' : 'बोला (Voice)'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. ५% निंबोळी अर्क फवारणी केली"
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-700 font-bold">तपशील व औषध मात्रा:</label>
                  <button
                    type="button"
                    onClick={() => handleStartVoice('description')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                      isRecording && speechTarget === 'description'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {isRecording && speechTarget === 'description' ? (
                      <Square className="w-3 h-3 fill-current" />
                    ) : (
                      <AudioLines className="w-3 h-3 text-emerald-700" />
                    )}
                    <span>{isRecording && speechTarget === 'description' ? 'बोलणे थांबवा' : 'बोला (Voice)'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="उदा. १५ लिटर पंपाला ४५ मिली निम तेल + ५ मिली स्टिकर वापरले."
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-700 block mb-1 font-bold">झालेला खर्च (₹ Cost):</label>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50 focus-within:ring-2 focus-within:ring-emerald-500">
                    <span className="px-3 text-stone-600 font-bold bg-stone-200 border-r border-stone-300 py-2">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="उदा. 450"
                      className="w-full p-2 font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-bold">फोटो जोडा (पर्यायी):</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2 border border-stone-300 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>{photoDataUrl ? '✓ फोटो जोडला (बदला)' : 'फोटो निवडा / काढा'}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {photoDataUrl && (
                <div className="relative rounded-xl overflow-hidden max-h-32 bg-stone-900 flex items-center justify-center">
                  <img src={photoDataUrl} alt="Diary attachment" className="max-h-32 object-contain" />
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl(null)}
                    className="absolute top-1.5 right-1.5 p-1 bg-stone-900/80 text-white rounded-lg text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-stone-100">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                >
                  ✓ नोंद जतन करा (Save Entry)
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  रद्द करा
                </button>
              </div>
            </form>
          )}

          {/* Diary Entries List */}
          <div className="space-y-3">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-10 text-stone-500 bg-white rounded-2xl border border-stone-200 space-y-2">
                <div className="text-4xl">📖</div>
                <h5 className="font-extrabold text-stone-800 text-sm">कोणतीही नोंद आढळली नाही</h5>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  तुमच्या शेतात घेतलेली फवारणी, खते, पेरणी किंवा खर्चाची नोंद ठेवण्यासाठी वरील 'नवीन नोंद करा' बटनावर टॅप करा.
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl p-2 bg-stone-100 rounded-xl shrink-0">
                        {getActivityIcon(entry.activityType)}
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-stone-900 text-sm leading-snug truncate">
                          {entry.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                          <span className="font-bold text-stone-700">📅 {entry.date}</span>
                          <span>•</span>
                          <span className="text-emerald-800 font-extrabold">🌾 {getFieldName(entry.fieldId)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {entry.cost !== undefined && entry.cost > 0 && (
                        <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ₹{entry.cost.toLocaleString('en-IN')}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const text = `${entry.title}. ${entry.description || ''}`;
                          SpeechService.speak(text, language);
                        }}
                        className="p-1.5 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 rounded-lg transition-colors cursor-pointer"
                        title="वाचून दाखवा"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {onDeleteEntry && (
                        <button
                          type="button"
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-1.5 bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="काढून टाका"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {entry.description && (
                    <p className="text-xs text-stone-700 pl-11 leading-relaxed font-medium">
                      {entry.description}
                    </p>
                  )}

                  {entry.photoUrl && (
                    <div className="pl-11 pt-1">
                      <img
                        src={entry.photoUrl}
                        alt={entry.title}
                        className="h-24 rounded-xl object-cover border border-stone-200"
                      />
                    </div>
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
