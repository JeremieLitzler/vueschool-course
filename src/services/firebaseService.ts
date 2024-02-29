import { Timestamp } from '@firebase/firestore';

export default function firebaseService() {
  const getServerTimeStamp = () => {
    const value = Timestamp.fromDate(new Date());
    //console.log('getServerTimeStamp', value);
    return value;
  };

  return { getServerTimeStamp };
}
