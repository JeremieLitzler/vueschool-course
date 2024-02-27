import { DocumentSnapshot } from 'firebase/firestore';

export default function useFirebaseHelper() {
  const docToResource = (firebaseDoc: DocumentSnapshot) => {
    if (typeof firebaseDoc?.data !== 'function') {
      return firebaseDoc;
    }
    return { ...firebaseDoc.data(), id: firebaseDoc.id };
  };
  return {
    docToResource,
  };
}
