import GenericStoreRequest from '@/types/GenericStoreRequest';
import WithId from '@/types/WithId';

export default interface GenericMutationRequest<T extends WithId>
  extends GenericStoreRequest<T> {
  item: T;
}
