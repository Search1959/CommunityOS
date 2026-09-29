import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Target database ID from configuration
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, databaseId);

export {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
};

// Utility to recursively strip undefined properties so Firestore never throws unsupported field errors
export function sanitizeData<T extends object>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = sanitizeData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// Track collections currently being seeded to avoid duplicate concurrent writes
const seedingSet = new Set<string>();

// Helper function to sync a collection with real-time Firestore updates and maintain cloud persistence
export function subscribeCollection<T extends { id: string }>(
  collectionName: string,
  initialData: T[],
  onUpdate: (data: T[]) => void
) {
  const colRef = collection(db, collectionName);

  // Subscribe to real-time cloud updates
  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && initialData && initialData.length > 0) {
        // Initial state: seed collection to cloud Firestore if empty
        if (!seedingSet.has(collectionName)) {
          seedingSet.add(collectionName);
          onUpdate(initialData);
          try {
            for (const item of initialData) {
              const cleanItem = sanitizeData(item);
              await setDoc(doc(db, collectionName, item.id), cleanItem, { merge: true });
            }
          } catch (err) {
            console.error(`Error seeding ${collectionName} to Firestore:`, err);
          } finally {
            seedingSet.delete(collectionName);
          }
        }
      } else {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as T);
        });

        // For userCredentials or critical datasets, make sure essential initial items (e.g. sysadmin) are present
        if (collectionName === 'userCredentials' && initialData && initialData.length > 0) {
          const existingIds = new Set(items.map((i) => i.id));
          const existingUsernames = new Set(items.map((i: any) => (i.username || '').toLowerCase()));
          
          for (const init of initialData) {
            const initUser = (init as any).username?.toLowerCase();
            if (!existingIds.has(init.id) && !existingUsernames.has(initUser)) {
              items.push(init);
              // Save to Firestore in background so it's permanently stored on the cloud
              setDoc(doc(db, collectionName, init.id), sanitizeData(init), { merge: true }).catch(() => {});
            }
          }
        }

        onUpdate(items);
      }
    },
    (error) => {
      console.warn(`Firestore snapshot subscription notice for ${collectionName}:`, error.message);
    }
  );

  return unsubscribe;
}

// Helper to save or update an item in Firestore cloud database
export async function saveToFirestore<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<boolean> {
  try {
    const cleanItem = sanitizeData(item);
    await setDoc(doc(db, collectionName, item.id), cleanItem, { merge: true });
    return true;
  } catch (err) {
    console.error(`Failed to save document ${item.id} to ${collectionName}:`, err);
    return false;
  }
}

// Helper to delete an item from Firestore cloud database
export async function deleteFromFirestore(
  collectionName: string,
  id: string
): Promise<boolean> {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (err) {
    console.error(`Failed to delete document ${id} from ${collectionName}:`, err);
    return false;
  }
}
