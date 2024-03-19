import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/config/firebase';

export const firebaseApp = initializeApp(firebaseConfig);
