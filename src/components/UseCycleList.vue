<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useCycleList</pre>
    </summary>
    <article>
      <h3>Demo carousel</h3>
      <div class="carousel">
        <transition>
          <img :src="state" alt="" :key="state" />
        </transition>
      </div>
      <div class="controls">
        <button class="btn-spaced" @click="prev()">Previous</button>
        <button class="btn-spaced" @click="next()">Next</button>
      </div>
    </article>
  </details>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useAppCycleList } from "../composables/useAppCycleList";
import { useIntervalFn } from "@vueuse/core";
import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);
const images = [
  "https://picsum.photos/id/237/300/200",
  "https://picsum.photos/id/23/300/200",
  "https://picsum.photos/id/7/300/200",
];
const { state, next, prev, goingForward } = useAppCycleList(images);

useIntervalFn(() => next(), 3000);

const direction = computed(() => {
  if (goingForward.value) {
    return { from: `translateX(100%)`, to: `translateX(-100%)` };
  }
  return { from: `translateX(-100%)`, to: `translateX(100%)` };
});
</script>
<style scoped>
.carousel {
  position: relative;
  height: 300px;
  margin-bottom: 1em;
}
img {
  width: 100%;
  position: absolute;
  height: 300px;
  object-fit: cover;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from {
  transform: v-bind("direction.from");
}
.v-leave-to {
  transform: v-bind("direction.to");
}

.controls {
  display: flex;
  justify-content: center;
}
</style>
