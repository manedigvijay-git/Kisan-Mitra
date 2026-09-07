import React from 'react';
import { X, Check, Plus, Sprout, MapPin, ChevronRight, Layers } from 'lucide-react';
import { Field } from '../types';

interface FieldSelectorModalProps {
  isOpen: boolean;
  fields: Field[];
  activeFieldId: string;
  onSelectField: (fieldId: string) => void;
  onAddNewField: () => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const FieldSelectorModal: React.FC<FieldSelectorModalProps> = ({
  isOpen,
  fields,
  activeFieldId,
  onSelectField,
  onAddNewField,
  onClose,
  title = 'शेत निवडा (Select Field)',
  subtitle = 'कोणत्या शेतासाठी माहिती पाहायची किंवा नोंदवायची आहे?',
}) => {
  if (!isOpen) return null;

  const getCropEmoji = (cropName: string = '') => {
    const lower = cropName.toLowerCase();
    if (lower.includes('ऊस') || lower.includes('sugar')) return '🎋';
    if (lower.includes('कांदा') || lower.includes('onion')) return '🧅';
    if (lower.includes('सोयाबीन') || lower.includes('soy')) return '🌱';
    if (lower.includes('गहू') || lower.includes('wheat')) return '🌾';
    if (lower.includes('कापूस') || lower.includes('cotton')) return '☁️';
    if (lower.includes('तूर') || lower.includes('pigeon')) return '🌿';
    if (lower.includes('मका') || lower.includes('maize') || lower.includes('corn')) return '🌽';
    if (lower.includes('टोमॅटो') || lower.includes('tomato')) return '🍅';
    if (lower.includes('डाळिंब') || lower.includes('pom')) return '🍎';
    return '🌱';
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900 rounded-xl">
              <Layers className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">{title}</h3>
              <p className="text-xs text-emerald-200 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-xl text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between">
            <span>उपलब्ध शेते ({fields.length}):</span>
            <span className="text-[11px] text-emerald-700 font-semibold">१ टॅप करून निवडा</span>
          </div>

          <div className="space-y-2">
            {fields.map((f, index) => {
              const isSelected = f.id === activeFieldId;
              const emoji = getCropEmoji(f.crop);

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelectField(f.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-600 shadow-sm ring-2 ring-emerald-600/20'
                      : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl shrink-0 border border-stone-200">
                      {emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-stone-900 text-sm truncate">
                          {f.name || `Field ${index + 1}`}
                        </h4>
                        {isSelected && (
                          <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full shrink-0">
                            सध्या सक्रिय
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 truncate font-medium">
                        <span className="text-emerald-900 font-bold">{f.crop}</span> • {f.acreage} {f.acreageUnit || 'एकर'}
                        {f.cropStage ? ` • ${f.cropStage.split('/')[0]}` : ''}
                      </p>
                      {f.soilType && (
                        <p className="text-[11px] text-stone-500 truncate">
                          माती: {f.soilType.split('(')[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add Field Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNewField();
            }}
            className="w-full mt-2 py-3 px-4 bg-lime-100 hover:bg-lime-200 border-2 border-dashed border-lime-500 text-lime-900 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-lime-700" />
            <span>+ नवीन शेत जोडा (Add New Field)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs cursor-pointer"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
