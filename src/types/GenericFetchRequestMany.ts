import GenericFetchRequestAll from '@/types/GenericFetchRequestAll';

export default interface GenericFetchRequestMany<T>
  extends GenericFetchRequestAll<T> {
  ids: string[];
}
