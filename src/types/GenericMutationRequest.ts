import GenericStoreRequest from '@/types/GenericStoreRequest';

export default interface GenericMutationRequest<T>
  extends GenericStoreRequest<T> {
  item: T;
}
