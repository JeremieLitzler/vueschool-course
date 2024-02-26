import GenericFetchRequestAll from '@/types/GenericFetchRequestAll';
import WithId from '@/types/WithId';

export default interface GenericFetchRequestMany<T extends WithId>
  extends GenericFetchRequestAll<T> {
  ids: string[];
}
