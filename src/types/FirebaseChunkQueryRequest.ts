import { FirestoreCollection } from '@/enums/FirestoreCollection';
import GenericStoreRequest from '@/types/GenericStoreRequest';
import WithId from '@/types/WithId';

export default interface FirebaseChunkQueryRequest<T extends WithId>
  extends GenericStoreRequest<T> {
  collection: FirestoreCollection;
  ids: string[];
  chunkIndex: number;
  chunkSize: number;
}
