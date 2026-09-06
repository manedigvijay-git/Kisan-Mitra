import React, { useState } from 'react';
import { X, Calculator, IndianRupee, Plus, RefreshCw, Volume2 } from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../locales/translations';
import { SpeechService } from '../utils/speech';

interface CostCalculatorModalProps {
  language: Language;
  profile: FarmerProfile;
  onClose: () => void;
}

interface CostItem {
  id: string;
  name: string;
  category: 'fertilizer' | 'spray' | 'seed' | 'labor' | 'other';
  quantity: number;
  unit: string;
  ratePerUnit: number;
}

export const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  language,
  profile,
  onClose,
}) => {
  const t = translations[language];
  const activeField = profile.fields.find((f) => f.id === profile.activeFieldId) || profile.fields[0];
  const acreage = activeField?.acreage || 4;

  const [items, setItems] = useState<CostItem[]>([
    { id: '1', name: 'डीएपी (DAP 18:46:0)', category: 'fertilizer', quantity: 2, unit: 'बॅग (५०kg)', ratePerUnit: 1350 },
    { id: '2', name: 'युरिया (Neem Coated Urea)', category: 'fertilizer', quantity: 3, unit: 'बॅग (४५kg)', ratePerUnit: 266 },
    { id: '3', name: 'कॅल्शियम नायट्रेट (15.5:0:0)', category: 'fertilizer', quantity: 1, unit: 'बॅग (२५kg)', ratePerUnit: 1650 },
    { id: '4', name: 'थ्रिप्स/तुडतुडे कीटकनाशक (Acetamiprid)', category: 'spray', quantity: 2, unit: 'पॅक (१००g)', ratePerUnit: 350 },
    { id: '5', name: 'निंबोळी अर्क (Neem Oil 10000 ppm)', category: 'spray', quantity: 1, unit: 'लिटर', ratePerUnit: 600 },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('बॅग');
  const [newItemRate, setNewItemRate] = useState('');

  const totalCost = items.reduce((acc, item) => acc + item.quantity * item.ratePerUnit, 0);
  const costPerAcre = acreage > 0 ? Math.round(totalCost / acreage) : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemRate) return;

    setItems((prev) => [
      ...prev,
      {
        id: `cost_${Date.now()}`,
        name: newItemName.trim(),
        category: 'fertilizer',
        quantity: parseFloat(newItemQty) || 1,
        unit: newItemUnit,
        ratePerUnit: parseFloat(newItemRate) || 0,
      },
    ]);

    setNewItemName('');
    setNewItemRate('');
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-amber-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-900 rounded-xl">
              <Calculator className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">{t.btnCostCalculator}</h3>
              <p className="text-xs text-amber-100">
                {activeField?.name} ({acreage} एकर क्षेत्र)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-900 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Total & Per-Acre Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                एकूण खत व औषध खर्च (Total Input Cost)
              </span>
              <div className="text-2xl font-black mt-0.5">₹{totalCost.toLocaleString('en-IN')}</div>
            </div>

            <div className="text-right bg-black/20 p-2.5 rounded-xl border border-white/20">
              <span className="text-[10px] text-amber-200 uppercase font-bold block">
                प्रति एकर खर्च ({acreage} एकर)
              </span>
              <span className="text-base font-black text-amber-100">
                ₹{costPerAcre.toLocaleString('en-IN')} / एकर
              </span>
            </div>
          </div>

          {/* Quick Add Item Form */}
          <form
            onSubmit={handleAddItem}
            className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2 text-xs"
          >
            <div className="font-bold text-stone-800">नवीन खत किंवा फवारणी खर्च जोडा:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="खताचे नाव"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="p-2 border border-stone-300 rounded-lg sm:col-span-2 font-medium"
              />
              <input
                type="number"
                placeholder="प्रमाण (Qty)"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                className="p-2 border border-stone-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="दर प्रति बॅग/नग (₹)"
                value={newItemRate}
                onChange={(e) => setNewItemRate(e.target.value)}
                className="p-2 border border-stone-300 rounded-lg font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 rounded-xl cursor-pointer"
            >
              + खर्चाची नोंद जोडा
            </button>
          </form>

          {/* Item List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-stone-700 tracking-wider">
              नोंदवलेले घटक ({items.length}):
            </h4>
            {items.map((item) => {
              const subtotal = item.quantity * item.ratePerUnit;
              return (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-extrabold text-stone-900">{item.name}</div>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      {item.quantity} {item.unit} × ₹{item.ratePerUnit}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-stone-900 text-sm">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-rose-600 text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
