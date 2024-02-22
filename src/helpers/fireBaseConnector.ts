import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/config/firebase';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default function useFirebase() {
  return {
    db,
    doc,
    onSnapshot,
  };
}
