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
import { inject } from "vue";
import { useCycleList } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const { state, next, prev } = useCycleList([
  "https://picsum.photos/id/237/300/200",
  "https://picsum.photos/id/23/300/200",
  "https://picsum.photos/id/7/300/200",
]);
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

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.controls {
  display: flex;
  justify-content: center;
}
</style>
