import type { UseCycleListOptions } from "@vueuse/core";
import type { MaybeRefOrGetter } from "@vueuse/shared";
import { ref, computed } from "vue";
import { useCycleList } from "@vueuse/core";

enum Direction {
  forward = "forward",
  backward = "backward",
}
export function useAppCycleList<T>(
  list: MaybeRefOrGetter<T[]>,
  options?: UseCycleListOptions<T>
) {
  const direction = ref<string | null>(null);
  const cycleList = useCycleList(list, options);

  const goingForward = computed(() => direction.value === Direction.forward);
  const goingBackward = computed(() => direction.value === Direction.backward);
  function next() {
    direction.value = Direction.forward;
    cycleList.next();
  }

  function prev() {
    direction.value = Direction.backward;
    cycleList.prev();
  }
  return {
    ...cycleList,
    next,
    prev,
    goingForward,
    goingBackward,
  };
}
