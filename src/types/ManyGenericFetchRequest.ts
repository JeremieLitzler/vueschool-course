import GenericStoreRequest from '@/types/GenericStoreRequest';

export default interface ManyGenericFetchRequest<T>
  extends GenericStoreRequest<T> {
  ids: string[];
  collection: string;
}
