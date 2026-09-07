import React, { useState } from 'react';
import {
  X,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Layers,
  Check,
  Trash2,
  Filter,
  Mic,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart
} from 'lucide-react';
import { FinanceRecord, FinanceType, Field, Animal } from '../types';

interface FarmFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  finances: FinanceRecord[];
  onSaveRecord: (record: FinanceRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  fields: Field[];
  animals?: Animal[];
  activeFieldId?: string;
}

export const FarmFinanceModal: React.FC<FarmFinanceModalProps> = ({
  isOpen,
  onClose,
  finances,
  onSaveRecord,
  onDeleteRecord,
  fields,
  animals = [],
  activeFieldId,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'all' | 'expense' | 'income'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [recordType, setRecordType] = useState<FinanceType>('expense');
  const [category, setCategory] = useState<string>('fertilizer');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState<string>('बोरी (Bags)');
  const [buyerVendor, setBuyerVendor] = useState<string>('');
  const [targetType, setTargetType] = useState<'field' | 'animal' | 'general'>('field');
  const [targetId, setTargetId] = useState<string>(activeFieldId || fields[0]?.id || '');
  const [notes, setNotes] = useState<string>('');

  // Calculations
  const totalIncome = finances
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const totalExpense = finances
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const netProfit = totalIncome - totalExpense;

  // Simulate Voice Command
  const handleSimulateVoice = (phrase: string) => {
    if (phrase.includes('खत') && phrase.includes('2500')) {
      setRecordType('expense');
      setCategory('fertilizer');
      setAmount(2500);
      setTargetType('field');
      setNotes('युरिया / DAP खत खरेदी');
      setShowAddForm(true);
    } else if (phrase.includes('दूध') || phrase.includes('18 लिटर')) {
      setRecordType('income');
      setCategory('milk_sales');
      setAmount(720);
      setQuantity(18);
      setUnit('लिटर (Liters)');
      setTargetType('animal');
      setNotes('दैनिक दूध विक्री');
      setShowAddForm(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    let targetName = 'शेती';
    if (targetType === 'field') {
      const f = fields.find((x) => x.id === targetId);
      targetName = f ? `${f.name} (${f.crop})` : 'शेत';
    } else if (targetType === 'animal') {
      const a = animals.find((x) => x.id === targetId);
      targetName = a ? `${a.name} (${a.type})` : 'जनावर';
    }

    const newRecord: FinanceRecord = {
      id: `fin_${Date.now()}`,
      type: recordType,
      category,
      amount: Number(amount),
      date,
      quantity: quantity ? Number(quantity) : undefined,
      unit: unit || undefined,
      buyerOrVendor: buyerVendor.trim() || undefined,
      targetType,
      targetId: targetId || undefined,
      targetName,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveRecord(newRecord);
    setAmount('');
    setNotes('');
    setShowAddForm(false);
  };

  const filteredFinances = finances.filter((f) => {
    if (activeTab === 'expense') return f.type === 'expense';
    if (activeTab === 'income') return f.type === 'income';
    return true;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'seeds':
        return 'बियाणे (Seeds)';
      case 'fertilizer':
        return 'रासायनिक व सेंद्रिय खते';
      case 'pesticides':
        return 'कीटकनाशके व औषधे';
      case 'labour':
        return 'मजुरी (Labour)';
      case 'irrigation':
        return 'पाणी व वीज खर्च';
      case 'machinery':
        return 'ट्रॅक्टर व अवजारे भाडे';
      case 'transport':
        return 'वाहतूक खर्च';
      case 'animal_feed':
        return 'पशुखाद्य व पेंढ';
      case 'veterinary':
        return 'पशुवैद्यकीय उपचार व औषधे';
      case 'crop_sales':
        return 'पीक विक्री उत्पन्न';
      case 'milk_sales':
        return 'दूध विक्री उत्पन्न';
      case 'animal_sales':
        return 'पशू विक्री उत्पन्न';
      default:
        return 'इतर खर्च / उत्पन्न';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-950 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center text-xl font-bold shadow-inner">
              💰
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                शेती हिशोब (खर्च व उत्पन्न)
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                खते, मजुरी, बी-बियाणे खर्च आणि पीक-दुधाचे उत्पन्न नोंदवा
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-stone-700 rounded-xl text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profit & Loss Summary Cards */}
        <div className="bg-stone-100 p-3 border-b border-stone-200 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[10px] font-bold text-stone-500 uppercase">एकूण उत्पन्न</span>
            <div className="text-emerald-700 font-black text-sm sm:text-base flex items-center justify-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-4 h-4" />
              <span>₹{totalIncome.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[10px] font-bold text-stone-500 uppercase">एकूण खर्च</span>
            <div className="text-red-700 font-black text-sm sm:text-base flex items-center justify-center gap-0.5 mt-0.5">
              <ArrowDownRight className="w-4 h-4" />
              <span>₹{totalExpense.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[10px] font-bold text-stone-500 uppercase">निव्वळ नफा/तोटा</span>
            <div
              className={`font-black text-sm sm:text-base mt-0.5 ${
                netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              ₹{netProfit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Voice Bar */}
        <div className="bg-white border-b border-stone-200 px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-bold text-stone-600 shrink-0">बोलून नोंद करा:</span>
            <button
              onClick={() => handleSimulateVoice('आज खतासाठी 2500 रुपये खर्च झाले')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-stone-700 font-medium text-[11px] shrink-0 cursor-pointer"
            >
              🎤 "खतासाठी २५०० रु. खर्च..."
            </button>
            <button
              onClick={() => handleSimulateVoice('आज 18 लिटर दूध विकले')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-stone-700 font-medium text-[11px] shrink-0 cursor-pointer"
            >
              🎤 "१८ लिटर दूध विकले..."
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नोंद जोडा</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleSave} className="bg-stone-100 border-b border-stone-300 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRecordType('expense');
                  setCategory('fertilizer');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black cursor-pointer border ${
                  recordType === 'expense'
                    ? 'bg-red-700 text-white border-red-800 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                खर्च (Expense)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecordType('income');
                  setCategory('crop_sales');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black cursor-pointer border ${
                  recordType === 'income'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                उत्पन्न (Income)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700">रक्कम (₹ Amount):</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 2500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-black text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">तारीख:</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700">वर्गवारी (Category):</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                >
                  {recordType === 'expense' ? (
                    <>
                      <option value="fertilizer">खते (Fertilizers)</option>
                      <option value="seeds">बियाणे (Seeds)</option>
                      <option value="pesticides">औषधे व कीटकनाशके</option>
                      <option value="labour">मजुरी (Labour)</option>
                      <option value="irrigation">पाणी व वीज</option>
                      <option value="machinery">ट्रॅक्टर / अवजारे</option>
                      <option value="transport">वाहतूक</option>
                      <option value="animal_feed">पशुखाद्य व पेंढ</option>
                      <option value="veterinary">पशुवैद्यकीय उपचार</option>
                      <option value="other">इतर खर्च</option>
                    </>
                  ) : (
                    <>
                      <option value="crop_sales">पीक विक्री (Crop Sales)</option>
                      <option value="milk_sales">दूध विक्री (Milk Sales)</option>
                      <option value="animal_sales">पशू विक्री (Animal Sales)</option>
                      <option value="other">इतर उत्पन्न</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">कशासाठी (Target)?</label>
                <select
                  value={targetType}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setTargetType(t);
                    if (t === 'field') setTargetId(fields[0]?.id || '');
                    if (t === 'animal') setTargetId(animals[0]?.id || '');
                  }}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                >
                  <option value="field">विशिष्ट शेत (Field)</option>
                  <option value="animal">विशिष्ट जनावर (Animal)</option>
                  <option value="general">एकूण शेती</option>
                </select>
              </div>
            </div>

            {targetType === 'field' && fields.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-stone-700">शेत निवडा:</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-semibold"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.crop} ({f.acreage} {f.acreageUnit || 'एकर'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'animal' && animals.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-stone-700">जनावर निवडा:</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-semibold"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type} — {a.breed})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700">तपशील / नोंद (Notes):</label>
              <input
                type="text"
                placeholder="उदा. ५ पोती युरिया खरेदी किंवा व्यापारी नाव"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-1/3 bg-stone-300 hover:bg-stone-400 text-stone-800 font-bold py-2 rounded-xl text-xs cursor-pointer"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="w-2/3 bg-stone-900 hover:bg-stone-800 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>नोंद जतन करा</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab Filters */}
        <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'all', label: `सर्व नोंदी (${finances.length})` },
            { id: 'expense', label: 'केवळ खर्च' },
            { id: 'income', label: 'केवळ उत्पन्न' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Record list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredFinances.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300">
              <PieChart className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-700 text-sm mt-2">कोणतीही नोंद नाही</p>
              <p className="text-xs text-stone-500 mt-0.5">खते, मजुरी किंवा विक्रीची नोंद करण्यासाठी "नोंद जोडा" दाबा.</p>
            </div>
          ) : (
            filteredFinances.map((rec) => {
              const isIncome = rec.type === 'income';
              return (
                <div
                  key={rec.id}
                  className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between gap-3 hover:border-stone-400 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                        isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-stone-900 truncate">
                          {getCategoryLabel(rec.category)}
                        </h4>
                        {rec.targetName && (
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                            {rec.targetName}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                        <span>{rec.date}</span>
                        {rec.notes && <span>• {rec.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-sm font-black ${
                        isIncome ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {isIncome ? '+' : '-'}₹{rec.amount.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteRecord(rec.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
