import useFirebase from '@/helpers/fireBaseConnector';
import UserFirebaseRegisterRequest from '@/types/UserFirebaseRegisterRequest';
import { Timestamp } from '@firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  StorageReference,
} from 'firebase/storage';

import type { FirebaseError } from 'firebase/app';
import type UserLoginRequest from '@/types/UserLoginRequest';
import type UserGoogleSigninRequest from '@/types/UserGoogleSignRequest';

export default function firebaseService() {
  const auth = getAuth(useFirebase().firebaseApp);
  const getServerTimeStamp = () => {
    const value = Timestamp.fromDate(new Date());
    //console.log('getServerTimeStamp', value);
    return value;
  };

  const registerUser = async (request: UserFirebaseRegisterRequest) => {
    try {
      const registerResult = await createUserWithEmailAndPassword(
        auth,
        request.email,
        request.password
      );
      //console.log('User registered!', registerResult);
      return registerResult;
    } catch (error) {
      //console.log('Error >', error);
      return error as FirebaseError;
    }
  };

  const loginWithEmailAndPassword = async ({
    email,
    password,
  }: UserLoginRequest): Promise<UserCredential | FirebaseError> => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((user) => user)
      .catch((error) => {
        //console.log(error);
        return error;
      });
  };

  const signinWithGoogle = async (): Promise<UserGoogleSigninRequest> => {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);
    const user = response.user;
    const userRef = useFirebase().doc(useFirebase().db, 'users', user.uid);
    const userDoc = await useFirebase().getDoc(userRef);
    return {
      uid: user.uid,
      name: user.displayName!,
      email: user.email!,
      username: user.email!,
      avatar: user.photoURL!,
      exists: userDoc.exists(),
    };
  };
  const signOut = async () => {
    await auth.signOut();
    //console.log('UserStore > signOut', auth.currentUser);
  };
  const getAuthUserId = () => {
    return auth.currentUser?.uid;
  };

  const getStorageBucket = (url: string) => {
    return ref(getStorage(useFirebase().firebaseApp), url);
  };
  const uploadToStorageBucket = (
    bucketRef: StorageReference,
    imageBlob: Blob
  ) => {
    return uploadBytes(bucketRef, imageBlob);
  };
  const getImageURL = (snapshotRef: StorageReference) => {
    const urlPromise = getDownloadURL(snapshotRef);
    return urlPromise;
  };

  return {
    auth,
    getServerTimeStamp,
    registerUser,
    getAuthUserId,
    loginWithEmailAndPassword,
    signinWithGoogle,
    signOut,
    getStorageBucket,
    uploadToStorageBucket,
    getImageURL,
  };
}
