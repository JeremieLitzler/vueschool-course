// import { initializeApp } from 'firebase/app';
// import { firebaseConfig } from '@/config/firebase';
import { Timestamp } from '@firebase/firestore';
import //getFirestore,
//   doc,
//   onSnapshot,
//   getDoc,
//   getDocs,
//   collection,
//   writeBatch,
//   arrayUnion,
'firebase/firestore';
//const firebaseApp = initializeApp(firebaseConfig);
//const db = getFirestore(firebaseApp);

export default function firebaseService() {
  const getServerTimeStamp = () => {
    const value = Timestamp.fromDate(new Date());
    console.log('getServerTimeStamp', value);
    return value;
  };

  return { getServerTimeStamp };
}
