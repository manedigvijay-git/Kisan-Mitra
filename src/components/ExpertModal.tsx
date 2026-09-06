import React from 'react';
import { X, PhoneCall, MessageCircle, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../locales/translations';

interface ExpertModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
}

export const ExpertModal: React.FC<ExpertModalProps> = ({
  language,
  profile,
  onClose,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  const handleKisanCallCenter = () => {
    window.location.href = 'tel:18001801551';
  };

  const handleWhatsAppEscalation = () => {
    const message = encodeURIComponent(
      `नमस्कार कृषी तज्ज्ञ, मी शेतकरी ${profile.name}, गाव ${profile.location.village}, जि. ${profile.location.district}. माझ्या ${activeField?.crop} पिकावर रोग किंवा खताविषयी समस्या आहे. कृपया मार्गदर्शन करावे.`
    );
    // WhatsApp deep link
    window.open(`https://wa.me/9118001801551?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-800 rounded-xl">
              <PhoneCall className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">{t.expertTitle}</h3>
              <p className="text-xs text-rose-100">शासकीय व कृषी विज्ञान केंद्र सहाय्यता</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Trust Banner */}
          <div className="bg-amber-50 border-2 border-amber-400 p-3.5 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wide">
                अज्ञातात रासायनिक औषधे मारू नका
              </h4>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                जेव्हा AI ची खात्री कमी असते किंवा समस्या गुंतागुंतीची असते, तेव्हा फसवणूक व पिकाचे नुकसान टाळण्यासाठी थेट कृषी शास्त्रज्ञांचा सल्ला घ्या.
              </p>
            </div>
          </div>

          {/* Kisan Call Center Card */}
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  भारत सरकार • मोफत सेवा (Toll Free)
                </span>
                <h4 className="text-base font-black text-stone-900 mt-1">
                  किसान कॉल सेंटर (Kisan Call Center)
                </h4>
                <p className="text-xs text-stone-500">
                  सकाळी ६ ते रात्री १० • आपल्या स्थानिक मराठी / हिंदी भाषेत
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <span className="text-lg font-black text-emerald-800 tracking-wider">
                1800-180-1551
              </span>
              <button
                onClick={handleKisanCallCenter}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>कॉल लावा</span>
              </button>
            </div>
          </div>

          {/* Local KVK / Agronomist WhatsApp */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 bg-green-100 px-2 py-0.5 rounded">
                  व्हॉट्सअ‍ॅप सहाय्य (WhatsApp Case)
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1">
                  स्थानिक कृषी विज्ञान केंद्र (KVK {profile.location.district})
                </h4>
                <p className="text-xs text-stone-500">
                  पिकाचा फोटो पाठवून थेट शास्त्रज्ञांना प्रश्न विचारा
                </p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppEscalation}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>व्हॉट्सअ‍ॅपवर फोटो व समस्या पाठवा</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
