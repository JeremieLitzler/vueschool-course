import type { Ref } from 'vue';
import WithId from '@/types/WithId';

export default interface GenericStoreRequest<T extends WithId> {
  targetStore: Ref<T[]>;
}
