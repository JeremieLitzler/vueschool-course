import GenericStoreRequest from '@/types/GenericStoreRequest';
import WithId from '@/types/WithId';

export default interface FirebaseSinglePropQueryRequest<T extends WithId>
  extends GenericStoreRequest<T> {
  collectionName: string;
  propName: string;
  propValue: string;
}
