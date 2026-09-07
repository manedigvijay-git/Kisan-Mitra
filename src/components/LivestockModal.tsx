import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Heart,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Milk,
  Wheat,
  Activity,
  Check,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Mic,
  Camera,
  Layers,
  Sparkles,
  Info,
  Bell,
  FileText,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  Animal,
  AnimalType,
  AnimalSex,
  PregnancyStatus,
  AnimalHealthCheck,
  AnimalVaccination,
  AnimalTreatment,
  AnimalFeedRecord,
  FeedType,
  MilkRecord,
  BreedingRecord,
  FarmTask,
} from '../types';

export type LivestockTabKey =
  | 'overview'
  | 'health'
  | 'milk'
  | 'vaccines'
  | 'feed'
  | 'breeding'
  | 'reminders'
  | 'records'
  | 'add_animal';

interface LivestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  animals: Animal[];
  activeAnimalId?: string;
  initialTab?: LivestockTabKey;
  onSelectActiveAnimal: (animalId: string) => void;
  onSaveAnimal: (animal: Animal) => void;
  onDeleteAnimal: (animalId: string) => void;
  onSaveHealthCheck?: (check: AnimalHealthCheck) => void;
  onSaveVaccination?: (vac: AnimalVaccination) => void;
  onSaveTreatment?: (treat: AnimalTreatment) => void;
  onSaveMilkRecord?: (record: MilkRecord) => void;
  onSaveFeedRecord?: (record: AnimalFeedRecord) => void;
  onSaveBreedingRecord?: (record: BreedingRecord) => void;
  onAddTask?: (task: FarmTask) => void;
  onOpenExpert?: () => void;
  language?: string;
}

