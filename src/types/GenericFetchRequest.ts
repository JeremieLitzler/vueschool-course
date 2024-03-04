import GenericStoreRequest from '@/types/GenericStoreRequest';
import WithId from '@/types/WithId';

export default interface GenericFetchRequest<T extends WithId>
  extends GenericStoreRequest<T> {
  collection: string;
  id: string;
  reFetch?: boolean;
}
