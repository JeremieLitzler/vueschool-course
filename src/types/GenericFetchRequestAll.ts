import GenericStoreRequest from '@/types/GenericStoreRequest';

export default interface GenericFetchRequestAll<T>
  extends GenericStoreRequest<T> {
  collection: string;
}
