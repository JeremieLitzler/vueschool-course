import GenericStoreRequest from '@/types/GenericStoreRequest';
import WithId from '@/types/WithId';
import { OrderByDirection } from 'firebase/firestore';

export default interface FirebaseSinglePropQueryRequest<T extends WithId>
  extends GenericStoreRequest<T> {
  collectionName: string;
  propName: string;
  propValue: string;
  orderByProp: string;
  orderByDirection: OrderByDirection;
  maxElements?: number;
  startAtItem: T | null;
}
