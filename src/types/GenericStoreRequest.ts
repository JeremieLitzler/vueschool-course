import type { Ref } from 'vue';

export default interface GenericStoreRequest<T> {
  source: Ref<T[]>;
}
