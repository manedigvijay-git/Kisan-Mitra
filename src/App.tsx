import React, { useState, useEffect } from 'react';
import {
  Camera,
  FlaskConical,
  Mic,
  BookOpen,
  Home,
  Loader2,
} from 'lucide-react';
import {
  Language,
  FarmerProfile,
  WeatherData,
  FarmDiaryEntry,
  Animal,
  FarmTask,
  FinanceRecord,
  InventoryItem,
  AnimalHealthCheck,
  AnimalVaccination,
  AnimalTreatment,
  AnimalFeedRecord,
  MilkRecord,
  BreedingRecord,
} from './types';
import { translations } from './locales/translations';
import { auth, FarmDataSyncService, getRedirectResult } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CropScannerModal } from './components/CropScannerModal';
import { FertilizerScannerModal } from './components/FertilizerScannerModal';
import { SoilReportModal } from './components/SoilReportModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { MyFarmModal } from './components/MyFarmModal';
import { CropProblemsModal } from './components/CropProblemsModal';
import { FarmDiaryModal } from './components/FarmDiaryModal';
import { CostCalculatorModal } from './components/CostCalculatorModal';
import { ExpertModal } from './components/ExpertModal';
import { DemoTourModal } from './components/DemoTourModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { FieldSelectorModal } from './components/FieldSelectorModal';
import { AnimalSelectorModal } from './components/AnimalSelectorModal';
import { LivestockModal } from './components/LivestockModal';
import { FarmingCalendarModal } from './components/FarmingCalendarModal';
import { FarmFinanceModal } from './components/FarmFinanceModal';
import { FarmInventoryModal } from './components/FarmInventoryModal';

