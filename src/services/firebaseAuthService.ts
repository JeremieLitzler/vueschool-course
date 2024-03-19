import { firebaseApp } from '@/services/fireBaseConnector';
import { firebaseFireStoreService } from '@/services/firebaseFireStoreService';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';

import uniqueIdHelper from '@/helpers/uniqueIdHelper';
import type UserFirebaseRegisterRequest from '@/types/UserFirebaseRegisterRequest';
import type FirebaseResourcePropUnicityRequest from '@/types/FirebaseResourcePropUnicityRequest';
import type UserGoogleSigninRequest from '@/types/UserGoogleSignRequest';
import type { FirebaseError } from 'firebase/app';
import type UserLoginRequest from '@/types/UserLoginRequest';
import { AppQueryStringParam } from '@/enums/AppQueryStringParam';

export default function firebaseService() {
  const auth = getAuth(firebaseApp);

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

  /**
   * Send Firebase a request to get a verifyAndUpdateEmail link for a user.
   *
   * The 'continueUrl' contains the link to the /account/edit route from
   * where the request is made.
   *
   * The query string parameters are used to have a smooth UX:
   * - verifiedEmail: used on the login page (/account/edit requires authentification)
   *   and the /account/edit page once reauthenticated.
   * - showReconnectMessage: used on the login page to show a clear message about the
   *   email address to use to login.
   * - oobCode: not used but could be to secure the request if the code was saved in
   *   the firestore document corresponding to the updated user.
   *
   * The try&catch is necessary to show a login form on /account/edit if Firebase requests
   * reauthentication.
   *
   * Don't forget to add VITE_BASE_URL in your CD.
   *
   * @param newEmail The new email to set on the authenticated user
   * @returns The result of the request : success (boolean) and the Firebase error (if any)
   */
  const secureUpdateEmail = async (newEmail: string) => {
    const oobCode = uniqueIdHelper().newUniqueId;
    const continueUrl = `${import.meta.env.VITE_BASE_URL}/account/edit?${
      AppQueryStringParam.verifiedEmail
    }=${newEmail}&${AppQueryStringParam.oobCode}=${oobCode}&${
      AppQueryStringParam.showReconnectMessage
    }=true`;
    console.log('secureUpdateEmail>continueUrl', continueUrl);

    return verifyBeforeUpdateEmail(auth.currentUser!, newEmail, {
      url: `${continueUrl}`,
      handleCodeInApp: true,
    })
      .then(() => {
        return { success: true, errorMessage: null };
      })
      .catch((error) => {
        //console.log(error);
        return { success: false, errorMessage: error };
      });
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
    const userRef = firebaseFireStoreService().doc(
      firebaseFireStoreService().db,
      'users',
      user.uid
    );
    const userDoc = await firebaseFireStoreService().getDoc(userRef);
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
  const isUnique = async <T>({
    collectionName,
    prop,
    value,
  }: FirebaseResourcePropUnicityRequest<T>) => {
    //console.log('firebaseService>isUnique');
    const collection = firebaseFireStoreService().collection(
      firebaseFireStoreService().db,
      collectionName
    );
    const commonQueryParts = [
      firebaseFireStoreService().where(prop, '==', value),
    ];
    let queryObj = firebaseFireStoreService().query(
      collection,
      ...commonQueryParts
    );
    const result = await firebaseFireStoreService().getDocs(queryObj);

    return result.empty;
  };

  return {
    auth,
    registerUser,
    secureUpdateEmail,
    getAuthUserId,
    loginWithEmailAndPassword,
    signinWithGoogle,
    signOut,
    isUnique,
  };
}
