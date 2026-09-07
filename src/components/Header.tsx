import React from 'react';
import { Volume2, VolumeX, Globe, Wifi, WifiOff, Sparkles, User, MapPin } from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../locales/translations';
import { SpeechService } from '../utils/speech';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  profile: FarmerProfile;
  onOpenFarmModal: () => void;
  onOpenFieldSelector?: () => void;
  onStartDemoTour: () => void;
  isAudioMuted: boolean;
  onToggleAudioMute: () => void;
  isOffline: boolean;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  profile,
  onOpenFarmModal,
  onOpenFieldSelector,
  onStartDemoTour,
  isAudioMuted,
  onToggleAudioMute,
  isOffline,
  onOpenAuthModal,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  const handleVoiceGuidance = () => {
    if (isAudioMuted) {
      onToggleAudioMute();
      SpeechService.speak(`${t.appName}. ${t.appSubtitle}`, language);
    } else {
      SpeechService.stop();
      onToggleAudioMute();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-emerald-800 text-white shadow-md">
      {/* Top micro-bar: Connectivity & Firebase Cloud Status & 3-Min Demo Quick Link */}
      <div className="bg-emerald-950/80 px-3 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              <span>{t.offlineNotice}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-200">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.onlineNotice}</span>
              <span className="text-[10px] text-emerald-300/80 border-l border-emerald-700/60 pl-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Firebase: kishan-mitra-89160</span>
              </span>
            </span>
          )}
        </div>

        <button
          onClick={onStartDemoTour}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-stone-900 font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-stone-900 fill-stone-900 animate-pulse" />
          <span>{t.demoTourButton}</span>
        </button>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* App Title and Active Farmer Profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-2xl shadow-inner">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base leading-tight tracking-tight">{t.appName}</h1>
            </div>
            <button
              onClick={onOpenFieldSelector || onOpenFarmModal}
              className="flex items-center gap-1 text-xs text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-amber-300" />
              <span className="truncate max-w-[170px] font-medium">
                {activeField ? `${activeField.name} (${activeField.crop})` : profile.location.district}
              </span>
              <span className="text-[10px] bg-emerald-700/80 px-1 rounded text-emerald-100">बदला</span>
            </button>
          </div>
        </div>

        {/* Right Controls: User Profile / Auth, Audio Toggle & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Farmer Auth Button */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              title={profile.isFirebaseUser ? `लॉगिन: ${profile.name}` : 'शेतकरी लॉगिन'}
              className="flex items-center gap-1.5 bg-emerald-700/60 hover:bg-emerald-700 border border-emerald-600 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.name}
                  className="w-5 h-5 rounded-full border border-emerald-300"
                />
              ) : (
                <User className="w-4 h-4 text-emerald-200" />
              )}
              <span className="hidden sm:inline max-w-[80px] truncate text-emerald-100">
                {profile.isFirebaseUser ? profile.name.split(' ')[0] : 'लॉगिन'}
              </span>
            </button>
          )}
          {/* Audio Speaker Button for rural literacy accessibility */}
          <button
            onClick={handleVoiceGuidance}
            title={isAudioMuted ? t.readAloud : t.stopAudio}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isAudioMuted
                ? 'bg-emerald-700/60 border-emerald-600 text-emerald-200 hover:bg-emerald-700'
                : 'bg-amber-400 border-amber-300 text-stone-950 font-bold shadow-sm animate-pulse'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Multilingual Switcher: Large easily clickable pill */}
          <div className="flex bg-emerald-950/70 p-1 rounded-xl border border-emerald-700/70">
            {(['mr', 'hi', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onLanguageChange(lang);
                  SpeechService.stop();
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-white text-emerald-950 shadow-sm'
                    : 'text-emerald-100/80 hover:text-white'
                }`}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'Eng'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
