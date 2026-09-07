import React from 'react';
import {
  Camera,
  FlaskConical,
  TestTube2,
  Mic,
  Sprout,
  CloudSun,
  Bug,
  PhoneCall,
  BookOpen,
  Calculator,
  ChevronRight,
  Volume2,
  AlertTriangle,
  Sparkles,
  Edit3,
  Layers,
  Calendar,
  Heart,
  Package,
  TrendingUp,
  Stethoscope,
  Milk,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Language, FarmerProfile, WeatherData, Animal } from '../types';
import { translations } from '../locales/translations';
import { SpeechService } from '../utils/speech';

interface HomeScreenProps {
  language: Language;
  profile: FarmerProfile;
  weather: WeatherData | null;
  onOpenAction: (actionId: string, subTab?: string) => void;
  onStartDemoTour: () => void;
  isAudioMuted: boolean;
  onOpenAuthTab?: (tab: 'google' | 'phone' | 'old_member') => void;
  onEditProfile?: () => void;
  onOpenFieldSelector?: () => void;
  animals?: Animal[];
  activeAnimalId?: string;
  hasAnimalsChoice?: 'yes' | 'no' | 'skip';
  onSetHasAnimalsChoice?: (choice: 'yes' | 'no' | 'skip') => void;
  onOpenAnimalSelector?: () => void;
  taskCount?: number;
  inventoryAlertCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  profile,
  weather,
  onOpenAction,
  onStartDemoTour,
  isAudioMuted,
  onOpenAuthTab,
  onEditProfile,
  onOpenFieldSelector,
  animals = [],
  activeAnimalId,
  hasAnimalsChoice,
  onSetHasAnimalsChoice,
  onOpenAnimalSelector,
  taskCount = 0,
  inventoryAlertCount = 0,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];
  const activeAnimal = animals.find((a) => a.id === activeAnimalId) || (animals.length > 0 ? animals[0] : undefined);

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

  const getAnimalEmoji = (type: string = '') => {
    switch (type.toLowerCase()) {
      case 'cow':
        return '🐄';
      case 'buffalo':
        return '🐃';
      case 'bull':
        return '🐂';
      case 'calf':
        return '🐮';
      case 'goat':
        return '🐐';
      case 'sheep':
        return '🐑';
      case 'poultry':
        return '🐔';
      default:
        return '🐾';
    }
  };

  // Get time-based greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? t.goodMorning : currentHour < 17 ? t.goodAfternoon : t.goodEvening;

  const playSoundForButton = (text: string) => {
    if (!isAudioMuted) {
      SpeechService.speak(text, language);
    }
  };

  const primaryActions = [
    {
      id: 'scan_crop',
      title: t.btnScanCrop,
      desc: activeField ? `${activeField.crop} वरील रोग किंवा किडीचा फोटो काढा` : t.btnScanCropDesc,
      icon: Camera,
      badge: activeField?.crop || 'रोग व कीड',
      bgClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accentColor: 'border-emerald-500',
    },
    {
      id: 'livestock',
      title: t.btnLivestock,
      desc: activeAnimal
        ? `${activeAnimal.name} (${activeAnimal.breed}) आरोग्य, दूध व लसीकरण`
        : t.btnLivestockDesc,
      icon: Heart,
      badge: `${animals.length} जनावरे`,
      bgClass: 'bg-amber-800 hover:bg-amber-900 text-white',
      accentColor: 'border-amber-700',
    },
    {
      id: 'check_fertilizer',
      title: t.btnCheckFertilizer,
      desc: activeField ? `${activeField.crop} साठी खतांचे प्रमाण व सुसंगतता तपासा` : t.btnCheckFertilizerDesc,
      icon: FlaskConical,
      badge: 'खत सुसंगतता',
      bgClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      accentColor: 'border-amber-500',
    },
    {
      id: 'calendar',
      title: t.btnCalendar,
      desc: taskCount > 0 ? `${taskCount} नियोजित कामे व आठवणी बाकी` : t.btnCalendarDesc,
      icon: Calendar,
      badge: taskCount > 0 ? `${taskCount} कामे` : 'वेळापत्रक',
      bgClass: 'bg-teal-800 hover:bg-teal-900 text-white',
      accentColor: 'border-teal-700',
    },
    {
      id: 'ask_voice',
      title: t.btnAskVoice,
      desc: activeField ? `${activeField.name} (${activeField.crop}) बद्दल आवाजाने विचारा` : t.btnAskVoiceDesc,
      icon: Mic,
      badge: 'कृषी मित्र',
      bgClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      accentColor: 'border-blue-500',
      pulse: true,
    },
    {
      id: 'finance',
      title: t.btnFinance,
      desc: t.btnFinanceDesc,
      icon: TrendingUp,
      badge: 'नफा-तोटा',
      bgClass: 'bg-stone-800 hover:bg-stone-900 text-white',
      accentColor: 'border-stone-700',
    },
    {
      id: 'my_farm',
      title: t.btnMyFarm,
      desc: `एकूण ${profile.fields.length} शेते • पीक, खते व माती व्यवस्थापन`,
      icon: Sprout,
      badge: `${profile.fields.length} शेते`,
      bgClass: 'bg-lime-700 hover:bg-lime-800 text-white',
      accentColor: 'border-lime-600',
    },
    {
      id: 'inventory',
      title: t.btnInventory,
      desc: inventoryAlertCount > 0 ? `⚠️ ${inventoryAlertCount} वस्तूंचा साठा कमी आहे!` : t.btnInventoryDesc,
      icon: Package,
      badge: inventoryAlertCount > 0 ? 'कमी साठा' : 'गोदाम साठा',
      bgClass: 'bg-stone-700 hover:bg-stone-800 text-white',
      accentColor: 'border-stone-600',
    },
    {
      id: 'check_soil',
      title: t.btnCheckSoil,
      desc: activeField ? `${activeField.name} चा माती आरोग्य अहवाल व उपाय` : t.btnCheckSoilDesc,
      icon: TestTube2,
      badge: 'माती आरोग्य',
      bgClass: 'bg-teal-700 hover:bg-teal-800 text-white',
      accentColor: 'border-teal-600',
    },
    {
      id: 'crop_problems',
      title: t.btnCropProblems,
      desc: activeField ? `${activeField.crop} मधील चालू समस्या व मार्गदर्शक` : t.btnCropProblemsDesc,
      icon: Bug,
      badge: 'माहिती कोश',
      bgClass: 'bg-orange-700 hover:bg-orange-800 text-white',
      accentColor: 'border-orange-600',
    },
    {
      id: 'ask_expert',
      title: t.btnAskExpert,
      desc: t.btnAskExpertDesc,
      icon: PhoneCall,
      badge: 'थेट संपर्क',
      bgClass: 'bg-rose-700 hover:bg-rose-800 text-white',
      accentColor: 'border-rose-600',
    },
  ];

  return (
    <div className="pb-24 pt-3 max-w-4xl mx-auto px-4 space-y-4">
      {/* Visual Greeting Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white rounded-2xl p-4 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🙏</span>
              <h2 className="text-lg font-extrabold tracking-tight text-amber-300">
                {greeting}, {profile.name}
              </h2>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              {profile.location.village}, {profile.location.taluka} ({profile.location.district})
            </p>
          </div>
          {onEditProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-extrabold px-2.5 py-1.5 rounded-xl border border-emerald-600/80 flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0 shadow-xs"
              title="माहिती संपादित करा (Edit Info)"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>संपादित करा</span>
            </button>
          )}
        </div>

        {/* Quick total farms/fields badge */}
        <div
          onClick={() => onOpenAction('my_farm')}
          className="bg-white/10 hover:bg-white/20 transition-all rounded-xl p-2.5 flex items-center justify-between gap-3 border border-white/15 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-lg">🌾</span>
            <div>
              <div className="text-[11px] text-emerald-200 font-medium">एकूण शेते (Total Fields):</div>
              <div className="text-xs font-bold text-white">
                {profile.fields.length} शेते ({profile.fields.reduce((acc, f) => acc + (f.acreage || 0), 0)} एकर)
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>
      </div>

      {/* PROMINENT CURRENT ACTIVE FIELD SECTION */}
      <div className="bg-white rounded-2xl p-4 border-2 border-emerald-600 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              सध्या निवडलेले शेत (Current Field)
            </span>
            <span className="text-[11px] text-stone-500 font-semibold hidden sm:inline">
              ({profile.fields.length} पैकी १)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFieldSelector && (
              <button
                type="button"
                onClick={onOpenFieldSelector}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-200" />
                <span>शेत बदला (Change Field)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenAction('my_farm')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              माझी शेते ➔
            </button>
          </div>
        </div>

        {/* Current Field Highlight Card */}
        <div
          onClick={onOpenFieldSelector || (() => onOpenAction('my_farm'))}
          className="flex items-center justify-between gap-3 bg-stone-50 hover:bg-emerald-50/50 p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shrink-0 border border-stone-200 shadow-2xs">
              {getCropEmoji(activeField?.crop)}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-stone-900 truncate">
                  {activeField ? `${activeField.name} — ${activeField.crop} — ${activeField.acreage} ${activeField.acreageUnit || 'एकर'}` : 'Field 1 — Sugarcane — 2 acres'}
                </h3>
              </div>
              <p className="text-xs text-stone-600 font-medium truncate mt-0.5">
                वाढीची अवस्था: <span className="font-bold text-stone-800">{activeField?.cropStage?.split('/')[0] || 'शाकीय वाढ'}</span> • माती: {activeField?.soilType?.split('(')[0] || 'काळी कसदार'}
                {activeField?.variety ? ` • वाण: ${activeField.variety}` : ''}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1 text-emerald-700 font-bold text-xs bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
            <span>बदला</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <p className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-0.5">
          <span>💡</span>
          <span>खालील सर्व स्कॅनर, खत तपासणी, रोग उपाय व आवाज सहाय्यक <strong>{activeField?.name || 'सध्या निवडलेल्या शेता'}</strong>साठी काम करतील.</span>
        </p>
      </div>

      {/* ============================================================ */}
      {/* 🐄 CATTLE & LIVESTOCK REARING (स्वतंत्र गोपालन व पशुधन विभाग) */}
      {/* ============================================================ */}
      <section className="bg-amber-50/50 rounded-3xl p-4 sm:p-5 border-2 border-amber-600 shadow-sm space-y-3.5">
        {/* Major Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐄</span>
              <h2 className="text-base sm:text-lg font-black text-amber-950 tracking-tight">
                CATTLE & LIVESTOCK REARING
              </h2>
              <span className="text-[10px] bg-amber-200 text-amber-950 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                ऐच्छिक (Optional)
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-800 font-bold mt-0.5">
              स्वतंत्र गोपालन व पशुधन विभाग • Separate from crop/field data
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {animals.length > 0 && onOpenAnimalSelector && (
              <button
                type="button"
                onClick={onOpenAnimalSelector}
                className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <span>🔄 जनावर बदला</span>
                <span className="bg-amber-800 text-amber-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {animals.length}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (onSetHasAnimalsChoice) onSetHasAnimalsChoice('yes');
                onOpenAction('livestock', 'add_animal');
              }}
              className="bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <span>+ नवीन जनावर / Add Animal</span>
            </button>
          </div>
        </div>

        {/* Active Animal Banner or Entry Gate */}
        {activeAnimal ? (
          <div
            onClick={onOpenAnimalSelector || (() => onOpenAction('livestock', 'overview'))}
            className="flex items-center justify-between gap-3 bg-white hover:bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-12 h-12 rounded-2xl bg-amber-100/70 flex items-center justify-center text-2xl shrink-0 border border-amber-200 shadow-2xs">
                {getAnimalEmoji(activeAnimal.type)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-stone-900 truncate">
                    {activeAnimal.name} ({activeAnimal.breed || 'स्थानिक जात'})
                  </h3>
                  {activeAnimal.pregnancyStatus === 'pregnant' && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      🤰 गाभण
                    </span>
                  )}
                  {activeAnimal.pregnancyStatus === 'in_heat' && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      🔥 माजावर
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 font-medium truncate mt-0.5">
                  वय: <span className="font-bold text-stone-800">{activeAnimal.ageYears} वर्षे</span>
                  {activeAnimal.tagNumber ? ` • टॅग: ${activeAnimal.tagNumber}` : ''}
                  {activeAnimal.dailyMilkLiters !== undefined && activeAnimal.dailyMilkLiters > 0
                    ? ` • दूध: ${activeAnimal.dailyMilkLiters}L/दिवस`
                    : ''}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-amber-800 font-bold text-xs bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
              <span>माहिती पहा</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-amber-200 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🐄</span>
              <div>
                <h3 className="font-extrabold text-stone-900 text-sm">
                  तुमच्याकडे पशू किंवा जनावरे आहेत का? (Do you have any animals?)
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  तुम्ही गाई, म्हशी, शेळ्या, मेंढ्या किंवा कोंबड्या पाळता का? हा विभाग पूर्णपणे ऐच्छिक आहे.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onSetHasAnimalsChoice) onSetHasAnimalsChoice('yes');
                  onOpenAction('livestock', 'add_animal');
                }}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>🐄 होय, माझ्याकडे पशू आहेत</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onSetHasAnimalsChoice) onSetHasAnimalsChoice('no');
                }}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 px-3 rounded-xl text-xs border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🚫 नाही, पशू नाहीत</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onSetHasAnimalsChoice) onSetHasAnimalsChoice('skip');
                }}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 px-3 rounded-xl text-xs border border-stone-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⏩ नंतर सांगा / Skip</span>
              </button>
            </div>
          </div>
        )}

        {/* 8 Core Large Buttons for Simple Livestock Management */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase tracking-wide">
            <span>पशुधन व्यवस्थापन सुविधा (8 Modules):</span>
            <span className="text-[10px] text-amber-700 font-medium lowercase">किमान टायपिंग • १-क्लिक</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. My Animals */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'overview')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🐄</span>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full">
                  {animals.length}
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  माझी जनावरे
                </div>
                <div className="text-[10px] text-stone-500">My Animals</div>
              </div>
            </button>

            {/* 2. Animal Health */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'health')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🩺</span>
                <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full">
                  AI मदत
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  पशु आरोग्य
                </div>
                <div className="text-[10px] text-stone-500">Animal Health</div>
              </div>
            </button>

            {/* 3. Vaccinations */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'vaccines')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">💉</span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                  लस वेळापत्रक
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  लसीकरण
                </div>
                <div className="text-[10px] text-stone-500">Vaccinations</div>
              </div>
            </button>

            {/* 4. Milk */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'milk')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🥛</span>
                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                  दैनिक
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  दूध नोंद
                </div>
                <div className="text-[10px] text-stone-500">Milk Record</div>
              </div>
            </button>

            {/* 5. Feed */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'feed')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🌾</span>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                  पोषण
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  पशुखाद्य व चारा
                </div>
                <div className="text-[10px] text-stone-500">Feed & Fodder</div>
              </div>
            </button>

            {/* 6. Breeding */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'breeding')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🤰</span>
                <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                  गाभण नोंद
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  प्रजोत्पादन
                </div>
                <div className="text-[10px] text-stone-500">Breeding</div>
              </div>
            </button>

            {/* 7. Reminders */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'reminders')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">📅</span>
                <span className="text-[10px] font-extrabold bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full">
                  कॅलेंडर
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  आठवण व दिनदर्शिका
                </div>
                <div className="text-[10px] text-stone-500">Reminders</div>
              </div>
            </button>

            {/* 8. Records */}
            <button
              type="button"
              onClick={() => onOpenAction('livestock', 'records')}
              className="p-3 bg-white hover:bg-amber-50 border border-amber-200 rounded-2xl text-left flex flex-col justify-between gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">📋</span>
                <span className="text-[10px] font-extrabold bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded-full">
                  इतिहास
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-stone-900 group-hover:text-amber-950">
                  उपचार व नोंदी
                </div>
                <div className="text-[10px] text-stone-500">Treatment & Logs</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Login / Sign In Options Bar for First-time & Returning Farmers */}
      {!profile.isFirebaseUser && (
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-stone-900">
              <span className="text-base">🔐</span>
              <span>अ‍ॅपमध्ये प्रवेश / लॉगिन पर्याय (Sign In Options):</span>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              बॅकअप व क्लाउड
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onOpenAuthTab?.('google')}
              className="bg-stone-50 hover:bg-emerald-50 border border-stone-300 hover:border-emerald-400 p-2.5 rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
            >
              <span className="text-xl">🌐</span>
              <span className="text-[11px] font-bold text-stone-900">Google लॉगिन</span>
              <span className="text-[9px] text-emerald-700 font-medium">१-क्लिक मधे</span>
            </button>

            <button
              onClick={() => onOpenAuthTab?.('phone')}
              className="bg-stone-50 hover:bg-emerald-50 border border-stone-300 hover:border-emerald-400 p-2.5 rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
            >
              <span className="text-xl">📱</span>
              <span className="text-[11px] font-bold text-stone-900">मोबाईल OTP</span>
              <span className="text-[9px] text-stone-500">नवीन नोंदणी</span>
            </button>

            <button
              onClick={() => onOpenAuthTab?.('old_member')}
              className="bg-stone-50 hover:bg-amber-50 border border-stone-300 hover:border-amber-400 p-2.5 rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
            >
              <span className="text-xl">👨‍🌾</span>
              <span className="text-[11px] font-bold text-stone-900">जुने सभासद</span>
              <span className="text-[9px] text-amber-800 font-bold">खाते निवडा</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive 3-Minute Demo Banner */}
      <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg shadow-sm">
            ▶️
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">{t.demoTourButton}</h3>
            <p className="text-xs text-stone-700">
              कापूस पान स्कॅनिंग ➔ खत तपासणी ➔ आवाज प्रश्न ➔ शेती डायरी
            </p>
          </div>
        </div>
        <button
          onClick={onStartDemoTour}
          className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold px-3 py-1.5 rounded-xl text-xs shadow transition-all active:scale-95 cursor-pointer whitespace-nowrap"
        >
          सुरू करा
        </button>
      </div>

      {/* THE 8 LARGE CORE BUTTONS - High contrast, touch-friendly, uncluttered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {primaryActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => {
                playSoundForButton(action.title);
                onOpenAction(action.id);
              }}
              className={`w-full text-left p-4 rounded-2xl shadow-sm transition-all duration-150 active:scale-[0.98] border-2 flex items-center justify-between gap-3.5 cursor-pointer group ${action.bgClass} ${action.accentColor}`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform ${
                    action.pulse ? 'ring-4 ring-white/30' : ''
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base leading-tight tracking-tight">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/85 mt-0.5 leading-snug line-clamp-1">
                    {action.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center shrink-0">
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white/90 group-hover:bg-white/30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Fast Utilities: Farm Diary, Cost Calculator, Calendar, Finance, Stock */}
      <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => {
            playSoundForButton(t.btnFarmDiary);
            onOpenAction('farm_diary');
          }}
          className="p-3 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-2xl flex items-center gap-2 text-stone-900 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="text-left min-w-0">
            <div className="truncate">{t.btnFarmDiary}</div>
            <div className="text-[10px] text-stone-600 font-normal truncate">खते व फवारणी</div>
          </div>
        </button>

        <button
          onClick={() => {
            playSoundForButton(t.btnCostCalculator);
            onOpenAction('cost_calculator');
          }}
          className="p-3 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-2xl flex items-center gap-2 text-stone-900 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="p-2 bg-amber-600 text-white rounded-xl shrink-0">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <div className="text-left min-w-0">
            <div className="truncate">{t.btnCostCalculator}</div>
            <div className="text-[10px] text-stone-600 font-normal truncate">एकरी खत हिशोब</div>
          </div>
        </button>

        <button
          onClick={() => {
            playSoundForButton(t.btnCalendar);
            onOpenAction('calendar');
          }}
          className="p-3 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-2xl flex items-center gap-2 text-stone-900 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="p-2 bg-teal-700 text-white rounded-xl shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-left min-w-0">
            <div className="truncate">शेती कॅलेंडर</div>
            <div className="text-[10px] text-stone-600 font-normal truncate">आठवणी व कामे</div>
          </div>
        </button>

        <button
          onClick={() => {
            playSoundForButton(t.btnInventory);
            onOpenAction('inventory');
          }}
          className="p-3 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-2xl flex items-center gap-2 text-stone-900 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <div className="p-2 bg-stone-800 text-white rounded-xl shrink-0">
            <Package className="w-3.5 h-3.5" />
          </div>
          <div className="text-left min-w-0">
            <div className="truncate">गोदाम साठा</div>
            <div className="text-[10px] text-stone-600 font-normal truncate">शिल्लक खते/खाद्य</div>
          </div>
        </button>
      </div>
    </div>
  );
};
