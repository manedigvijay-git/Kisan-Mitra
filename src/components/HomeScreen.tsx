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
} from 'lucide-react';
import { Language, FarmerProfile, WeatherData } from '../types';
import { translations } from '../locales/translations';
import { SpeechService } from '../utils/speech';

interface HomeScreenProps {
  language: Language;
  profile: FarmerProfile;
  weather: WeatherData | null;
  onOpenAction: (actionId: string) => void;
  onStartDemoTour: () => void;
  isAudioMuted: boolean;
  onOpenAuthTab?: (tab: 'google' | 'phone' | 'old_member') => void;
  onEditProfile?: () => void;
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
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

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
      desc: t.btnScanCropDesc,
      icon: Camera,
      badge: 'रोग व कीड',
      bgClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accentColor: 'border-emerald-500',
    },
    {
      id: 'check_fertilizer',
      title: t.btnCheckFertilizer,
      desc: t.btnCheckFertilizerDesc,
      icon: FlaskConical,
      badge: 'खत सुसंगतता',
      bgClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      accentColor: 'border-amber-500',
    },
    {
      id: 'check_soil',
      title: t.btnCheckSoil,
      desc: t.btnCheckSoilDesc,
      icon: TestTube2,
      badge: 'माती आरोग्य',
      bgClass: 'bg-teal-700 hover:bg-teal-800 text-white',
      accentColor: 'border-teal-600',
    },
    {
      id: 'ask_voice',
      title: t.btnAskVoice,
      desc: t.btnAskVoiceDesc,
      icon: Mic,
      badge: 'कृषी मित्र',
      bgClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      accentColor: 'border-blue-500',
      pulse: true,
    },
    {
      id: 'my_farm',
      title: t.btnMyFarm,
      desc: t.btnMyFarmDesc,
      icon: Sprout,
      badge: 'नोंदी व क्षेत्र',
      bgClass: 'bg-lime-700 hover:bg-lime-800 text-white',
      accentColor: 'border-lime-600',
    },
    {
      id: 'crop_problems',
      title: t.btnCropProblems,
      desc: t.btnCropProblemsDesc,
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

        {/* Quick field summary badge */}
        <div
          onClick={() => onOpenAction('my_farm')}
          className="bg-white/10 hover:bg-white/20 transition-all rounded-xl p-2.5 flex items-center justify-between gap-3 border border-white/15 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-lg">🌱</span>
            <div>
              <div className="text-[11px] text-emerald-200 font-medium">{t.activeField}:</div>
              <div className="text-xs font-bold text-white">
                {activeField ? activeField.name : 'शेत'}{' '}
                <span className="text-amber-300">
                  ({activeField ? `${activeField.crop} • ${activeField.acreage} एकर` : ''})
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>
      </div>

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

      {/* Secondary Fast Utilities: Farm Diary & Cost Calculator */}
      <div className="pt-2 grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            playSoundForButton(t.btnFarmDiary);
            onOpenAction('farm_diary');
          }}
          className="p-3.5 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-2xl flex items-center gap-2.5 text-stone-900 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <div className="p-2 bg-emerald-600 text-white rounded-xl">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div>{t.btnFarmDiary}</div>
            <div className="text-[10px] text-stone-600 font-normal">खते व फवारणी नोंद</div>
          </div>
        </button>

        <button
          onClick={() => {
            playSoundForButton(t.btnCostCalculator);
            onOpenAction('cost_calculator');
          }}
          className="p-3.5 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded-2xl flex items-center gap-2.5 text-stone-900 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <div className="p-2 bg-amber-600 text-white rounded-xl">
            <Calculator className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div>{t.btnCostCalculator}</div>
            <div className="text-[10px] text-stone-600 font-normal">एकरी खर्चाचा हिशोब</div>
          </div>
        </button>
      </div>
    </div>
  );
};
