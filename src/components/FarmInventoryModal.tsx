import React, { useState } from 'react';
import {
  X,
  Plus,
  Package,
  AlertTriangle,
  Check,
  Trash2,
  Minus,
  Layers,
  Sparkles,
  Archive
} from 'lucide-react';
import { InventoryItem, InventoryCategory } from '../types';

interface FarmInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onSaveItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export const FarmInventoryModal: React.FC<FarmInventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onSaveItem,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'all' | 'low_stock' | 'fertilizer' | 'feed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('fertilizer');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('बोरी / बॅग (Bags)');
  const [minThreshold, setMinThreshold] = useState<number>(2);
  const [expiryDate, setExpiryDate] = useState('');
  const [storageLocation, setStorageLocation] = useState('घरचे गोदाम');
  const [notes, setNotes] = useState('');

  // Handle Quick Adjust Quantity
  const handleAdjustQuantity = (item: InventoryItem, delta: number) => {
    const newQty = Math.max(0, Number(item.quantity || 0) + delta);
    onSaveItem({
      ...item,
      quantity: newQty,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || quantity === '') return;

    const newItem: InventoryItem = {
      id: `inv_${Date.now()}`,
      name: itemName.trim(),
      category,
      quantity: Number(quantity),
      unit: unit.trim() || 'नग',
      minThreshold: Number(minThreshold) || 1,
      expiryDate: expiryDate || undefined,
      storageLocation: storageLocation.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveItem(newItem);
    setItemName('');
    setQuantity('');
    setNotes('');
    setShowAddForm(false);
  };

  const filteredItems = inventory.filter((item) => {
    if (activeTab === 'low_stock') {
      return item.quantity <= (item.minThreshold || 1);
    }
    if (activeTab === 'fertilizer') return item.category === 'fertilizer';
    if (activeTab === 'feed') return item.category === 'animal_feed';
    return true;
  });

  const getCategoryEmoji = (cat: InventoryCategory) => {
    switch (cat) {
      case 'fertilizer':
        return '🧴';
      case 'seeds':
        return '🌱';
      case 'pesticide':
        return '🧪';
      case 'animal_feed':
        return '🌾';
      case 'veterinary_medicine':
        return '💊';
      case 'machinery_tools':
        return '🔧';
      default:
        return '📦';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-800 to-stone-900 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-700 flex items-center justify-center text-xl shadow-inner">
              📦
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                गोदामातील साठा (Farm Stock)
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                शिल्लक खते, बियाणे, औषधे व पशुखाद्याचा हिशोब ठेवा
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

        {/* Action Top Bar */}
        <div className="bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-bold text-stone-600">एकूण वस्तू: {inventory.length}</span>
            {inventory.some((i) => i.quantity <= (i.minThreshold || 1)) && (
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                <span>कमी साठा इशारा!</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नवीन वस्तू जोडा</span>
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <form onSubmit={handleSave} className="bg-stone-100 border-b border-stone-300 p-4 space-y-3">
            <h4 className="font-extrabold text-stone-900 text-xs">नवीन सामग्री / साठा जोडा</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700">सामग्रीचे नाव (Item Name):</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. युरिया, 10:26:26, सरकी पेंढ, सोयाबीन बियाणे"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">प्रकार (Category):</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-semibold"
                >
                  <option value="fertilizer">खत (Fertilizer)</option>
                  <option value="seeds">बियाणे (Seeds)</option>
                  <option value="pesticide">कीटकनाशक / बुरशीनाशक</option>
                  <option value="animal_feed">पशुखाद्य व पेंढ (Animal Feed)</option>
                  <option value="veterinary_medicine">पशु औषधे (Veterinary)</option>
                  <option value="machinery_tools">अवजारे व सुटे भाग</option>
                  <option value="other">इतर</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-stone-700">शिल्लक प्रमाण:</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 5"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">एकक (Unit):</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                >
                  <option value="बोरी / बॅग (Bags)">बोरी / बॅग (Bags)</option>
                  <option value="किलो (Kg)">किलो (Kg)</option>
                  <option value="लिटर (Liters)">लिटर (Liters)</option>
                  <option value="पाकीट (Packets)">पाकीट (Packets)</option>
                  <option value="नग (Units)">नग (Units)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">किमान मर्यादा (Alert):</label>
                <input
                  type="number"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700">मुदत संपण्याची तारीख (Expiry):</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">ठेवण्याची जागा (Storage):</label>
                <input
                  type="text"
                  placeholder="उदा. गोठ्यातील खोली, पत्र्याचे शेड"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                />
              </div>
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
                <span>साठा नोंदवा</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab Filter */}
        <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'all', label: `सर्व वस्तू (${inventory.length})` },
            { id: 'low_stock', label: '⚠️ कमी साठा' },
            { id: 'fertilizer', label: 'खते' },
            { id: 'feed', label: 'पशुखाद्य' },
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

        {/* Inventory list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300">
              <Archive className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-700 text-sm mt-2">साठ्याची नोंद नाही</p>
              <p className="text-xs text-stone-500 mt-0.5">गोदामात शिल्लक असलेली खते व खाद्य नोंदवा.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isLow = item.quantity <= (item.minThreshold || 1);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isLow
                      ? 'bg-amber-50/90 border-amber-400 shadow-2xs'
                      : 'bg-white border-stone-200 shadow-2xs hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl shrink-0 border border-stone-200">
                      {getCategoryEmoji(item.category)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        {isLow && (
                          <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-full">
                            कमी शिल्लक!
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-500 mt-0.5 flex flex-wrap gap-2">
                        <span>जागा: {item.storageLocation || 'गोदाम'}</span>
                        {item.expiryDate && (
                          <span className="text-stone-700 font-semibold">
                            • मुदत: {item.expiryDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & +/- Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-stone-100 rounded-xl border border-stone-300 p-0.5">
                      <button
                        type="button"
                        onClick={() => handleAdjustQuantity(item, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                        title="1 कमी करा"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="px-2 font-black text-stone-900 text-xs text-center min-w-[45px]">
                        {item.quantity} <span className="text-[10px] font-normal text-stone-500">{item.unit?.split(' ')[0]}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleAdjustQuantity(item, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                        title="1 वाढवा"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
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
