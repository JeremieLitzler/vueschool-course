import GenericStoreRequest from './GenericStoreRequest';
import WithId from './WithId';

export default interface GenericFindRequest<T>
  extends GenericStoreRequest<T>,
    WithId {}
