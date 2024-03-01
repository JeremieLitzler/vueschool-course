import useFirebase from '@/helpers/fireBaseConnector';
import UserFirebaseRegisterRequest from '@/types/UserFirebaseRegisterRequest';
import { Timestamp } from '@firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';

export default function firebaseService() {
  const getServerTimeStamp = () => {
    const value = Timestamp.fromDate(new Date());
    //console.log('getServerTimeStamp', value);
    return value;
  };

  const registerUser = async (request: UserFirebaseRegisterRequest) => {
    const auth = getAuth(useFirebase().firebaseApp);
    try {
      const registerResult = await createUserWithEmailAndPassword(
        auth,
        request.email,
        request.password
      );
      console.log('User registered!', registerResult);
      return registerResult;
    } catch (error) {
      console.log('Error >', error);
      return error as FirebaseError;
    }
  };

  return { getServerTimeStamp, registerUser };
}
