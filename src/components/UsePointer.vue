<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>usePointer</pre>
    </summary>
    <h3>What is <i>usePointer useful for?</i></h3>
    <pre>{{ pointerObj }}</pre>
  </details>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { summaryAccessibilityLabelKey } from "../injectKeys.ts";
const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

import { usePointer } from "@vueuse/core";
const pointerObj = usePointer();
</script>
<style scoped></style>
