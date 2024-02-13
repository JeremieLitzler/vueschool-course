<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useRafFn</pre>
    </summary>
    <h3>Make the man walk with <i>useIntervalFn</i></h3>
    <div
      class="sprite"
      :style="`background-position: ${activePositionInterval}px 50%;`"
    ></div>
    <button @click="isActiveInterval ? pauseInterval() : resumeInterval()">
      {{ isActiveInterval ? "Stop the man" : "Make the man walk" }}
    </button>
    <h3>Make the man walk with <i>useRafFn</i></h3>
    <div
      class="sprite"
      :style="`background-position: ${activePositionRaf}px 50%;`"
    ></div>
    <button @click="isActive ? pause() : resume()">
      {{ isActive ? "Stop the man" : "Make the man walk" }}
    </button>
  </details>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

import { useIntervalFn, useRafFn } from "@vueuse/core";
const activePositionInterval = ref(0);
const activePositionRaf = ref(0);
const framesCompleted = ref(0);
const {
  pause: pauseInterval,
  resume: resumeInterval,
  isActive: isActiveInterval,
} = useIntervalFn(() => {
  //activePosition is greater than -525, let's go back to the start.
  if (activePositionInterval.value > -525) {
    activePositionInterval.value -= 75;
  } else {
    activePositionInterval.value = 0;
  }
}, 100);

const { pause, resume, isActive } = useRafFn(() => {
  //activePosition is greater than -525, let's go back to the start.
  framesCompleted.value++;
  if (framesCompleted.value % 5) return;
  if (activePositionRaf.value > -525) {
    activePositionRaf.value -= 75;
  } else {
    activePositionRaf.value = 0;
  }
});
</script>
<style scoped>
.sprite {
  background: url(/walking-man.png) no-repeat;
  width: 75px;
  height: 150px;
  background-position: 0 50%;
}
</style>
