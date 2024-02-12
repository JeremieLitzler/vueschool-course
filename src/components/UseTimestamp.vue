<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useTimestamp, useNow, useDateFormat</pre>
    </summary>
    <article>
      <h3>Elapsed seconds since last refresh</h3>
      <pre>{{ secondsElapsedSinceLastRefresh }}</pre>
    </article>
    <article>
      <h3>Format dates</h3>
      <select name="formats" id="formats" v-model="selected">
        <option v-for="format in formats" :key="format" :value="format">
          {{ format }}
        </option>
      </select>
      <pre>{{ formattedDateTime }}</pre>
    </article>
  </details>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { useTimestamp, useNow, useDateFormat } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);
const start = Date.now();
const currentTimestamp = useTimestamp();
const secondsElapsedSinceLastRefresh = computed(() => {
  return Math.floor((currentTimestamp.value - start) / 1000);
});

const formats = ["D MMMM YYYY", "YYYY-MM-DD", "MMM DD, YYYY HH:mm"];
const selected = ref(formats[0]);

const formattedDateTime = useDateFormat(useTimestamp(), selected);
</script>
<style scoped></style>
