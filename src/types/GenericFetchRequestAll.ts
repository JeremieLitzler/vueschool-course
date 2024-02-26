import GenericStoreRequest from '@/types/GenericStoreRequest';
import WithId from '@/types/WithId';

export default interface GenericFetchRequestAll<T extends WithId>
  extends GenericStoreRequest<T> {
  collection: string;
}