export const LivestockModal: React.FC<LivestockModalProps> = ({
  isOpen,
  onClose,
  animals,
  activeAnimalId,
  initialTab = 'overview',
  onSelectActiveAnimal,
  onSaveAnimal,
  onDeleteAnimal,
  onSaveHealthCheck,
  onSaveVaccination,
  onSaveTreatment,
  onSaveMilkRecord,
  onSaveFeedRecord,
  onSaveBreedingRecord,
  onAddTask,
  onOpenExpert,
  language = 'mr',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<LivestockTabKey>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Active Animal
  const currentAnimal = animals.find((a) => a.id === activeAnimalId) || animals[0];

  // Forms state
  // New Animal Form
  const [newAnimalName, setNewAnimalName] = useState('');
  const [newAnimalTag, setNewAnimalTag] = useState('');
  const [newAnimalType, setNewAnimalType] = useState<AnimalType>('cow');
  const [newAnimalBreed, setNewAnimalBreed] = useState('Gir / गीर');
  const [newAnimalSex, setNewAnimalSex] = useState<AnimalSex>('female');
  const [newAnimalAge, setNewAnimalAge] = useState<number>(3);
  const [newAnimalDob, setNewAnimalDob] = useState<string>('');
  const [newAnimalWeight, setNewAnimalWeight] = useState<string>('');
  const [newAnimalPhoto, setNewAnimalPhoto] = useState<string | null>(null);
  const [newAnimalPregnancy, setNewAnimalPregnancy] = useState<PregnancyStatus>('not_pregnant');
  const [newAnimalNotes, setNewAnimalNotes] = useState('');

  // Treatment Form State (Treatment History)
  const [treatmentDate, setTreatmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [treatmentProblem, setTreatmentProblem] = useState('');
  const [treatmentVet, setTreatmentVet] = useState('');
  const [treatmentDesc, setTreatmentDesc] = useState('');
  const [treatmentMedicine, setTreatmentMedicine] = useState('');
  const [treatmentDose, setTreatmentDose] = useState('');
  const [treatmentDuration, setTreatmentDuration] = useState('');
  const [treatmentResult, setTreatmentResult] = useState<'recovered' | 'ongoing' | 'followup_needed'>('ongoing');
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [savedTreatmentSuccess, setSavedTreatmentSuccess] = useState(false);

  // Feed Form State
  const [feedDate, setFeedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [feedType, setFeedType] = useState<FeedType>('green_fodder');
  const [feedQuantity, setFeedQuantity] = useState<number>(15);
  const [feedUnit, setFeedUnit] = useState<string>('किलो / kg');
  const [feedTime, setFeedTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [feedNotes, setFeedNotes] = useState('');
  const [savedFeedSuccess, setSavedFeedSuccess] = useState(false);

  // Reminders Form State
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDueDate, setReminderDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reminderCategory, setReminderCategory] = useState<'animal_vaccination' | 'animal_health' | 'animal_breeding' | 'general'>('animal_health');
  const [reminderNotes, setReminderNotes] = useState('');
  const [savedReminderSuccess, setSavedReminderSuccess] = useState(false);

  // Health Check Form
  const [healthSymptoms, setHealthSymptoms] = useState('');
  const [healthDuration, setHealthDuration] = useState('१-२ दिवस');
  const [healthFeedIntake, setHealthFeedIntake] = useState('कमी झाले आहे (Reduced)');
  const [healthTemp, setHealthTemp] = useState('तपासले नाही');
  const [healthMilkDrop, setHealthMilkDrop] = useState('होय, थोडे कमी झाले आहे');
  const [healthPhoto, setHealthPhoto] = useState<string | null>(null);
  const [isAnalyzingHealth, setIsAnalyzingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<any>(null);

  // Milk Form
  const [morningMilk, setMorningMilk] = useState<number>(6);
  const [eveningMilk, setEveningMilk] = useState<number>(5);
  const [milkDate, setMilkDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [milkNotes, setMilkNotes] = useState('');
  const [savedMilkSuccess, setSavedMilkSuccess] = useState(false);

  // Vaccine Form
  const [vaccineName, setVaccineName] = useState('FMD / लाळ्या खुरकूत');
  const [vaccineDate, setVaccineDate] = useState(new Date().toISOString().split('T')[0]);
  const [vaccineNextDate, setVaccineNextDate] = useState('');
  const [vaccineVet, setVaccineVet] = useState('');
  const [savedVacSuccess, setSavedVacSuccess] = useState(false);

  // Breeding Form
  const [breedingEvent, setBreedingEvent] = useState<'heat_observed' | 'artificial_insemination' | 'pregnancy_confirmed'>('artificial_insemination');
  const [breedingDate, setBreedingDate] = useState(new Date().toISOString().split('T')[0]);
  const [sireDetails, setSireDetails] = useState('');

  // Calculate gestation delivery date
  const calculateDeliveryDate = (dateStr: string, type: AnimalType = 'cow') => {
    try {
      const d = new Date(dateStr);
      const days = type === 'buffalo' ? 310 : type === 'goat' || type === 'sheep' ? 150 : 283;
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Handle Add Animal
  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnimalName.trim()) return;

    const newAnimal: Animal = {
      id: `animal_${Date.now()}`,
      name: newAnimalName.trim(),
      tagNumber: newAnimalTag.trim() || undefined,
      type: newAnimalType,
      breed: newAnimalBreed.trim() || 'स्थानिक जात',
      sex: newAnimalSex,
      ageYears: Number(newAnimalAge) || 2,
      dateOfBirth: newAnimalDob || undefined,
      approximateWeightKg: newAnimalWeight ? Number(newAnimalWeight) : undefined,
      photoUrl: newAnimalPhoto || undefined,
      pregnancyStatus: newAnimalPregnancy,
      notes: newAnimalNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveAnimal(newAnimal);
    onSelectActiveAnimal(newAnimal.id);
    // Reset
    setNewAnimalName('');
    setNewAnimalTag('');
    setNewAnimalDob('');
    setNewAnimalWeight('');
    setNewAnimalPhoto(null);
    setNewAnimalNotes('');
    setActiveTab('overview');
  };

  // Handle Treatment Submit
  const handleSaveTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnimal || !treatmentProblem.trim()) return;

    const treatmentRecord: AnimalTreatment = {
      id: `treat_${Date.now()}`,
      animalId: currentAnimal.id,
      date: treatmentDate,
      healthProblem: treatmentProblem.trim(),
      veterinarian: treatmentVet.trim() || undefined,
      treatmentSummary: treatmentDesc.trim() || treatmentProblem.trim(),
      medicinePrescribed: treatmentMedicine.trim() || undefined,
      dose: treatmentDose.trim() || undefined,
      duration: treatmentDuration.trim() || undefined,
      result: treatmentResult,
      notes: treatmentNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveTreatment?.(treatmentRecord);
    setSavedTreatmentSuccess(true);
    setTimeout(() => setSavedTreatmentSuccess(false), 3000);
    setTreatmentProblem('');
    setTreatmentDesc('');
    setTreatmentMedicine('');
    setTreatmentDose('');
    setTreatmentDuration('');
    setTreatmentNotes('');
  };

  // Handle Feed Submit
  const handleSaveFeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnimal) return;

    const record: AnimalFeedRecord = {
      id: `feed_${Date.now()}`,
      animalId: currentAnimal.id,
      date: feedDate,
      feedType,
      quantity: Number(feedQuantity),
      unit: feedUnit,
      feedingTime: feedTime,
      notes: feedNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveFeedRecord?.(record);
    setSavedFeedSuccess(true);
    setTimeout(() => setSavedFeedSuccess(false), 3000);
    setFeedNotes('');
  };

  // Handle Reminder Submit
  const handleSaveReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnimal || !reminderTitle.trim()) return;

    const task: FarmTask = {
      id: `task_${Date.now()}`,
      title: `${currentAnimal.name}: ${reminderTitle.trim()}`,
      category: reminderCategory,
      targetType: 'animal',
      targetId: currentAnimal.id,
      targetName: currentAnimal.name,
      dueDate: reminderDueDate,
      repeat: 'none',
      completed: false,
      notes: reminderNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddTask?.(task);
    setSavedReminderSuccess(true);
    setTimeout(() => setSavedReminderSuccess(false), 3000);
    setReminderTitle('');
    setReminderNotes('');
  };

  // Quick symptom clicker
  const quickSymptoms = [
    'चारा खात नाही (Off-feed)',
    'अंग गरम / ताप आहे (Fever)',
    'पोट फुगले आहे (Bloat/अफरा)',
    'शेण पातळ किंवा दुर्गंधीयुक्त (Diarrhoea)',
    'दूध अचानक कमी झाले (Milk drop)',
    'खोकला किंवा धाप लागते (Respiratory)',
    'उठण्यास त्रास / अशक्तपणा (Downer/Weakness)',
    'कासेला सूज किंवा दुधात गाठी (Mastitis/कासदाह)',
  ];

  const handleAddSymptomChip = (chip: string) => {
    if (!healthSymptoms.includes(chip)) {
      setHealthSymptoms((prev) => (prev ? `${prev}, ${chip}` : chip));
    }
  };

  // Run AI Health Check
  const handleRunHealthCheck = async () => {
    if (!healthSymptoms.trim()) return;
    setIsAnalyzingHealth(true);
    setHealthResult(null);

    try {
      const response = await fetch('/api/ai/animal-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animal: currentAnimal,
          symptoms: healthSymptoms,
          duration: healthDuration,
          feedWaterIntake: healthFeedIntake,
          temperature: healthTemp,
          milkDrop: healthMilkDrop,
          imageBase64: healthPhoto,
          language,
        }),
      });

      const data = await response.json();
      if (data && data.healthCheck) {
        setHealthResult(data.healthCheck);

        // Save check
        if (currentAnimal) {
          const checkRecord: AnimalHealthCheck = {
            id: `chk_${Date.now()}`,
            animalId: currentAnimal.id,
            animalName: currentAnimal.name,
            animalType: currentAnimal.type,
            date: new Date().toISOString().split('T')[0],
            symptomsText: healthSymptoms,
            confidence: 'MODERATE',
            possibleCauses: data.healthCheck.possibleCauses || [],
            whatToCheck: data.healthCheck.whatToCheck || [],
            safeNextSteps: data.healthCheck.safeNextSteps || [],
            warningSigns: data.healthCheck.warningSigns || [],
            veterinaryHelpRecommended: true,
            isEmergency: Boolean(data.healthCheck.isEmergency),
            emergencyReason: data.healthCheck.emergencyReason,
            createdAt: new Date().toISOString(),
          };
          onSaveHealthCheck?.(checkRecord);
        }
      }
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setIsAnalyzingHealth(false);
    }
  };

  // Save Milk Record
  const handleSaveMilk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnimal) return;

    const total = Number(morningMilk || 0) + Number(eveningMilk || 0);
    const record: MilkRecord = {
      id: `milk_${Date.now()}`,
      animalId: currentAnimal.id,
      date: milkDate,
      morningLiters: Number(morningMilk),
      eveningLiters: Number(eveningMilk),
      totalDailyLiters: total,
      notes: milkNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveMilkRecord?.(record);
    setSavedMilkSuccess(true);
    setTimeout(() => setSavedMilkSuccess(false), 3000);
  };

  // Save Vaccine Record
  const handleSaveVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnimal) return;

    const nextDate = vaccineNextDate || calculateDeliveryDate(vaccineDate, 'cow');
    const record: AnimalVaccination = {
      id: `vac_${Date.now()}`,
      animalId: currentAnimal.id,
      vaccineName,
      dateAdministered: vaccineDate,
      nextDueDate: nextDate,
      veterinarian: vaccineVet.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveVaccination?.(record);

    // Auto-create calendar reminder task
    onAddTask?.({
      id: `task_vac_${Date.now()}`,
      title: `${currentAnimal.name} (${vaccineName}) पुढील लस आठवण`,
      category: 'animal_vaccination',
      targetType: 'animal',
      targetId: currentAnimal.id,
      targetName: currentAnimal.name,
      dueDate: nextDate,
      repeat: 'none',
      completed: false,
      notes: `डॉक्टर: ${vaccineVet || 'पशुवैद्यकीय दवाखाना'}`,
      createdAt: new Date().toISOString(),
    });

    setSavedVacSuccess(true);
    setTimeout(() => setSavedVacSuccess(false), 3000);
  };

  const getEmoji = (type: AnimalType = 'cow') => {
    switch (type) {
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

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/80 flex items-center justify-center text-2xl shadow-inner">
              🐄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                  गोपालन व पशुधन व्यवस्थापन
                </h2>
                <span className="bg-amber-600/60 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  {animals.length} जनावरे
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-0.5">
                आरोग्य तपासणी • दुग्ध नोंद • लसीकरण • प्रजोत्पादन
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-amber-700/60 rounded-xl text-amber-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Animal Quick Selector Ribbon */}
        {animals.length > 0 && (
          <div className="bg-amber-100/90 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-amber-900">सध्याचे निवडलेले जनावर:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {animals.map((a) => {
                const isSelected = a.id === currentAnimal?.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => onSelectActiveAnimal(a.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-amber-800 text-white shadow-sm ring-2 ring-amber-600'
                        : 'bg-white text-stone-700 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <span>{getEmoji(a.type)}</span>
                    <span>{a.name}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setActiveTab('add_animal')}
                className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-200 hover:bg-amber-300 text-amber-950 flex items-center gap-1 cursor-pointer border border-amber-300 shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>नवीन</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-stone-100 border-b border-stone-200 px-3 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>पशु माहिती</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'health'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>आरोग्य तपासणी</span>
          </button>

          <button
            onClick={() => setActiveTab('milk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'milk'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Milk className="w-3.5 h-3.5" />
            <span>दूध नोंद</span>
          </button>

          <button
            onClick={() => setActiveTab('vaccines')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'vaccines'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>लसीकरण</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'feed'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>चारा नियोजन</span>
          </button>

          <button
            onClick={() => setActiveTab('breeding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'breeding'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>प्रजोत्पादन</span>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'reminders'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>आठवण व कॅलेंडर</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'records'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>उपचार व नोंदी</span>
          </button>

          <button
            onClick={() => setActiveTab('add_animal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'add_animal'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-700 bg-stone-200/80 hover:bg-stone-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नवीन जोडा</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {currentAnimal ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl border border-amber-200">
                        {getEmoji(currentAnimal.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-stone-900">
                            {currentAnimal.name}
                          </h3>
                          {currentAnimal.tagNumber && (
                            <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                              टॅग: {currentAnimal.tagNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-600 mt-0.5 flex flex-wrap gap-2">
                          <span className="font-semibold text-amber-800">
                            {currentAnimal.type === 'cow'
                              ? 'गाय'
                              : currentAnimal.type === 'buffalo'
                              ? 'म्हैस'
                              : currentAnimal.type === 'bull'
                              ? 'बैल'
                              : currentAnimal.type === 'goat'
                              ? 'शेळी'
                              : 'पशू'}
                          </span>
                          <span>• जात: {currentAnimal.breed}</span>
                          <span>• वय: {currentAnimal.ageYears} वर्षे</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteAnimal(currentAnimal.id)}
                      className="text-stone-400 hover:text-red-600 p-1 text-xs font-semibold cursor-pointer"
                    >
                      हटवा
                    </button>
                  </div>

                  {/* Pregnancy Status Badge */}
                  {currentAnimal.pregnancyStatus === 'pregnant' ? (
                    <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-purple-900 font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🤰</span>
                        <span>गाभण स्थिती (Pregnant)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-purple-700">
                        अपेक्षित प्रसूती: {currentAnimal.expectedDeliveryDate || 'नोंद नाही'}
                      </span>
                    </div>
                  ) : currentAnimal.pregnancyStatus === 'in_heat' ? (
                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-2 text-xs text-rose-900 font-bold">
                      <span>🔥</span>
                      <span>माजावर आले आहे (In Heat) - कृत्रिम रेतन किंवा वीर्यदान तातडीने करा</span>
                    </div>
                  ) : null}

                  {/* Quick Action Cards inside Overview */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => setActiveTab('health')}
                      className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all cursor-pointer"
                    >
                      <div className="text-amber-800 font-bold text-xs flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4" />
                        <span>आरोग्य तपासणी</span>
                      </div>
                      <p className="text-[10px] text-stone-600 mt-1">चारा, ताप, खोकला व आजार तपासणी</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('milk')}
                      className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all cursor-pointer"
                    >
                      <div className="text-blue-800 font-bold text-xs flex items-center gap-1.5">
                        <Milk className="w-4 h-4" />
                        <span>आजचे दूध नोंदवा</span>
                      </div>
                      <p className="text-[10px] text-stone-600 mt-1">सकाळ + संध्याकाळ लिटर नोंद</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
                  <span className="text-4xl">🐮</span>
                  <h4 className="font-extrabold text-stone-800 text-sm mt-2">
                    तुमच्याकडे अजून कोणतेही जनावर जोडलेले नाही
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    गाय, म्हैस, शेळी किंवा इतर पशूंची नोंद करण्यासाठी खालील बटण दाबा.
                  </p>
                  <button
                    onClick={() => setActiveTab('add_animal')}
                    className="mt-4 bg-amber-800 hover:bg-amber-900 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                  >
                    + नवीन जनावर जोडा
                  </button>
                </div>
              )}

              {/* All Animals List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-stone-600 uppercase tracking-wider">
                  सर्व जनावरे ({animals.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {animals.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => onSelectActiveAnimal(a.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        a.id === currentAnimal?.id
                          ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/20'
                          : 'bg-white border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{getEmoji(a.type)}</span>
                        <div>
                          <div className="font-bold text-stone-900 text-xs">{a.name}</div>
                          <div className="text-[10px] text-stone-500">{a.breed} • {a.ageYears} वर्षे</div>
                        </div>
                      </div>
                      {a.id === currentAnimal?.id ? (
                        <span className="text-[10px] font-extrabold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                          सक्रिय
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-semibold">निवडा</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANIMAL HEALTH CHECK (Part 12 & 13) */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-stone-900 text-xs">
                    {currentAnimal?.name} साठी आरोग्य तपासणी
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    लक्षणे सांगा किंवा फोटो दाखवा. आमचे पशुवैद्यकीय विश्लेषण मार्गदर्शन करेल.
                  </p>
                </div>
                <span className="text-2xl">{getEmoji(currentAnimal?.type)}</span>
              </div>

              {/* Quick Symptom Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  लक्षणे निवडा (क्लिक करा):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickSymptoms.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleAddSymptomChip(chip)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-stone-800 text-[11px] font-semibold rounded-lg border border-stone-200 transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typed / Spoken Symptoms */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  सविस्तर लक्षणे (बोलून किंवा लिहून):
                </label>
                <textarea
                  value={healthSymptoms}
                  onChange={(e) => setHealthSymptoms(e.target.value)}
                  placeholder="उदा. माझी गाय २ दिवसांपासून चारा नीट खात नाही, रवंथ बंद आहे आणि सुस्त उभी आहे..."
                  rows={3}
                  className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-600 focus:outline-hidden"
                />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-700">किती दिवसांपासून?</label>
                  <select
                    value={healthDuration}
                    onChange={(e) => setHealthDuration(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                  >
                    <option value="आजपासून (Today)">आजपासून (Today)</option>
                    <option value="१-२ दिवस (1-2 days)">१-२ दिवस (1-2 days)</option>
                    <option value="३-४ दिवस (3-4 days)">३-४ दिवस (3-4 days)</option>
                    <option value="आठवडाभर (Week+)">आठवडाभर (Week+)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700">चारा व पाणी पिणे:</label>
                  <select
                    value={healthFeedIntake}
                    onChange={(e) => setHealthFeedIntake(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                  >
                    <option value="कमी झाले आहे (Reduced)">कमी झाले आहे (Reduced)</option>
                    <option value="पूर्ण बंद आहे (Stopped completely)">पूर्ण बंद आहे (Stopped completely)</option>
                    <option value="नेहमीसारखे आहे (Normal)">नेहमीसारखे आहे (Normal)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleRunHealthCheck}
                disabled={isAnalyzingHealth || !healthSymptoms.trim()}
                className="w-full bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
              >
                {isAnalyzingHealth ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>पशुवैद्यकीय विश्लेषण सुरू आहे...</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" />
                    <span>आरोग्य विश्लेषण करा (Check Health)</span>
                  </>
                )}
              </button>

              {/* AI Health Results */}
              {healthResult && (
                <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm space-y-3.5 animate-fadeIn">
                  {/* Emergency Alert Banner */}
                  {healthResult.isEmergency ? (
                    <div className="bg-red-600 text-white p-3.5 rounded-xl flex items-start gap-2.5 shadow-md">
                      <AlertTriangle className="w-6 h-6 shrink-0 text-amber-300 animate-pulse" />
                      <div>
                        <h4 className="font-black text-sm">🚨 तातडीचा पशुवैद्यकीय इशारा (Emergency)</h4>
                        <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
                          {healthResult.emergencyReason ||
                            'गंभीर लक्षणे आढळली आहेत. तात्काळ स्थानिक सरकारी पशुवैद्यकीय दवाखान्याशी संपर्क साधा!'}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={onOpenExpert}
                            className="bg-white text-red-700 font-extrabold text-[11px] px-3 py-1 rounded-lg cursor-pointer shadow-xs"
                          >
                            📞 डॉक्टर / कॉल सेंटर संपर्क
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Possible Causes */}
                  <div>
                    <h5 className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                      <span className="text-amber-700">●</span> संभाव्य कारणे (Possible Causes):
                    </h5>
                    <p className="text-[10px] text-stone-500 italic">
                      टीप: अनेक आजारांची लक्षणे सारखी असू शकतात, त्यामुळे प्रत्यक्ष तपासणी महत्त्वाची आहे.
                    </p>
                    <ul className="list-disc list-inside text-xs text-stone-700 space-y-1 mt-1 pl-1">
                      {healthResult.possibleCauses?.map((cause: string, i: number) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>

                  {/* What to check */}
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <h5 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                      <span>🔍</span> तुम्ही प्रत्यक्ष काय तपासावे?
                    </h5>
                    <ul className="text-xs text-stone-700 space-y-1 mt-1">
                      {healthResult.whatToCheck?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-stone-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Safe Next Steps */}
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <span>🌱</span> सुरक्षित प्राथमिक घरगुती काळजी (Safe Steps):
                    </h5>
                    <ul className="text-xs text-emerald-800 space-y-1 mt-1">
                      {healthResult.safeNextSteps?.map((step: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warning signs */}
                  {healthResult.warningSigns?.length > 0 && (
                    <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      <h5 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> धोक्याची लक्षणे (तात्काळ डॉक्टर बोलवा):
                      </h5>
                      <ul className="text-xs text-rose-800 space-y-1 mt-1">
                        {healthResult.warningSigns.map((w: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-600">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-[10px] text-stone-500 bg-stone-100 p-2 rounded-lg text-center">
                    ⚠️ केवळ फोटो किंवा वर्णनावरून १००% खात्रीशीर निदान करता येत नाही. गंभीर आजारात पशुवैद्यकांचा सल्ला अत्यावश्यक आहे.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MILK MANAGEMENT (Part 17) */}
          {activeTab === 'milk' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-blue-900 text-xs">
                    {currentAnimal?.name} — दैनिक दुग्ध नोंद
                  </h4>
                  <p className="text-[11px] text-blue-700">
                    दररोज सकाळी व संध्याकाळी काढलेले दूध नोंदवून हिशोब ठेवा.
                  </p>
                </div>
                <span className="text-2xl">🥛</span>
              </div>

              <form onSubmit={handleSaveMilk} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">तारीख:</label>
                    <input
                      type="date"
                      value={milkDate}
                      onChange={(e) => setMilkDate(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">एकूण दैनिक दूध:</label>
                    <div className="p-2 bg-blue-100 border border-blue-300 rounded-xl text-xs mt-1 font-extrabold text-blue-950">
                      {Number(morningMilk || 0) + Number(eveningMilk || 0)} लिटर
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">सकाळचे दूध (लिटर):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={morningMilk}
                      onChange={(e) => setMorningMilk(Number(e.target.value))}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">संध्याकाळचे दूध (लिटर):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={eveningMilk}
                      onChange={(e) => setEveningMilk(Number(e.target.value))}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">नोंद / फॅट (ऐच्छिक):</label>
                  <input
                    type="text"
                    placeholder="उदा. फॅट ४.५, पशुखाद्य बदलले"
                    value={milkNotes}
                    onChange={(e) => setMilkNotes(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                {savedMilkSuccess && (
                  <div className="p-2 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>दूध नोंद यशस्वीरित्या जतन केली गेली!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>दुधाची नोंद जतन करा (Save Milk Record)</span>
                </button>
              </form>

              {/* Milk Drop Advisor (Part 17 requirement) */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2">
                <h5 className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                  <span>💡</span> दूध कमी होण्याची प्रमुख कारणे (Why Milk Drops):
                </h5>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  १. <strong>चारा बदल किंवा पाण्याची कमतरता:</strong> जनावराला दिवसाला किमान ५०-६० लिटर स्वच्छ पाणी हवे.<br />
                  २. <strong>हवामानाचा ताण:</strong> अति उष्णतेमुळे दूध उत्पादन १५-२०% घटू शकते.<br />
                  ३. <strong>कासदाह (मॅस्टायटिस):</strong> कास कडक होणे किंवा दुधात गाठी येणे.<br />
                  ४. <strong>माजावर येणे:</strong> गाई माजावर आल्यावर तात्पुरते दूध कमी होते.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: VACCINES (Part 14) */}
          {activeTab === 'vaccines' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-xs">
                    {currentAnimal?.name} — लसीकरण नोंद (Vaccinations)
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    लस दिल्याची तारीख नोंदवा. पुढील लसीकरणाची आठवण आपोआप कॅलेंडरमध्ये जोडली जाईल.
                  </p>
                </div>
                <span className="text-2xl">💉</span>
              </div>

              <form onSubmit={handleSaveVaccine} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div>
                  <label className="text-xs font-bold text-stone-700">लसीचे नाव (Vaccine Name):</label>
                  <select
                    value={vaccineName}
                    onChange={(e) => setVaccineName(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1 font-semibold"
                  >
                    <option value="FMD / लाळ्या खुरकूत (Foot and Mouth Disease)">FMD / लाळ्या खुरकूत (Foot & Mouth)</option>
                    <option value="HS / घटसर्प (Haemorrhagic Septicaemia)">HS / घटसर्प (Haemorrhagic Septicaemia)</option>
                    <option value="BQ / फऱ्या (Black Quarter)">BQ / फऱ्या (Black Quarter)</option>
                    <option value="Brucellosis / ब्रुसेलोसिस (वासरू लस)">Brucellosis / ब्रुसेलोसिस</option>
                    <option value="Theileriosis / थायलेरिया">Theileriosis / थायलेरिया</option>
                    <option value="Deworming / जंतनाशक औषध">Deworming / जंतनाशक औषध</option>
                    <option value="इतर लस">इतर लस (Other)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">लस दिलेली तारीख:</label>
                    <input
                      type="date"
                      value={vaccineDate}
                      onChange={(e) => setVaccineDate(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">पुढील देय तारीख (Next Due):</label>
                    <input
                      type="date"
                      value={vaccineNextDate}
                      onChange={(e) => setVaccineNextDate(e.target.value)}
                      placeholder="उदा. ६ महिन्यांनंतर"
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">पशुवैद्यकीय डॉक्टर / दवाखाना:</label>
                  <input
                    type="text"
                    placeholder="उदा. डॉ. पाटील, प्राथमिक पशुवैद्यकीय दवाखाना"
                    value={vaccineVet}
                    onChange={(e) => setVaccineVet(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                {savedVacSuccess && (
                  <div className="p-2 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>लसीकरण नोंद झाली व पुढील तारखेची आठवण कॅलेंडरमध्ये नोंदवली गेली!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>लसीकरण नोंदवा आणि आठवण ठेवा</span>
                </button>
              </form>

              {/* Standard vaccination schedule advice */}
              <div className="bg-stone-100 p-3 rounded-2xl text-xs text-stone-700 space-y-1.5 border border-stone-200">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span>📅</span> शासकीय लसीकरण वेळापत्रक:
                </div>
                <div className="text-[11px] text-stone-600 leading-relaxed">
                  • <strong>घटसर्प (HS) व फऱ्या (BQ):</strong> पावसाळ्यापूर्वी (मे-जून) दरवर्षी द्यावी.<br />
                  • <strong>लाळ्या खुरकूत (FMD):</strong> वर्षातून दोनदा (सप्टेंबर व फेब्रुवारी-मार्च).<br />
                  • <strong>जंतनाशक:</strong> दर ३ ते ४ महिन्यांनी जंतांचे औषध पाजावे.
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FEED MANAGEMENT (Part 16) */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-amber-950 text-xs">
                    {currentAnimal?.name} — चारा व पोषण व्यवस्थापन (Feed Management)
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    संतुलित आहार: हिरवा चारा, कोरडा कडबा, पशुखाद्य व खनिज मिश्रण.
                  </p>
                </div>
                <span className="text-2xl">🌾</span>
              </div>

              {/* Feed Logging Form */}
              <form onSubmit={handleSaveFeedSubmit} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <h5 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <Wheat className="w-4 h-4 text-amber-700" />
                  <span>दैनिक चारा नोंदवा (Log Feed for {currentAnimal?.name}):</span>
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">तारीख:</label>
                    <input
                      type="date"
                      value={feedDate}
                      onChange={(e) => setFeedDate(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">वेळ (Time):</label>
                    <select
                      value={feedTime}
                      onChange={(e) => setFeedTime(e.target.value as any)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    >
                      <option value="morning">सकाळ (Morning)</option>
                      <option value="afternoon">दुपार (Afternoon)</option>
                      <option value="evening">संध्याकाळ (Evening)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">चाऱ्याचा प्रकार:</label>
                    <select
                      value={feedType}
                      onChange={(e) => setFeedType(e.target.value as FeedType)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    >
                      <option value="green_fodder">🌿 हिरवा चारा (नेपियर/मका)</option>
                      <option value="dry_fodder">🌾 कोरडा चारा / कडबा</option>
                      <option value="concentrate">🥣 पशुखाद्य / सरकी पेंड</option>
                      <option value="mineral_mixture">🧂 खनिज मिश्रण व मीठ</option>
                      <option value="silage">🌱 मका सायलेज (Silage)</option>
                      <option value="other">इतर खाद्य</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">प्रमाण (Quantity):</label>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={feedQuantity}
                        onChange={(e) => setFeedQuantity(Number(e.target.value))}
                        className="w-2/3 p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={feedUnit}
                        onChange={(e) => setFeedUnit(e.target.value)}
                        className="w-1/3 p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">विशेष टीप (ऐच्छिक):</label>
                  <input
                    type="text"
                    placeholder="उदा. चांगल्या प्रतीचा कडबा, पाणी भरपूर दिले"
                    value={feedNotes}
                    onChange={(e) => setFeedNotes(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                {savedFeedSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>चारा नोंद यशस्वीरित्या जतन झाली!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Wheat className="w-4 h-4" />
                  <span>चारा नोंद जतन करा (Save Feed Record)</span>
                </button>
              </form>

              {/* Feed History for Current Animal */}
              {currentAnimal?.feedRecords && currentAnimal.feedRecords.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                  <h5 className="font-bold text-xs text-stone-800">मागील चारा नोंदी ({currentAnimal.feedRecords.length}):</h5>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {currentAnimal.feedRecords.map((rec) => (
                      <div key={rec.id} className="p-2 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-stone-800">
                            {rec.feedType === 'green_fodder' ? '🌿 हिरवा चारा' : rec.feedType === 'dry_fodder' ? '🌾 कोरडा चारा' : rec.feedType === 'concentrate' ? '🥣 पशुखाद्य' : '🧂 पोषण'}
                          </span>
                          <span className="text-stone-500 text-[11px] ml-2">({rec.feedingTime === 'morning' ? 'सकाळ' : rec.feedingTime === 'afternoon' ? 'दुपार' : 'संध्याकाळ'})</span>
                          {rec.notes && <p className="text-[10px] text-stone-500">{rec.notes}</p>}
                        </div>
                        <div className="text-right font-extrabold text-amber-900">
                          {rec.quantity} {rec.unit}
                          <div className="text-[10px] text-stone-400 font-normal">{rec.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Diet Card */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <h5 className="font-bold text-xs text-stone-800">दुभत्या जनावराचा आदर्श दैनिक आहार (प्रति दिवस):</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900">🌿 हिरवा चारा:</span>
                    <p className="text-[11px] text-stone-600 mt-0.5">१५ ते २० किलो (नेपियर, मका, ल्युसर्न)</p>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900">🌾 कोरडा चारा:</span>
                    <p className="text-[11px] text-stone-600 mt-0.5">४ ते ५ किलो (ज्वारी कडबा, गव्हाचे काड)</p>
                  </div>
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900">🥣 पशुखाद्य (Concentrate):</span>
                    <p className="text-[11px] text-stone-600 mt-0.5">शरीर पोषणासाठी १.५ किलो + प्रति २.५ लिटर दुधामागे १ किलो</p>
                  </div>
                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="font-bold text-purple-900">🧂 खनिज मिश्रण व मीठ:</span>
                    <p className="text-[11px] text-stone-600 mt-0.5">५० ग्रॅम खनिज मिश्रण + ३० ग्रॅम मीठ दररोज</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BREEDING MANAGEMENT (Part 18) */}
          {activeTab === 'breeding' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-purple-950 text-xs">
                    {currentAnimal?.name} — प्रजोत्पादन व गाभण व्यवस्थापन
                  </h4>
                  <p className="text-[11px] text-purple-800">
                    माजाची तारीख, कृत्रिम रेतन व अपेक्षित प्रसूती तारखेची अचूक नोंद.
                  </p>
                </div>
                <span className="text-2xl">🤰</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">रेतन किंवा माज तारीख:</label>
                    <input
                      type="date"
                      value={breedingDate}
                      onChange={(e) => setBreedingDate(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">अपेक्षित प्रसूती तारीख:</label>
                    <div className="p-2 bg-purple-100 border border-purple-300 rounded-xl text-xs mt-1 font-extrabold text-purple-950">
                      {calculateDeliveryDate(breedingDate, currentAnimal?.type)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">वीर्य स्ट्रॉ / वळू तपशील (ऐच्छिक):</label>
                  <input
                    type="text"
                    placeholder="उदा. गीर वळू स्ट्रॉ क्र. १२४, BAIF AI केंद्र"
                    value={sireDetails}
                    onChange={(e) => setSireDetails(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!currentAnimal) return;
                    const expDate = calculateDeliveryDate(breedingDate, currentAnimal.type);
                    const updatedAnimal: Animal = {
                      ...currentAnimal,
                      pregnancyStatus: 'pregnant',
                      pregnancyDate: breedingDate,
                      expectedDeliveryDate: expDate,
                    };
                    onSaveAnimal(updatedAnimal);

                    // Auto-create calendar reminder for delivery and dry-off period
                    onAddTask?.({
                      id: `task_preg_${Date.now()}`,
                      title: `${currentAnimal.name} प्रसूती पूर्व तयारी व लक्ष ठेवा`,
                      category: 'animal_breeding',
                      targetType: 'animal',
                      targetId: currentAnimal.id,
                      targetName: currentAnimal.name,
                      dueDate: expDate,
                      repeat: 'none',
                      completed: false,
                      notes: `रेतन तारीख: ${breedingDate}, अपेक्षित प्रसूती`,
                      createdAt: new Date().toISOString(),
                    });

                    alert('प्रजोत्पादन नोंद झाली व अपेक्षित प्रसूतीची आठवण कॅलेंडरमध्ये जोडली गेली!');
                  }}
                  className="w-full bg-purple-800 hover:bg-purple-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Heart className="w-4 h-4" />
                  <span>गाभण नोंद जतन करा व प्रसूती आठवण लावा</span>
                </button>
              </div>

              {/* Gestation period table */}
              <div className="p-3 bg-stone-100 rounded-2xl text-[11px] text-stone-600 border border-stone-200">
                <strong>गर्भकाळ (Gestation Period):</strong><br />
                • गाय: २८० ते २८५ दिवस (~९ महिने ९ दिवस)<br />
                • म्हैस: ३०५ ते ३१० दिवस (~१० महिने १० दिवस)<br />
                • शेळी / मेंढी: १४८ ते १५२ दिवस (~५ महिने)
              </div>
            </div>
          )}

          {/* TAB: LIVESTOCK REMINDERS & CALENDAR (Part 21) */}
          {activeTab === 'reminders' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-amber-950 text-xs">
                    {currentAnimal?.name} — आठवण व वेळापत्रक (Reminders & Calendar)
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    लसीकरण, जंतनाशक, गाभण तपासणी व दैनंदिन कामांच्या स्वयंचलित आठवणी.
                  </p>
                </div>
                <span className="text-2xl">🔔</span>
              </div>

              {/* Add New Animal Reminder */}
              <form onSubmit={handleSaveReminderSubmit} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <h5 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-700" />
                  <span>नवीन आठवण जोडा (Add New Reminder):</span>
                </h5>

                <div>
                  <label className="text-xs font-bold text-stone-700">कामाचे / आठवणीचे नाव:</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. जंतनाशक औषध पाजणे, गाभण तपासणी, खूर छाटणी"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">तारीख (Due Date):</label>
                    <input
                      type="date"
                      required
                      value={reminderDueDate}
                      onChange={(e) => setReminderDueDate(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">प्रवर्ग (Category):</label>
                    <select
                      value={reminderCategory}
                      onChange={(e) => setReminderCategory(e.target.value as any)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    >
                      <option value="animal_health">🩺 आरोग्य तपासणी / औषध</option>
                      <option value="animal_vaccination">💉 लसीकरण (Vaccination)</option>
                      <option value="animal_breeding">🤰 गाभण / प्रसूती</option>
                      <option value="general">📋 इतर शेती काम</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">टीप (ऐच्छिक):</label>
                  <input
                    type="text"
                    placeholder="उदा. डॉ. पवार यांना सकाळी कॉल करावा"
                    value={reminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                {savedReminderSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>आठवण कॅलेंडरमध्ये यशस्वीरित्या जोडली गेली!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Bell className="w-4 h-4" />
                  <span>कॅलेंडरमध्ये आठवण ठेवा (Save Reminder)</span>
                </button>
              </form>

              {/* Standard Routine Checklist */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                <h5 className="font-bold text-xs text-stone-900">नियमित वेळापत्रक व शिफारशी:</h5>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">💊 जंतनाशक (Deworming)</div>
                      <div className="text-[10px] text-stone-500">दर ३ महिन्यांनी आलटून पालटून जंताचे औषध द्यावे</div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded-lg">दर ३ महिने</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">💉 घटसर्प व फऱ्या लस</div>
                      <div className="text-[10px] text-stone-500">पावसाळ्यापूर्वी मे महिन्यात शासकीय दवाखान्यातून</div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-1 rounded-lg">मे महिना</span>
                  </div>

                  {currentAnimal?.pregnancyStatus === 'pregnant' && currentAnimal.expectedDeliveryDate && (
                    <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-purple-900">🤰 अपेक्षित प्रसूती तारीख</div>
                        <div className="text-[10px] text-purple-700">प्रसूतीपूर्वी २ महिने आधी दूध काढणे थांबवावे (Dry period)</div>
                      </div>
                      <span className="text-[11px] font-extrabold text-purple-900">{currentAnimal.expectedDeliveryDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: VETERINARY TREATMENT RECORDS & IMMUTABLE HISTORY (Part 22) */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-blue-950 text-xs">
                    {currentAnimal?.name} — उपचार इतिहास व वैद्यकीय नोंदी
                  </h4>
                  <p className="text-[11px] text-blue-800">
                    पशुवैद्यकीय उपचार, आजारपण, औषधांची माहिती व संपूर्ण आरोग्य इतिहास.
                  </p>
                </div>
                <span className="text-2xl">📋</span>
              </div>

              {/* Safety notice on immutable records */}
              <div className="bg-stone-100 border border-stone-300 p-3 rounded-xl flex items-start gap-2 text-xs text-stone-700">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>महत्त्वाची सूचना:</strong> एकदा नोंदवलेला पशुवैद्यकीय उपचार इतिहास सुरक्षित राहतो व आपोआप बदलला जात नाही. यामुळे जनावराचा मागील औषधोपचार डॉक्टरांना अचूक दाखवता येतो.
                </p>
              </div>

              {/* New Treatment Entry Form */}
              <form onSubmit={handleSaveTreatmentSubmit} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <h5 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-700" />
                  <span>पशुवैद्यकीय उपचार नोंदवा (Record Veterinary Treatment):</span>
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">उपचार तारीख:</label>
                    <input
                      type="date"
                      required
                      value={treatmentDate}
                      onChange={(e) => setTreatmentDate(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">डॉक्टर / दवाखाना (Vet Name):</label>
                    <input
                      type="text"
                      placeholder="उदा. डॉ. शिंदे / शासकीय पशुवैद्यकीय दवाखाना"
                      value={treatmentVet}
                      onChange={(e) => setTreatmentVet(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">आरोग्य समस्या किंवा आजार (Health Problem):</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. पोटफुगी / कासदाह (Mastitis) / ताप"
                    value={treatmentProblem}
                    onChange={(e) => setTreatmentProblem(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">दिलेले औषध / गोळ्या / इंजेक्शन (Prescribed Medicine):</label>
                  <input
                    type="text"
                    placeholder="उदा. ब्लॉटोसिल सिरप, पॅरासिटामॉल गोळ्या (डॉक्टरांच्या सल्ल्यानुसार)"
                    value={treatmentMedicine}
                    onChange={(e) => setTreatmentMedicine(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">डोस व प्रमाण (Dose):</label>
                    <input
                      type="text"
                      placeholder="उदा. १०० मिली, २ गोळ्या"
                      value={treatmentDose}
                      onChange={(e) => setTreatmentDose(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700">कालावधी (Duration):</label>
                    <input
                      type="text"
                      placeholder="उदा. ३ दिवस, सकाळ-संध्याकाळ"
                      value={treatmentDuration}
                      onChange={(e) => setTreatmentDuration(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">उपचाराचा परिणाम / सद्यस्थिती (Result):</label>
                  <select
                    value={treatmentResult}
                    onChange={(e) => setTreatmentResult(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  >
                    <option value="recovered">पूर्णपणे बरे झाले (Recovered)</option>
                    <option value="ongoing">उपचार सुरू आहेत (Under Treatment)</option>
                    <option value="followup_needed">पुन्हा तपासणी आवश्यक (Follow-up Needed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">विशेष टीप (Notes):</label>
                  <textarea
                    rows={2}
                    placeholder="उदा. चारा हळूहळू सुरू करण्यास सांगितले, पाणी गरम करून दिले..."
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                {savedTreatmentSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>उपचार नोंद यशस्वीरित्या जतन झाली व इतिहासात नोंदवली गेली!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>उपचार नोंद जतन करा (Save Treatment Record)</span>
                </button>
              </form>

              {/* Treatment History List */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <h5 className="font-bold text-xs text-stone-900">
                  {currentAnimal?.name} चे मागील उपचार ({currentAnimal?.treatments?.length || 0}):
                </h5>

                {currentAnimal?.treatments && currentAnimal.treatments.length > 0 ? (
                  <div className="space-y-2">
                    {currentAnimal.treatments.map((treat) => (
                      <div key={treat.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-stone-900">{treat.healthProblem}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            treat.result === 'recovered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : treat.result === 'ongoing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {treat.result === 'recovered' ? 'बरे झाले' : treat.result === 'ongoing' ? 'उपचार सुरू' : 'तपासणी आवश्यक'}
                          </span>
                        </div>
                        {treat.veterinarian && (
                          <div className="text-stone-600 text-[11px]">पशुवैद्यक: {treat.veterinarian}</div>
                        )}
                        {treat.medicinePrescribed && (
                          <div className="text-blue-900 font-medium text-[11px]">औषध: {treat.medicinePrescribed} ({treat.dose || ''} {treat.duration || ''})</div>
                        )}
                        {treat.notes && <p className="text-stone-500 text-[10px]">{treat.notes}</p>}
                        <div className="text-[10px] text-stone-400 text-right">{treat.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic py-2">अद्याप कोणताही मागील उपचार नोंदवलेला नाही.</p>
                )}
              </div>

              {/* Health Checks Consultations History */}
              {currentAnimal?.healthChecks && currentAnimal.healthChecks.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h5 className="font-bold text-xs text-stone-900">
                    आरोग्य तपासणी व AI सल्ला इतिहास ({currentAnimal.healthChecks.length}):
                  </h5>
                  <div className="space-y-2">
                    {currentAnimal.healthChecks.map((hc) => (
                      <div key={hc.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">लक्षणे: {hc.symptoms}</span>
                          <span className="text-[10px] text-stone-500">{hc.date}</span>
                        </div>
                        {hc.possibleIssues && hc.possibleIssues.length > 0 && (
                          <div className="text-amber-900 text-[11px]">संभाव्य आजार: {hc.possibleIssues.join(', ')}</div>
                        )}
                        {hc.urgency && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block ${
                            hc.urgency === 'emergency' ? 'bg-red-100 text-red-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {hc.urgency === 'emergency' ? 'तातडीने पशुवैद्यकास दाखवा' : 'सामान्य सल्ला'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ADD NEW ANIMAL (Part 11) */}
          {activeTab === 'add_animal' && (
            <form onSubmit={handleCreateAnimal} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3.5">
              <h4 className="font-extrabold text-stone-900 text-sm">
                नवीन जनावर जोडा (Add New Cattle/Animal)
              </h4>

              <div>
                <label className="text-xs font-bold text-stone-700">जनावराचा प्रकार (Animal Type):</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {[
                    { id: 'cow', label: 'गाय (Cow)', icon: '🐄' },
                    { id: 'buffalo', label: 'म्हैस (Buffalo)', icon: '🐃' },
                    { id: 'bull', label: 'बैल (Bull)', icon: '🐂' },
                    { id: 'calf', label: 'वासरू (Calf)', icon: '🐮' },
                    { id: 'goat', label: 'शेळी (Goat)', icon: '🐐' },
                    { id: 'sheep', label: 'मेंढी (Sheep)', icon: '🐑' },
                    { id: 'poultry', label: 'कोंबडी (Poultry)', icon: '🐔' },
                    { id: 'other', label: 'इतर (Other)', icon: '🐾' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNewAnimalType(item.id as AnimalType)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        newAnimalType === item.id
                          ? 'bg-amber-100 border-amber-600 font-extrabold text-amber-900 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-xl">{item.icon}</div>
                      <div className="text-[10px] mt-0.5">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700">जनावराचे नाव (Name):</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. गौरी, कपिला, राणी"
                    value={newAnimalName}
                    onChange={(e) => setNewAnimalName(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">टॅग / बिल्ला क्रमांक (Tag No.):</label>
                  <input
                    type="text"
                    placeholder="उदा. 104589321"
                    value={newAnimalTag}
                    onChange={(e) => setNewAnimalTag(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700">जात (Breed):</label>
                  <input
                    type="text"
                    placeholder="उदा. गीर, मुऱ्हा, खिल्लार"
                    value={newAnimalBreed}
                    onChange={(e) => setNewAnimalBreed(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">वय (वर्षे):</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={newAnimalAge}
                    onChange={(e) => setNewAnimalAge(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">लिंग (Sex):</label>
                  <select
                    value={newAnimalSex}
                    onChange={(e) => setNewAnimalSex(e.target.value as AnimalSex)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  >
                    <option value="female">मादी (Female)</option>
                    <option value="male">नर (Male)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700">जन्मतारीख जर ठाऊक असेल (DOB):</label>
                  <input
                    type="date"
                    value={newAnimalDob}
                    onChange={(e) => setNewAnimalDob(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">अंदाजे वजन (Approx Weight in kg):</label>
                  <input
                    type="number"
                    placeholder="उदा. ३५०"
                    value={newAnimalWeight}
                    onChange={(e) => setNewAnimalWeight(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                  />
                </div>
              </div>

              {/* Animal Photo Upload */}
              <div>
                <label className="text-xs font-bold text-stone-700">जनावराचा फोटो (Photo):</label>
                <div className="mt-1 flex items-center gap-3">
                  {newAnimalPhoto ? (
                    <div className="relative">
                      <img
                        src={newAnimalPhoto}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-stone-300 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setNewAnimalPhoto(null)}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer border border-stone-300 transition-colors">
                      <Camera className="w-4 h-4 text-stone-600" />
                      <span>फोटो निवडा / कॅमेरा</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setNewAnimalPhoto(ev.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">गाभण स्थिती (Pregnancy Status):</label>
                <select
                  value={newAnimalPregnancy}
                  onChange={(e) => setNewAnimalPregnancy(e.target.value as PregnancyStatus)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                >
                  <option value="not_pregnant">गाभण नाही (Not Pregnant)</option>
                  <option value="pregnant">गाभण आहे (Pregnant)</option>
                  <option value="in_heat">माजावर आहे (In Heat)</option>
                  <option value="recently_delivered">नुकतीच विलेली (Recently Delivered)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">इतर विशेष नोंद (Notes):</label>
                <textarea
                  rows={2}
                  placeholder="उदा. खरेदी किंमत, शिंगांचे स्वरूप किंवा सवयी..."
                  value={newAnimalNotes}
                  onChange={(e) => setNewAnimalNotes(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs mt-1"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="w-1/3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-amber-800 hover:bg-amber-900 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>जनावर नोंदवा (Save Animal)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
