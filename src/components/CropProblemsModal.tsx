import React, { useState } from 'react';
import { X, Bug, Search, Volume2, ShieldCheck, ChevronRight } from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../locales/translations';
import { CROPS_DATABASE } from '../data/agronomyKnowledge';
import { SpeechService } from '../utils/speech';

interface CropProblemsModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
  onSelectProblemForScan: (cropName: string) => void;
}

export const CropProblemsModal: React.FC<CropProblemsModalProps> = ({
  language,
  profile,
  onClose,
  onSelectProblemForScan,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];

  const [selectedCrop, setSelectedCrop] = useState<string>(activeField?.crop?.includes('कापूस') ? 'cotton' : 'cotton');
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number | null>(null);

  const currentCropData =
    CROPS_DATABASE.find((c) => c.id === selectedCrop) || CROPS_DATABASE[0];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-orange-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-900 rounded-xl">
              <Bug className="w-5 h-5 text-orange-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">{t.btnCropProblems}</h3>
              <p className="text-xs text-orange-100">रोग, कीड व अन्नद्रव्य कमतरता मार्गदर्शक</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-900 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Crop Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CROPS_DATABASE.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCrop(c.id);
                  setSelectedProblemIndex(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCrop === c.id
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                }`}
              >
                {c.name[language] || c.name.mr}
              </button>
            ))}
          </div>

          {/* List of Problems for Selected Crop */}
          <div className="space-y-3">
            {currentCropData.commonProblems.map((prob, idx) => {
              const isExpanded = selectedProblemIndex === idx;
              return (
                <div
                  key={prob.id || idx}
                  className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                    isExpanded ? 'border-orange-500 shadow-sm' : 'border-stone-200 hover:border-orange-300'
                  }`}
                >
                  <div
                    onClick={() => setSelectedProblemIndex(isExpanded ? null : idx)}
                    className="p-3.5 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {prob.type === 'pest' ? '🐛' : prob.type === 'disease' ? '🍄' : '🍂'}
                        </span>
                        <h4 className="font-extrabold text-stone-900 text-sm leading-snug">
                          {prob.title[language] || prob.title.mr}
                        </h4>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wide mt-0.5 block">
                        प्रकार: {prob.type === 'pest' ? 'कीड (Pest)' : prob.type === 'disease' ? 'बुरशीजन्य रोग' : 'अन्नद्रव्य कमतरता'}
                      </span>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isExpanded ? 'rotate-90 text-orange-600' : ''
                      }`}
                    />
                  </div>

                  {/* Expanded Problem Details */}
                  {isExpanded && (
                    <div className="p-3.5 pt-0 border-t border-stone-100 space-y-3 text-xs">
                      {/* Symptoms */}
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div className="font-bold text-stone-800 mb-1">लक्षणे (Symptoms):</div>
                        <p className="text-stone-700 leading-relaxed">
                          {prob.symptoms[language] || prob.symptoms.mr}
                        </p>
                      </div>

                      {/* Organic Treatment */}
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <div className="font-bold text-emerald-900 mb-1">
                          🌱 सेंद्रिय व जैविक उपाय:
                        </div>
                        <p className="text-emerald-950 font-medium leading-relaxed">
                          {prob.organicRemedy[language] || prob.organicRemedy.mr}
                        </p>
                      </div>

                      {/* Chemical Treatment */}
                      <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                        <div className="font-bold text-blue-900 mb-1">
                          🧴 रासायनिक उपाय व मात्रा:
                        </div>
                        <p className="text-blue-950 font-medium leading-relaxed">
                          {prob.chemicalRemedy[language] || prob.chemicalRemedy.mr}
                        </p>
                      </div>

                      {/* Read aloud & Scan CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            const text = `${prob.title[language] || prob.title.mr}. उपाय: ${prob.organicRemedy[language] || prob.organicRemedy.mr}`;
                            SpeechService.speak(text, language);
                          }}
                          className="text-xs text-stone-700 font-bold flex items-center gap-1 bg-stone-100 px-2.5 py-1.5 rounded-lg border border-stone-300 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-stone-700" />
                          <span>ऐका</span>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectProblemForScan(currentCropData.name[language] || currentCropData.name.mr);
                          }}
                          className="bg-orange-700 hover:bg-orange-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                        >
                          📸 फोटो काढून खात्री करा
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
