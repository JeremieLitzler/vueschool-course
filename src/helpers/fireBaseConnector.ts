import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/config/firebase';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  writeBatch,
  arrayUnion,
  increment,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default function useFirebase() {
  return {
    firebaseApp,
    db,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    collection,
    writeBatch,
    arrayUnion,
    increment,
    query,
    where,
    orderBy,
    limit,
    startAfter,
  };
}
