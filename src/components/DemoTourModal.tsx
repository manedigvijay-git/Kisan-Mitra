import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { SpeechService } from '../utils/speech';

interface DemoTourModalProps {
  language: Language;
  onClose: () => void;
  onTriggerAction: (actionId: string, sampleId?: string, query?: string) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  language,
  onClose,
  onTriggerAction,
}) => {
  const t = translations[language];
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      stepNumber: 1,
      title: '१. शेत व पिकाची नोंद (My Farm)',
      subtitle: 'माझे शेत: गट क्र. ४२ मध्ये कापूस पिकाची ४ एकर नोंद',
      description:
        'अ‍ॅप सुरू होताच शेतकऱ्याचे शेत, क्षेत्र, पिकाची अवस्था (फुलोरा) आणि मातीचा प्रकार स्पष्ट दिसतो.',
      badge: 'माझे शेत',
      actionId: 'my_farm',
      btnLabel: 'शेत पहा',
    },
    {
      stepNumber: 2,
      title: '२. माती परीक्षण अहवाल (Soil Test Report)',
      subtitle: 'सामू ८.३ (क्षारयुक्त) व सेंद्रिय कर्ब ०.३८% (अतिशय कमी)',
      description:
        'माती आरोग्य पत्रिका समजण्यास सोप्या मराठीत रूपांतरित होते. सेंद्रिय कर्ब कमी असल्याने शेणखत व सेंद्रिय खतांचा सल्ला दिला जातो.',
      badge: 'माती आरोग्य',
      actionId: 'check_soil',
      sampleId: 'black_soil_high_ph',
      btnLabel: 'माती अहवाल पहा',
    },
    {
      stepNumber: 3,
      title: '३. खताचे पाकीट स्कॅनिंग (Fertilizer OCR)',
      subtitle: 'कॅल्शियम नायट्रेट (15.5:0:0 + 18.8% Ca) पाकीट वाचले',
      description:
        'कॅमेरा खताच्या पाकिटावरील नाव, NPK प्रमाण आणि घटक अचूक ओळखतो. शेतकरी हवे असल्यास हाताने बदलही करू शकतो.',
      badge: 'खत स्कॅनर',
      actionId: 'check_fertilizer',
      sampleId: 'calcium_nitrate',
      btnLabel: 'खत तपासा',
    },
    {
      stepNumber: 4,
      title: '४. धोकादायक खत सुसंगतता शोधणे (Safety Engine)',
      subtitle: 'डीएपी आणि कॅल्शियम नायट्रेट एकत्र दिल्यास धोका!',
      description:
        'आधी शेतात डीएपी (फॉस्फरस) दिल्याने, कॅल्शियम नायट्रेट एकत्र आल्यास गाळ बनतो व दोन्ही खते वाया जातात. अ‍ॅप तात्काळ "वापर करू नका" इशारा देते.',
      badge: 'कृषी सुरक्षा',
      actionId: 'check_fertilizer',
      sampleId: 'calcium_nitrate',
      btnLabel: 'धोकादायक कॉम्बिनेशन पहा',
    },
    {
      stepNumber: 5,
      title: '५. आजारी पानाचा फोटो स्कॅन (Sick Leaf Analysis)',
      subtitle: 'कापसाच्या पानावर थ्रिप्स व तुडतुड्यांचा प्रादुर्भाव',
      description:
        'पानाच्या कडा वाटीसारख्या वळलेल्या फोटोवरून AI रोग व कीड ओळखतो.',
      badge: 'पीक स्कॅन',
      actionId: 'scan_crop',
      sampleId: 'cotton_leaf_curling',
      btnLabel: 'आजारी पान स्कॅन करा',
    },
    {
      stepNumber: 6,
      title: '६. AI खात्रीची पातळी (Confidence Meter)',
      subtitle: '८८% निश्चितता - उच्च विश्वासार्हता (High Confidence)',
      description:
        'अ‍ॅप कधीही खोटे आश्वासन देत नाही. लक्षणे स्पष्ट असल्यास हिरवा बिल्ला आणि कारण स्पष्ट केले जाते.',
      badge: 'पारदर्शकता',
      actionId: 'scan_crop',
      sampleId: 'cotton_leaf_curling',
      btnLabel: 'निश्चितता पातळी पहा',
    },
    {
      stepNumber: 7,
      title: '७. सेंद्रिय व रासायनिक सुरक्षित उपाय (Solutions)',
      subtitle: 'प्रथम ५% निंबोळी अर्क, नंतर ॲसिटामिप्रीड योग्य मात्रेत',
      description:
        'शेतकऱ्याला घरगुती जैविक उपाय आणि रासायनिक औषधांची पाणी व पंपाच्या हिशोबाने अचूक मात्रा दिली जाते.',
      badge: 'सल्ला',
      actionId: 'scan_crop',
      sampleId: 'cotton_leaf_curling',
      btnLabel: 'उपाय पहा',
    },
    {
      stepNumber: 8,
      title: '८. शेती डायरीत नोंद (Farm Diary Logging)',
      subtitle: 'फवारणी व खताची नोंद एका टॅपमध्ये जतन',
      description:
        'तपासलेली समस्या व उपाय थेट शेती डायरीत जमा होतात, ज्यामुळे खर्चाचा व कामांचा कायमचा हिशोब राहतो.',
      badge: 'डायरी',
      actionId: 'farm_diary',
      btnLabel: 'शेती डायरी उघडा',
    },
    {
      stepNumber: 9,
      title: '९. पीक रोग व कीड मार्गदर्शन (Crop Problems)',
      subtitle: 'रोग निदानाचा सविस्तर माहिती कोश',
      description:
        'पिकांवरील विविध रोग, त्यांची लक्षणे व जैविक आणि रासायनिक उपाय योजना पहा.',
      badge: 'माहिती कोश',
      actionId: 'crop_problems',
      btnLabel: 'रोग मार्गदर्शन पहा',
    },
    {
      stepNumber: 10,
      title: '१०. कृषी तज्ञ थेट संपर्क (Expert Advice)',
      subtitle: 'कृषी विद्यापीठ व तज्ञांशी थेट संपर्क',
      description:
        'अडचणीच्या वेळी तज्ञांचा मोफत सल्ला घ्या व पिकांचे नुकसान वाचवा.',
      badge: 'तज्ञ सल्ला',
      actionId: 'ask_expert',
      btnLabel: 'तज्ञांशी संपर्क साधा',
    },
    {
      stepNumber: 11,
      title: '११. बोलून प्रश्न विचारणे (Voice Assistant)',
      subtitle: '"माझ्या कापसाची पाने पिवळी का पडत आहेत?"',
      description:
        'शेतकरी टाइप न करता आपल्या भाषेत बोलून विचारू शकतो. कृषी मित्र आवाज ऐकून आवाजातच उत्तर देतो.',
      badge: 'व्हॉइस असिस्टंट',
      actionId: 'ask_voice',
      query: 'माझ्या कापसाची पाने पिवळी का पडत आहेत?',
      btnLabel: 'आवाजात विचारा',
    },
    {
      stepNumber: 12,
      title: '१२. एकरी खत व औषध खर्चाचा हिशोब (Cost Summary)',
      subtitle: 'डीएपी + युरिया + औषधे = ₹१,८१० प्रति एकर',
      description:
        'शेतकऱ्याला त्याच्या संपूर्ण हंगामातील खर्चाचा पारदर्शक ताळेबंद मिळतो.',
      badge: 'खर्च कॅल्क्युलेटर',
      actionId: 'cost_calculator',
      btnLabel: 'खर्च हिशोब पहा',
    },
    {
      stepNumber: 13,
      title: '१३. तज्ज्ञांशी थेट संपर्क (Expert Escalation)',
      subtitle: 'शंका असल्यास १८००-१८०-१५५१ किसान कॉल सेंटर',
      description:
        'जेव्हा लक्षणे संशयास्पद असतात, तेव्हा अ‍ॅप शेतकऱ्याला थेट शास्त्रज्ञांशी व KVK शी फोन किंवा व्हॉट्सअ‍ॅपवर जोडते.',
      badge: 'तज्ज्ञ सहाय्य',
      actionId: 'ask_expert',
      btnLabel: 'तज्ज्ञ संपर्क पहा',
    },
  ];

  const current = steps[currentStep];

  const handleStepAction = () => {
    SpeechService.stop();
    onClose();
    onTriggerAction(current.actionId, current.sampleId, current.query);
  };

  const handleReadStep = () => {
    const text = `${current.title}. ${current.subtitle}. ${current.description}`;
    SpeechService.speak(text, language);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-amber-400 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-stone-950 fill-stone-950 animate-bounce" />
            <div>
              <h3 className="font-black text-base leading-snug">
                ३ मिनिटांची प्रत्यक्ष प्रात्यक्षिक फेरी (3-Min Demo)
              </h3>
              <p className="text-xs font-semibold text-stone-900">
                पायरी {current.stepNumber} / १३
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-800/20 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-stone-950" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="bg-stone-200 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-2 rounded-full transition-all shrink-0 cursor-pointer ${
                i === currentStep
                  ? 'w-6 bg-amber-600'
                  : i < currentStep
                  ? 'w-2 bg-emerald-600'
                  : 'w-2 bg-stone-400'
              }`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-stone-900">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-1 rounded-full border border-amber-300">
              {current.badge}
            </span>
            <button
              onClick={handleReadStep}
              className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center gap-1 text-xs font-bold"
            >
              <Volume2 className="w-4 h-4 text-stone-900" />
              <span>ऐका</span>
            </button>
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-stone-950 leading-tight">
              {current.title}
            </h4>
            <p className="text-sm font-bold text-amber-800 mt-1">{current.subtitle}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed shadow-xs">
            {current.description}
          </div>

          {/* Interactive Trigger Button */}
          <button
            onClick={handleStepAction}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-4 rounded-2xl text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{current.btnLabel} (थेट तपासा)</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="p-3 bg-stone-200/80 border-t border-stone-300 flex items-center justify-between">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="px-3 py-2 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border border-stone-300"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>मागे</span>
          </button>

          <span className="text-xs font-bold text-stone-600">
            {currentStep + 1} पैकी १३
          </span>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span>पुढील पायरी</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>पूर्ण झाले</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
