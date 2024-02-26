export default function useFirebaseHelper() {
  const docToResource = (firebaseDoc) => {
    if (typeof firebaseDoc?.data !== "function") {
      return firebaseDoc;
    }
    return { ...firebaseDoc.data(), id: firebaseDoc.id };
  };
  return {
    docToResource,
  };
}