const DEFAULT_ANIMALS: Animal[] = [
  {
    id: 'animal_1',
    name: 'गौरी (Gauri)',
    type: 'cow',
    breed: 'गीर (Gir)',
    ageYears: 4,
    tagNumber: 'MH-12-8821',
    pregnancyStatus: 'none',
    lactationStage: 'lactating',
    dailyMilkLiters: 12,
    healthRecords: [
      {
        id: 'health_1',
        animalId: 'animal_1',
        date: '2025-02-15',
        symptoms: ['डोळे व नाकातून सौम्य पाणी'],
        notes: 'तापमान सामान्य, चारा व्यवस्थित खात आहे.',
        severity: 'mild',
        recommendedNextStep: 'स्वच्छ कोमट पाणी द्या, गोठा कोरडा ठेवा.',
      },
    ],
    vaccinations: [
      {
        id: 'vac_1',
        animalId: 'animal_1',
        vaccineName: 'FMD (लाळ्या खुरकूत)',
        administeredDate: '2024-11-10',
        nextDueDate: '2025-05-10',
        notes: 'शासकीय शिबिरात लस टोचली',
      },
      {
        id: 'vac_2',
        animalId: 'animal_1',
        vaccineName: 'HS (घटसर्प)',
        administeredDate: '2024-06-15',
        nextDueDate: '2025-06-15',
      },
    ],
    milkRecords: [
      {
        id: 'milk_1',
        animalId: 'animal_1',
        date: new Date().toISOString().split('T')[0],
        morningLiters: 6.5,
        eveningLiters: 5.5,
        fatPercentage: 4.2,
        snfPercentage: 8.6,
      },
    ],
    notes: 'शांत स्वभावाची, दर्जेदार दूध उत्पादन.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'animal_2',
    name: 'लक्ष्मी (Lakshmi)',
    type: 'buffalo',
    breed: 'मुऱ्हा (Murrah)',
    ageYears: 5,
    tagNumber: 'MH-12-9042',
    pregnancyStatus: 'pregnant',
    inseminationDate: '2024-09-15',
    expectedDeliveryDate: '2025-07-25',
    lactationStage: 'dry',
    dailyMilkLiters: 0,
    healthRecords: [],
    vaccinations: [
      {
        id: 'vac_3',
        animalId: 'animal_2',
        vaccineName: 'FMD (लाळ्या खुरकूत)',
        administeredDate: '2024-11-10',
        nextDueDate: '2025-05-10',
      },
    ],
    milkRecords: [],
    notes: 'गाभण आहे, विशेष खुराक व चारा सुरू आहे.',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_TASKS: FarmTask[] = [
  {
    id: 'task_1',
    title: 'ऊस शेतात १३:००:४५ खत सोडणे',
    category: 'fertilizer',
    dueDate: new Date().toISOString().split('T')[0],
    isCompleted: false,
    priority: 'high',
    notes: 'ड्रीप द्वारे ४ किलो प्रति एकर',
  },
  {
    id: 'task_2',
    title: 'गौरी गाय लाळ्या खुरकूत लस बूस्टर',
    category: 'vaccination',
    dueDate: '2025-05-10',
    isCompleted: false,
    priority: 'medium',
    animalId: 'animal_1',
    notes: 'पशुवैद्यकीय दवाखान्यात संपर्क करणे',
  },
];

const DEFAULT_FINANCES: FinanceRecord[] = [
  {
    id: 'fin_1',
    type: 'expense',
    category: 'fertilizer',
    amount: 3200,
    date: new Date().toISOString().split('T')[0],
    title: 'युरिया व डीएपी खत खरेदी (२ गोणी)',
  },
  {
    id: 'fin_2',
    type: 'income',
    category: 'crop_sale',
    amount: 14500,
    date: new Date().toISOString().split('T')[0],
    title: 'सोयाबीन विक्री (स्थानिक बाजार समिती)',
  },
  {
    id: 'fin_3',
    type: 'income',
    category: 'dairy_sale',
    amount: 4800,
    date: new Date().toISOString().split('T')[0],
    title: 'डेअरी दूध बिल (८ दिवस)',
  },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_1',
    name: 'युरिया (Urea 46% N)',
    category: 'fertilizer',
    quantity: 2,
    unit: 'बोरी / बॅग (Bags)',
    minimumThreshold: 3,
    purchaseDate: '2025-02-01',
    expiryDate: '2026-02-01',
    notes: '४५ किलो गोणी',
  },
  {
    id: 'inv_2',
    name: 'सरकी पेंढ (पशुखाद्य)',
    category: 'cattle_feed',
    quantity: 5,
    unit: 'बोरी / बॅग (Bags)',
    minimumThreshold: 2,
    purchaseDate: '2025-02-10',
    notes: 'गाईंसाठी पौष्टिक खुराक',
  },
  {
    id: 'inv_3',
    name: 'क्लोरोपायरीफॉस २०% ईसी',
    category: 'pesticide',
    quantity: 1,
    unit: 'लिटर (Liters)',
    minimumThreshold: 2,
    purchaseDate: '2024-12-15',
    expiryDate: '2026-12-15',
    notes: 'कीड नियंत्रणासाठी',
  },
];

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('kisan_lang') as Language) || 'mr';
  });

  // Authentication State: NULL until verified by Firebase Auth
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<FarmDiaryEntry[]>([]);

  // Smart Farm & Livestock Management States
  const [animals, setAnimals] = useState<Animal[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_animals');
      return saved ? JSON.parse(saved) : DEFAULT_ANIMALS;
    } catch {
      return DEFAULT_ANIMALS;
    }
  });
  const [activeAnimalId, setActiveAnimalId] = useState<string>('animal_1');

  const [tasks, setTasks] = useState<FarmTask[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [finances, setFinances] = useState<FinanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_finances');
      return saved ? JSON.parse(saved) : DEFAULT_FINANCES;
    } catch {
      return DEFAULT_FINANCES;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_inventory');
      return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
    } catch {
      return DEFAULT_INVENTORY;
    }
  });

  // Deep link or action parameter pending login
  const [pendingAction, setPendingAction] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('action') || params.get('modal') || null;
    } catch {
      return null;
    }
  });

  // System states
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Active Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [authInitialTab, setAuthInitialTab] = useState<'google' | 'phone' | 'email'>('google');
  const [modalSampleId, setModalSampleId] = useState<string | undefined>(undefined);
  const [modalQuery, setModalQuery] = useState<string | undefined>(undefined);
  const [livestockInitialTab, setLivestockInitialTab] = useState<string>('overview');

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Firebase Auth listener and user profile loading
  useEffect(() => {
    let unsubFields: (() => void) | null = null;
    let unsubDiary: (() => void) | null = null;
    let unsubAnimals: (() => void) | null = null;
    let unsubTasks: (() => void) | null = null;
    let unsubFinances: (() => void) | null = null;
    let unsubInventory: (() => void) | null = null;

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('Google Sign-in via redirect successful:', result.user.displayName);
        }
      })
      .catch((err) => {
        console.warn('Redirect auth check notice:', err);
      });

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up existing subscriptions
      if (unsubFields) { unsubFields(); unsubFields = null; }
      if (unsubDiary) { unsubDiary(); unsubDiary = null; }
      if (unsubAnimals) { unsubAnimals(); unsubAnimals = null; }
      if (unsubTasks) { unsubTasks(); unsubTasks = null; }
      if (unsubFinances) { unsubFinances(); unsubFinances = null; }
      if (unsubInventory) { unsubInventory(); unsubInventory = null; }

      if (!firebaseUser) {
        // User is LOGGED OUT
        setProfile(null);
        setDiaryEntries([]);
        localStorage.removeItem('kisan_profile');
        localStorage.removeItem('kisan_diary');
        setIsAuthChecking(false);
        return;
      }

      // User is LOGGED IN with Firebase UID
      const uid = firebaseUser.uid;
      try {
        const docData = await FarmDataSyncService.getUserProfile(uid);

        const isProfileComplete = Boolean(
          docData && (
            docData.profileCompleted === true ||
            (docData.district && docData.village) ||
            (docData.location?.district && docData.location?.village)
          )
        );

        if (isProfileComplete && docData) {
          // Profile exists and is complete
          const loadedLocation = docData.location || {
            village: docData.village || '',
            taluka: docData.taluka || '',
            district: docData.district || 'सातारा',
            state: docData.state || 'Maharashtra',
            latitude: docData.latitude || docData.lat || 17.68,
            longitude: docData.longitude || docData.lon || 74.00,
          };

          const loadedProfile: FarmerProfile = {
            id: uid,
            uid: uid,
            email: firebaseUser.email || docData.email || undefined,
            photoURL: firebaseUser.photoURL || docData.photoURL || undefined,
            isFirebaseUser: true,
            profileCompleted: true,
            name: docData.name || firebaseUser.displayName || 'शेतकरी मित्र',
            phoneNumber: docData.phoneNumber || firebaseUser.phoneNumber || '',
            language: docData.language || language,
            location: loadedLocation,
            activeFieldId: docData.activeFieldId || '',
            fields: docData.fields || [],
          };

          setProfile(loadedProfile);

          // Realtime subscriptions
          unsubFields = FarmDataSyncService.subscribeFields(uid, (remoteFields) => {
            if (remoteFields) {
              setProfile((prev) => (prev ? {
                ...prev,
                fields: remoteFields,
                activeFieldId: remoteFields.some((f) => f.id === prev.activeFieldId)
                  ? prev.activeFieldId
                  : remoteFields[0]?.id || '',
              } : null));
            }
          });

          unsubDiary = FarmDataSyncService.subscribeDiary(uid, (remoteEntries) => {
            if (remoteEntries) {
              setDiaryEntries(remoteEntries);
            }
          });

          unsubAnimals = FarmDataSyncService.subscribeAnimals(uid, (remoteAnimals) => {
            if (remoteAnimals && remoteAnimals.length > 0) {
              setAnimals(remoteAnimals);
              setActiveAnimalId((prev) =>
                remoteAnimals.some((a) => a.id === prev) ? prev : remoteAnimals[0].id
              );
            }
          });

          unsubTasks = FarmDataSyncService.subscribeTasks(uid, (remoteTasks) => {
            if (remoteTasks) {
              setTasks(remoteTasks);
            }
          });

          unsubFinances = FarmDataSyncService.subscribeFinances(uid, (remoteFinances) => {
            if (remoteFinances) {
              setFinances(remoteFinances);
            }
          });

          unsubInventory = FarmDataSyncService.subscribeInventory(uid, (remoteInv) => {
            if (remoteInv) {
              setInventory(remoteInv);
            }
          });

          // Check deep link pending action
          if (pendingAction) {
            setActiveModal(pendingAction);
            setPendingAction(null);
          }
        } else {
          // Profile incomplete or doesn't exist yet → Farmer Onboarding
          const incompleteProfile: FarmerProfile = {
            id: uid,
            uid: uid,
            email: firebaseUser.email || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            isFirebaseUser: true,
            profileCompleted: false,
            name: firebaseUser.displayName || '',
            phoneNumber: firebaseUser.phoneNumber || '',
            language: language,
            location: {
              village: '',
              taluka: '',
              district: 'सातारा',
              state: 'Maharashtra',
              latitude: 17.68,
              longitude: 74.00,
            },
            activeFieldId: '',
            fields: [],
          };
          setProfile(incompleteProfile);
          setActiveModal('onboarding');
        }
      } catch (err) {
        console.warn('Error loading user profile:', err);
      } finally {
        setIsAuthChecking(false);
      }
    });

    return () => {
      if (unsubFields) unsubFields();
      if (unsubDiary) unsubDiary();
      if (unsubAnimals) unsubAnimals();
      if (unsubTasks) unsubTasks();
      if (unsubFinances) unsubFinances();
      if (unsubInventory) unsubInventory();
      unsubscribeAuth();
    };
  }, []);

  // Sync language and offline data
  useEffect(() => {
    localStorage.setItem('kisan_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('kisan_animals', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('kisan_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kisan_finances', JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    localStorage.setItem('kisan_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Fetch weather data when profile location is available
  useEffect(() => {
    if (!profile?.location) return;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `/api/weather?lat=${profile.location.latitude || 20.03}&lon=${profile.location.longitude || 78.53}&language=${language}`
        );
        const data = await res.json();
        if (data.weather) {
          setWeather(data.weather);
        }
      } catch (err) {
        console.warn('Weather fetch error:', err);
      }
    };
    fetchWeather();
  }, [language, profile?.location?.latitude, profile?.location?.longitude]);

  // Action handlers
  const handleOpenAction = (actionId: string, sampleId?: string, query?: string) => {
    if (actionId === 'livestock') {
      setLivestockInitialTab(sampleId || 'overview');
      setActiveModal('livestock');
      return;
    }
    setModalSampleId(sampleId);
    setModalQuery(query);
    setActiveModal(actionId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setModalSampleId(undefined);
    setModalQuery(undefined);
  };

  const handleSaveToDiary = (entry: { title: string; description: string; cost?: number; photoUrl?: string }) => {
    if (!profile?.uid) return;
    const newEntry: FarmDiaryEntry = {
      id: `diary_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fieldId: profile.activeFieldId || 'field_1',
      activityType: 'problem',
      title: entry.title,
      description: entry.description,
      cost: entry.cost,
      photoUrl: entry.photoUrl,
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);
    FarmDataSyncService.saveDiaryEntry(profile.uid, newEntry).catch((err) =>
      console.warn('Sync diary entry notice:', err)
    );
  };

  const handleSaveSoilToFarm = (soilSummary: string) => {
    if (!profile?.uid) return;
    setProfile((prev) => {
      if (!prev) return null;
      const updatedFields = prev.fields.map((f) =>
        f.id === prev.activeFieldId ? { ...f, soilHealthSummary: soilSummary } : f
      );
      const updatedField = updatedFields.find((f) => f.id === prev.activeFieldId);
      if (updatedField && prev.uid) {
        FarmDataSyncService.saveField(prev.uid, updatedField).catch((err) =>
          console.warn('Sync field notice:', err)
        );
      }
      return {
        ...prev,
        fields: updatedFields,
      };
    });
  };

  const handleSaveAnimal = (animal: Animal) => {
    setAnimals((prev) => {
      const exists = prev.some((a) => a.id === animal.id);
      return exists ? prev.map((a) => (a.id === animal.id ? animal : a)) : [animal, ...prev];
    });
    if (profile?.uid) {
      FarmDataSyncService.saveAnimal(profile.uid, animal).catch((err) =>
        console.warn('Sync animal error:', err)
      );
    }
  };

  const handleDeleteAnimal = (animalId: string) => {
    setAnimals((prev) => prev.filter((a) => a.id !== animalId));
    if (activeAnimalId === animalId) {
      setActiveAnimalId(animals.find((a) => a.id !== animalId)?.id || '');
    }
    if (profile?.uid) {
      FarmDataSyncService.deleteAnimal(profile.uid, animalId).catch((err) =>
        console.warn('Delete animal error:', err)
      );
    }
  };

  const handleSaveTask = (task: FarmTask) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists ? prev.map((t) => (t.id === task.id ? task : t)) : [task, ...prev];
    });
    if (profile?.uid) {
      FarmDataSyncService.saveTask(profile.uid, task).catch((err) =>
        console.warn('Sync task error:', err)
      );
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (profile?.uid) {
      FarmDataSyncService.deleteTask(profile.uid, taskId).catch((err) =>
        console.warn('Delete task error:', err)
      );
    }
  };

  const handleSaveFinanceRecord = (record: FinanceRecord) => {
    setFinances((prev) => {
      const exists = prev.some((r) => r.id === record.id);
      return exists ? prev.map((r) => (r.id === record.id ? record : r)) : [record, ...prev];
    });
    if (profile?.uid) {
      FarmDataSyncService.saveFinanceRecord(profile.uid, record).catch((err) =>
        console.warn('Sync finance error:', err)
      );
    }
  };

  const handleDeleteFinanceRecord = (recordId: string) => {
    setFinances((prev) => prev.filter((r) => r.id !== recordId));
    if (profile?.uid) {
      FarmDataSyncService.deleteFinanceRecord(profile.uid, recordId).catch((err) =>
        console.warn('Delete finance error:', err)
      );
    }
  };

  const handleSaveInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
    });
    if (profile?.uid) {
      FarmDataSyncService.saveInventoryItem(profile.uid, item).catch((err) =>
        console.warn('Sync inventory error:', err)
      );
    }
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== itemId));
    if (profile?.uid) {
      FarmDataSyncService.deleteInventoryItem(profile.uid, itemId).catch((err) =>
        console.warn('Delete inventory error:', err)
      );
    }
  };

  // Animal sub-record handlers
  const handleSaveHealthCheck = (check: AnimalHealthCheck) => {
    const target = animals.find((a) => a.id === check.animalId);
    if (!target) return;
    const updated: Animal = {
      ...target,
      healthRecords: [check, ...(target.healthRecords || [])],
      updatedAt: new Date().toISOString(),
    };
    handleSaveAnimal(updated);
  };

  const handleSaveVaccination = (vac: AnimalVaccination) => {
    const target = animals.find((a) => a.id === vac.animalId);
    if (!target) return;
    const updated: Animal = {
      ...target,
      vaccinations: [vac, ...(target.vaccinations || [])],
      updatedAt: new Date().toISOString(),
    };
    handleSaveAnimal(updated);
  };

  const handleSaveTreatment = (treat: AnimalTreatment) => {
    const target = animals.find((a) => a.id === treat.animalId);
    if (!target) return;
    const updated: Animal = {
      ...target,
      treatments: [treat, ...(target.treatments || [])],
      updatedAt: new Date().toISOString(),
    };
    handleSaveAnimal(updated);
  };

  const handleSaveMilkRecord = (rec: MilkRecord) => {
    const target = animals.find((a) => a.id === rec.animalId);
    if (!target) return;
    const totalToday = (rec.morningLiters || 0) + (rec.eveningLiters || 0);
    const updated: Animal = {
      ...target,
      dailyMilkLiters: totalToday > 0 ? totalToday : target.dailyMilkLiters,
      milkRecords: [rec, ...(target.milkRecords || [])],
      updatedAt: new Date().toISOString(),
    };
    handleSaveAnimal(updated);
  };

  const handleSaveFeedRecord = (rec: AnimalFeedRecord) => {
    const target = animals.find((a) => a.id === rec.animalId);
    if (!target) return;
    const updated: Animal = {
      ...target,
      feedRecords: [rec, ...(target.feedRecords || [])],
      updatedAt: new Date().toISOString(),
    };
    handleSaveAnimal(updated);
  };

  const handleSaveBreedingRecord = (rec: BreedingRecord) => {
    const target = animals.find((a) => a.id === rec.animalId);
    if (!target) return;
    const updated: Animal = {
      ...target,
      breedingRecords: [rec, ...(target.breedingRecords || [])],
      pregnancyStatus: rec.result === 'conceived' ? 'pregnant' : target.pregnancyStatus,
      expectedDeliveryDate: rec.expectedCalvingDate || target.expectedDeliveryDate,
      updatedAt: new Date().toISOString(),
    };
    handleSaveAnimal(updated);
  };

  // 1. App Startup Authentication Loading Screen
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl mb-4 animate-bounce">
          👨‍🌾
        </div>
        <h1 className="text-2xl font-black text-emerald-400 mb-1">किसान मित्र (Kisan Mitra)</h1>
        <p className="text-stone-300 text-xs font-semibold animate-pulse flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>प्रमाणपत्र तपासत आहे... (Checking authentication...)</span>
        </p>
      </div>
    );
  }

  // 2. Logged-out state: ALWAYS show Login Screen, NEVER show Home or Profile data
  if (!profile || !profile.uid) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-3 font-sans">
        <AuthModal
          language={language}
          profile={null}
          onClose={undefined}
          initialTab={authInitialTab}
          isFullScreen={true}
        />
      </div>
    );
  }

  // 3. Logged-in state: Home Screen Dashboard
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        profile={profile}
        onOpenFarmModal={() => handleOpenAction('my_farm')}
        onOpenFieldSelector={() => setActiveModal('select_field')}
        onStartDemoTour={() => handleOpenAction('demo_tour')}
        isAudioMuted={isAudioMuted}
        onToggleAudioMute={() => setIsAudioMuted(!isAudioMuted)}
        isOffline={isOffline}
        onOpenAuthModal={() => handleOpenAction('auth')}
      />

      {/* Main Home Screen Dashboard */}
      <main className="flex-1">
        <HomeScreen
          language={language}
          profile={profile}
          weather={weather}
          onOpenAction={handleOpenAction}
          onStartDemoTour={() => handleOpenAction('demo_tour')}
          isAudioMuted={isAudioMuted}
          onOpenAuthTab={(tab) => {
            setAuthInitialTab(tab);
            setActiveModal('auth');
          }}
          onEditProfile={() => setActiveModal('onboarding')}
          onOpenFieldSelector={() => setActiveModal('select_field')}
          animals={animals}
          activeAnimalId={activeAnimalId}
          onOpenAnimalSelector={() => setActiveModal('select_animal')}
          taskCount={tasks.filter((t) => !t.isCompleted).length}
          inventoryAlertCount={
            inventory.filter((i) => i.minimumThreshold !== undefined && i.quantity <= i.minimumThreshold).length
          }
        />
      </main>

      {/* Bottom Floating Navigation for Instant Access */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-stone-200 py-2 px-3 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => handleCloseModal()}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-emerald-800 hover:bg-stone-100 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-extrabold mt-0.5">मुख्य</span>
          </button>

          <button
            onClick={() => handleOpenAction('scan_crop')}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-emerald-700 hover:bg-stone-100 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-extrabold mt-0.5">पीक स्कॅन</span>
          </button>

          <button
            onClick={() => handleOpenAction('ask_voice')}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-blue-700 hover:bg-blue-50 cursor-pointer relative"
          >
            <div className="w-9 h-9 -mt-4 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-blue-700 mt-0.5">आवाज</span>
          </button>

          <button
            onClick={() => handleOpenAction('check_fertilizer')}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-amber-700 hover:bg-stone-100 cursor-pointer"
          >
            <FlaskConical className="w-5 h-5" />
            <span className="text-[10px] font-extrabold mt-0.5">खत खात्री</span>
          </button>

          <button
            onClick={() => handleOpenAction('farm_diary')}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-extrabold mt-0.5">डायरी</span>
          </button>
        </div>
      </nav>

      {/* ALL MODALS */}
      {activeModal === 'scan_crop' && (
        <CropScannerModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          onSaveToDiary={handleSaveToDiary}
          onOpenExpert={() => handleOpenAction('ask_expert')}
          initialSampleId={modalSampleId}
          onSelectField={(id) => {
            setProfile((prev) => (prev ? { ...prev, activeFieldId: id } : prev));
            if (profile.uid) {
              FarmDataSyncService.saveUserProfile(profile.uid, {
                activeFieldId: id,
                updatedAt: new Date().toISOString(),
              }).catch(console.warn);
            }
          }}
          onUpdateField={(updatedField) => {
            setProfile((prev) => {
              if (!prev) return prev;
              const newFields = prev.fields.map((f) => (f.id === updatedField.id ? updatedField : f));
              const newProf = { ...prev, fields: newFields };
              if (newProf.uid) {
                FarmDataSyncService.saveField(newProf.uid, updatedField).catch(console.warn);
              }
              return newProf;
            });
          }}
        />
      )}

      {activeModal === 'check_fertilizer' && (
        <FertilizerScannerModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          onSaveToDiary={handleSaveToDiary}
          onOpenExpert={() => handleOpenAction('ask_expert')}
          initialSampleId={modalSampleId}
        />
      )}

      {activeModal === 'check_soil' && (
        <SoilReportModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          onSaveToFarm={handleSaveSoilToFarm}
          initialSampleId={modalSampleId}
        />
      )}

      {activeModal === 'ask_voice' && (
        <VoiceAssistantModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          onNavigateAction={handleOpenAction}
          initialQuery={modalQuery}
          onSelectField={(id) => {
            setProfile((prev) => (prev ? { ...prev, activeFieldId: id } : prev));
            if (profile.uid) {
              FarmDataSyncService.saveUserProfile(profile.uid, {
                activeFieldId: id,
                updatedAt: new Date().toISOString(),
              }).catch(console.warn);
            }
          }}
        />
      )}

      {activeModal === 'select_field' && (
        <FieldSelectorModal
          language={language}
          fields={profile.fields}
          activeFieldId={profile.activeFieldId || profile.fields[0]?.id || ''}
          onSelectField={(id) => {
            setProfile((prev) => (prev ? { ...prev, activeFieldId: id } : prev));
            if (profile.uid) {
              FarmDataSyncService.saveUserProfile(profile.uid, {
                activeFieldId: id,
                updatedAt: new Date().toISOString(),
              }).catch(console.warn);
            }
            setActiveModal(null);
          }}
          onAddNewField={() => {
            setActiveModal('my_farm');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'my_farm' && (
        <MyFarmModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          onEditProfile={() => setActiveModal('onboarding')}
          onUpdateProfile={(updated) => {
            setProfile(updated);
            if (updated.uid) {
              const profileData = {
                id: updated.uid,
                uid: updated.uid,
                name: updated.name,
                email: updated.email || '',
                photoURL: updated.photoURL || '',
                phoneNumber: updated.phoneNumber || '',
                language: updated.language || language,
                profileCompleted: true,
                location: updated.location,
                village: updated.location?.village || '',
                district: updated.location?.district || '',
                taluka: updated.location?.taluka || '',
                state: updated.location?.state || 'Maharashtra',
                latitude: updated.location?.latitude || 17.68,
                longitude: updated.location?.longitude || 74.00,
                activeFieldId: updated.activeFieldId || '',
                updatedAt: new Date().toISOString(),
              };

              FarmDataSyncService.saveUserProfile(updated.uid, profileData).catch((err) =>
                console.warn('Sync profile notice:', err)
              );

              if (updated.fields && updated.fields.length > 0) {
                updated.fields.forEach((f) => {
                  FarmDataSyncService.saveField(updated.uid!, f).catch((err) =>
                    console.warn('Sync field notice:', err)
                  );
                });
              }
            }
          }}
        />
      )}

      {activeModal === 'crop_problems' && (
        <CropProblemsModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          onSelectProblemForScan={(crop) => handleOpenAction('scan_crop')}
        />
      )}

      {activeModal === 'farm_diary' && (
        <FarmDiaryModal
          language={language}
          profile={profile}
          diaryEntries={diaryEntries}
          onClose={handleCloseModal}
          onAddEntry={(entry) => {
            const newEntry = { ...entry, id: `diary_${Date.now()}` };
            setDiaryEntries((prev) => [newEntry, ...prev]);
            if (profile.uid) {
              FarmDataSyncService.saveDiaryEntry(profile.uid, newEntry).catch((err) =>
                console.warn('Sync diary entry notice:', err)
              );
            }
          }}
        />
      )}

      {activeModal === 'cost_calculator' && (
        <CostCalculatorModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'ask_expert' && (
        <ExpertModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'demo_tour' && (
        <DemoTourModal
          language={language}
          onClose={handleCloseModal}
          onTriggerAction={handleOpenAction}
        />
      )}

      {activeModal === 'auth' && (
        <AuthModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          initialTab={authInitialTab}
          onTriggerOnboarding={() => setActiveModal('onboarding')}
        />
      )}

      {activeModal === 'onboarding' && (
        <OnboardingWizardModal
          language={language}
          profile={profile}
          onClose={handleCloseModal}
          onComplete={(updatedProfile) => {
            const completedProf: FarmerProfile = {
              ...updatedProfile,
              profileCompleted: true,
            };
            setProfile(completedProf);
            if (language !== updatedProfile.language) {
              setLanguage(updatedProfile.language || 'mr');
              localStorage.setItem('kisan_lang', updatedProfile.language || 'mr');
            }
            if (updatedProfile.uid) {
              const profileData = {
                id: updatedProfile.uid,
                uid: updatedProfile.uid,
                name: updatedProfile.name,
                nameSource: updatedProfile.nameSource || 'custom',
                email: updatedProfile.email || '',
                photoURL: updatedProfile.photoURL || '',
                phoneNumber: updatedProfile.phoneNumber || '',
                language: updatedProfile.language || 'mr',
                languageSource: updatedProfile.languageSource || 'recommended',
                profileCompleted: true,
                location: updatedProfile.location,
                village: updatedProfile.location?.village || '',
                villageSource: updatedProfile.location?.villageSource || 'recommended',
                district: updatedProfile.location?.district || '',
                districtSource: updatedProfile.location?.districtSource || 'recommended',
                taluka: updatedProfile.location?.taluka || '',
                talukaSource: updatedProfile.location?.talukaSource || 'recommended',
                state: updatedProfile.location?.state || 'Maharashtra',
                latitude: updatedProfile.location?.latitude || 17.68,
                longitude: updatedProfile.location?.longitude || 74.00,
                activeFieldId: updatedProfile.activeFieldId || '',
                updatedAt: new Date().toISOString(),
              };

              FarmDataSyncService.saveUserProfile(updatedProfile.uid, profileData).catch((err) =>
                console.warn('Save user profile error:', err)
              );

              if (updatedProfile.fields && updatedProfile.fields.length > 0) {
                updatedProfile.fields.forEach((f) => {
                  FarmDataSyncService.saveField(updatedProfile.uid!, f).catch((err) =>
                    console.warn('Save field error:', err)
                  );
                });
              }
            }
            handleCloseModal();
          }}
        />
      )}

      {/* Animal Selector Modal */}
      {activeModal === 'select_animal' && (
        <AnimalSelectorModal
          isOpen={true}
          animals={animals}
          activeAnimalId={activeAnimalId}
          onSelectAnimal={(id) => {
            setActiveAnimalId(id);
            setActiveModal(null);
          }}
          onAddNewAnimal={() => {
            setActiveModal('livestock');
          }}
          onClose={handleCloseModal}
        />
      )}

      {/* Livestock Management Modal */}
      {activeModal === 'livestock' && (
        <LivestockModal
          isOpen={true}
          onClose={handleCloseModal}
          initialTab={livestockInitialTab as any}
          animals={animals}
          activeAnimalId={activeAnimalId}
          onSelectActiveAnimal={(id) => setActiveAnimalId(id)}
          onSaveAnimal={handleSaveAnimal}
          onDeleteAnimal={handleDeleteAnimal}
          onSaveHealthCheck={handleSaveHealthCheck}
          onSaveVaccination={handleSaveVaccination}
          onSaveTreatment={handleSaveTreatment}
          onSaveMilkRecord={handleSaveMilkRecord}
          onSaveFeedRecord={handleSaveFeedRecord}
          onSaveBreedingRecord={handleSaveBreedingRecord}
          onAddTask={handleSaveTask}
          onOpenExpert={() => handleOpenAction('ask_expert')}
          language={language}
        />
      )}

      {/* Farming Calendar & Reminders Modal */}
      {activeModal === 'calendar' && (
        <FarmingCalendarModal
          isOpen={true}
          onClose={handleCloseModal}
          tasks={tasks}
          onSaveTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
          fields={profile.fields}
          animals={animals}
          activeFieldId={profile.activeFieldId}
          activeAnimalId={activeAnimalId}
        />
      )}

      {/* Farm Finance Modal */}
      {activeModal === 'finance' && (
        <FarmFinanceModal
          isOpen={true}
          onClose={handleCloseModal}
          finances={finances}
          onSaveRecord={handleSaveFinanceRecord}
          onDeleteRecord={handleDeleteFinanceRecord}
          fields={profile.fields}
          animals={animals}
          activeFieldId={profile.activeFieldId}
        />
      )}

      {/* Farm Inventory / Stock Modal */}
      {activeModal === 'inventory' && (
        <FarmInventoryModal
          isOpen={true}
          onClose={handleCloseModal}
          inventory={inventory}
          onSaveItem={handleSaveInventoryItem}
          onDeleteItem={handleDeleteInventoryItem}
        />
      )}
    </div>
  );
}
