import GenericStoreRequest from './GenericStoreRequest';
import WithId from '@/types/WithId';

export default interface GenericFindRequest<T extends WithId>
  extends GenericStoreRequest<T>,
    WithId {}
