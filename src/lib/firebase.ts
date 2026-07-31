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

// Lazy initialization to avoid startup errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Target database ID if set in config, otherwise default
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

// Helper function to sync a collection with real-time Firestore updates and seed initial data if empty
export function subscribeCollection<T extends { id: string }>(
  collectionName: string,
  initialData: T[],
  onUpdate: (data: T[]) => void
) {
  const colRef = collection(db, collectionName);

  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty && initialData && initialData.length > 0) {
      // Seed initial data to Firestore so it's globally stored
      try {
        for (const item of initialData) {
          await setDoc(doc(db, collectionName, item.id), item);
        }
      } catch (err) {
        console.error(`Error seeding ${collectionName}:`, err);
      }
    } else {
      const items: T[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as T);
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    }
  }, (error) => {
    console.error(`Firestore snapshot error for ${collectionName}:`, error);
  });

  return unsubscribe;
}

// Helper to save or update an item in Firestore
export async function saveToFirestore<T extends { id: string }>(
  collectionName: string,
  item: T
) {
  try {
    await setDoc(doc(db, collectionName, item.id), item, { merge: true });
  } catch (err) {
    console.error(`Failed to save to ${collectionName}:`, err);
  }
}
