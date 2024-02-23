import type { Ref } from 'vue';

export default interface GenericStoreRequest<T> {
  targetStore: Ref<T[]>;
}
