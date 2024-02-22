import GenericStoreRequest from '@/types/GenericStoreRequest';

export default interface GenericFetchRequest<T> extends GenericStoreRequest<T> {
  collection: string;
  id: string;
}
