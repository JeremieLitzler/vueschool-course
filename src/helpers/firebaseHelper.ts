import { DocumentSnapshot } from 'firebase/firestore';

export default function firebaseHelper() {
  /**
   * Converts a firestore document to a resource object.
   *
   * @param firebaseDoc The firestore document to convert
   * @returns The converted value
   */
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
