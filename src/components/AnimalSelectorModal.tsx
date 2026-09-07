import React from 'react';
import { X, Check, Plus, Heart, Sparkles } from 'lucide-react';
import { Animal } from '../types';

interface AnimalSelectorModalProps {
  isOpen: boolean;
  animals: Animal[];
  activeAnimalId?: string;
  onSelectAnimal: (animalId: string) => void;
  onAddNewAnimal: () => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const AnimalSelectorModal: React.FC<AnimalSelectorModalProps> = ({
  isOpen,
  animals,
  activeAnimalId,
  onSelectAnimal,
  onAddNewAnimal,
  onClose,
  title = 'जनावर निवडा (Select Animal)',
  subtitle = 'कोणत्या जनावरासाठी माहिती किंवा आरोग्य नोंदवायचे आहे?',
}) => {
  if (!isOpen) return null;

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

  const getSpeciesLabel = (type: string = '') => {
    switch (type.toLowerCase()) {
      case 'cow':
        return 'गाय (Cow)';
      case 'buffalo':
        return 'म्हैस (Buffalo)';
      case 'bull':
        return 'बैल (Bull)';
      case 'calf':
        return 'वासरू (Calf)';
      case 'goat':
        return 'शेळी (Goat)';
      case 'sheep':
        return 'मेंढी (Sheep)';
      case 'poultry':
        return 'कुक्कुटपालन (Poultry)';
      default:
        return 'इतर जनावर';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950 rounded-xl">
              <span className="text-xl">🐄</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">{title}</h3>
              <p className="text-xs text-amber-200 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-amber-800 rounded-xl text-amber-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between">
            <span>नोंदणीकृत जनावरे ({animals.length}):</span>
            <span className="text-[11px] text-amber-800 font-semibold">१ टॅप करून निवडा</span>
          </div>

          <div className="space-y-2">
            {animals.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-stone-300">
                <span className="text-4xl">🐮</span>
                <p className="text-sm font-bold text-stone-700 mt-2">अद्याप कोणतेही जनावर जोडलेले नाही</p>
                <p className="text-xs text-stone-500 mt-0.5">तुमच्या गाई, म्हशी किंवा शेळ्यांची नोंद करा.</p>
              </div>
            ) : (
              animals.map((a) => {
                const isSelected = a.id === activeAnimalId;
                const emoji = getAnimalEmoji(a.type);
                const speciesName = getSpeciesLabel(a.type);

                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      onSelectAnimal(a.id);
                      onClose();
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-600 shadow-sm ring-2 ring-amber-600/20'
                        : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shrink-0 border border-amber-200">
                        {emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-stone-900 text-sm truncate">
                            {a.name}
                          </h4>
                          {isSelected && (
                            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                              सध्या निवडलेले
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 mt-1">
                          <span className="font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {speciesName}
                          </span>
                          {a.breed && (
                            <span className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-stone-700">
                              जात: {a.breed}
                            </span>
                          )}
                          <span className="text-stone-500 font-medium">
                            वय: {a.ageYears} वर्षे
                          </span>
                        </div>

                        {a.pregnancyStatus === 'pregnant' && (
                          <div className="text-[11px] text-purple-700 font-bold mt-1 flex items-center gap-1">
                            <span>🤰 गाभण (Pregnant)</span>
                            {a.expectedDeliveryDate && (
                              <span className="text-stone-500 font-normal">
                                • प्रसूती: {a.expectedDeliveryDate}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1.5 rounded-xl hover:bg-amber-200">
                          निवडा
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Add Animal Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddNewAnimal();
              }}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन जनावर जोडा (Add New Animal)</span>
            </button>
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-[11px] text-stone-600 text-center">
          💡 जनावराचे आरोग्य, दुग्ध नोंद व लसीकरण हे निवडलेल्या जनावरासाठी स्वतंत्रपणे जतन केले जाते.
        </div>
      </div>
    </div>
  );
};
