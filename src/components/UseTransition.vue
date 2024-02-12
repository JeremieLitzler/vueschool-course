<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useTransition</pre>
    </summary>
    <article>
      <p>&nbsp;</p>
      <label
        >Animation speed: <input type="number" v-model="animationSpeedMs"
      /></label>
      <hr />
      <button class="btn-spaced" @click="load">Load</button>
      <button @click="reset">Unload</button>
    </article>
    <article>
      <h3>Transition from 0 to 100</h3>
      <pre>
        load directly: {{ percent }}
      </pre>
      <pre>
        load with transition: {{ percentAnimated }}
      </pre>
      <pre>
      load with transition and round values: {{ Math.floor(percentAnimated) }}
    </pre
      >
      <hr />
    </article>
    <article>
      <h3>Loading bar usecase</h3>
      <div
        :style="`width: ${percentAnimated}%; background-color: ${loadingBarColor}`"
        class="loading-bar"
      ></div>
    </article>
  </details>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useTransition, TransitionPresets } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const percent = ref(0);
const animationSpeedMs = ref(1000);
const loadingBarColor = ref("red");

const load = () => (percent.value = 100);
const reset = () => (percent.value = 0);

const percentAnimated = useTransition(percent, {
  transition: TransitionPresets.easeInOutCubic,
  duration: animationSpeedMs.value,
  onFinished() {
    loadingBarColor.value = "green";
  },
});
</script>
<style scoped>
.loading-bar {
  height: 1em;
  background-color: var(--theme-color);
}
</style>
