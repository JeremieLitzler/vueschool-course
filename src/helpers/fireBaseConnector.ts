import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/config/firebase';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  arrayUnion,
} from 'firebase/firestore';
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default function useFirebase() {
  return {
    db,
    doc,
    getDoc,
    getDocs,
    collection,
    writeBatch,
    arrayUnion,
  };
}
