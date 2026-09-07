import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  User,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || "AIzaSyA-BKkneeR1lMPsvZORIBQ52RLM6-TQAK0",
  authDomain: firebaseConfigJson.authDomain || "kishan-mitra-89160.firebaseapp.com",
  databaseURL: (firebaseConfigJson as any).databaseURL || "https://kishan-mitra-89160-default-rtdb.firebaseio.com",
  projectId: firebaseConfigJson.projectId || "kishan-mitra-89160",
  storageBucket: firebaseConfigJson.storageBucket || "kishan-mitra-89160.firebasestorage.app",
  messagingSenderId: firebaseConfigJson.messagingSenderId || "92121373337",
  appId: firebaseConfigJson.appId || "1:92121373337:web:ed46d2e855a0d0823d7608",
  measurementId: firebaseConfigJson.measurementId || "G-8PSLCM34FP",
  firestoreDatabaseId: firebaseConfigJson.firestoreDatabaseId || "ai-studio-farmerassistantk-9ab4ba01-4169-42c8-9788-67a0b9e66f92",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Safely initialize analytics
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure if not supported
  });
}

// Initialize Firestore with autoDetectLongPolling to guarantee immediate and reliable connectivity in iframe/sandbox environments
try {
  initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  // Ignore if already initialized
}

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase setPersistence notice:', err);
});
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  
  // Don't throw unhandled crash for offline / network transient state
  if (errMessage.includes('unavailable') || errMessage.includes('offline')) {
    console.warn(`Firestore operating in offline mode for ${operationType} on path ${path}:`, errMessage);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Test connection on boot per Firebase skill guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();

// Authentication helpers
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Google Sign-in popup failed:', error);
    if (
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/cancelled-popup-request'
    ) {
      // Try redirect fallback if popup is blocked in iframe environment
      try {
        await signInWithRedirect(auth, googleProvider);
        // Will redirect page
        return new Promise<User>(() => {});
      } catch (redirectError) {
        console.error('Google Sign-in redirect error:', redirectError);
      }
    }
    throw error;
  }
}

export { getRedirectResult };

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function signUpWithEmail(email: string, pass: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function loginAnonymouslyPhone(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Helper function to recursively sanitize data and remove any 'undefined' values before passing to Firestore
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as unknown as T;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}

// Firestore Realtime Sync Service for Farmer Profile & Data
export const FarmDataSyncService = {
  // Fetch user profile from Firestore for a given UID
  async getUserProfile(userId: string) {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, path));
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  // Sync farmer profile
  async saveUserProfile(userId: string, data: Record<string, any>) {
    const path = `users/${userId}`;
    try {
      const cleanData = sanitizeForFirestore(data);
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Listen to farmer's fields
  subscribeFields(userId: string, onUpdate: (fields: any[]) => void): Unsubscribe {
    const path = `users/${userId}/fields`;
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  // Save or update a field
  async saveField(userId: string, field: Record<string, any>) {
    const path = `users/${userId}/fields/${field.id}`;
    try {
      const cleanData = sanitizeForFirestore({
        ...field,
        userId,
      });
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save multiple fields
  async saveFields(userId: string, fields: Record<string, any>[]) {
    for (const field of fields) {
      await this.saveField(userId, field);
    }
  },

  // Delete a field
  async deleteField(userId: string, fieldId: string) {
    const path = `users/${userId}/fields/${fieldId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Listen to farmer's diary entries
  subscribeDiary(userId: string, onUpdate: (entries: any[]) => void): Unsubscribe {
    const path = `users/${userId}/diary`;
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  // Save or update diary entry
  async saveDiaryEntry(userId: string, entry: Record<string, any>) {
    const path = `users/${userId}/diary/${entry.id}`;
    try {
      const cleanData = sanitizeForFirestore({
        ...entry,
        userId,
      });
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Delete diary entry
  async deleteDiaryEntry(userId: string, entryId: string) {
    const path = `users/${userId}/diary/${entryId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // ==================== ANIMALS / LIVESTOCK ====================
  // Listen to farmer's animals
  subscribeAnimals(userId: string, onUpdate: (animals: any[]) => void): Unsubscribe {
    const path = `users/${userId}/animals`;
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  async saveAnimal(userId: string, animal: Record<string, any>) {
    const path = `users/${userId}/animals/${animal.id}`;
    try {
      const cleanData = sanitizeForFirestore({
        ...animal,
        userId,
      });
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteAnimal(userId: string, animalId: string) {
    const path = `users/${userId}/animals/${animalId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Animal Sub-records (Milk, Health, Vaccinations, Treatments, Feed, Breeding)
  subscribeAnimalSubcollection(userId: string, animalId: string, subcollectionName: string, onUpdate: (items: any[]) => void): Unsubscribe {
    const path = `users/${userId}/animals/${animalId}/${subcollectionName}`;
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  async saveAnimalSubRecord(userId: string, animalId: string, subcollectionName: string, record: Record<string, any>) {
    const path = `users/${userId}/animals/${animalId}/${subcollectionName}/${record.id}`;
    try {
      const cleanData = sanitizeForFirestore({
        ...record,
        animalId,
        userId,
      });
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // ==================== SMART FARMING CALENDAR / TASKS ====================
  subscribeTasks(userId: string, onUpdate: (tasks: any[]) => void): Unsubscribe {
    const path = `users/${userId}/tasks`;
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  async saveTask(userId: string, task: Record<string, any>) {
    const path = `users/${userId}/tasks/${task.id}`;
    try {
      const cleanData = sanitizeForFirestore({
        ...task,
        userId,
      });
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteTask(userId: string, taskId: string) {
    const path = `users/${userId}/tasks/${taskId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // ==================== FARM FINANCE (EXPENSES & INCOME) ====================
  subscribeFinances(userId: string, onUpdate: (records: any[]) => void): Unsubscribe {
    const path = `users/${userId}/finances`;
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  async saveFinanceRecord(userId: string, record: Record<string, any>) {
    const path = `users/${userId}/finances/${record.id}`;
    try {
      const cleanData = sanitizeForFirestore({
        ...record,
        userId,
      });
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteFinanceRecord(userId: string, recordId: string) {
    const path = `users/${userId}/finances/${recordId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // ==================== FARM INVENTORY / STOCK ====================
  subscribeInventory(userId: string, onUpdate: (items: any[]) => void): Unsubscribe {
    const path = `users/${userId}/inventory`;
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  async saveInventoryItem(userId: string, item: Record<string, any>) {
    const path = `users/${userId}/inventory/${item.id}`;
    try {
      const cleanData = sanitizeForFirestore({
        ...item,
        userId,
      });
      await setDoc(doc(db, path), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteInventoryItem(userId: string, itemId: string) {
    const path = `users/${userId}/inventory/${itemId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },
};
