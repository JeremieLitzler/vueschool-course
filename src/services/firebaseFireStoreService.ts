import { firebaseApp } from '@/services/fireBaseConnector';
import { Timestamp } from '@firebase/firestore';

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

const db = getFirestore(firebaseApp);

export function firebaseFireStoreService() {
  const getServerTimeStamp = () => {
    const value = Timestamp.fromDate(new Date());
    //console.log('getServerTimeStamp', value);
    return value;
  };
  return {
    db,
    getServerTimeStamp,
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
