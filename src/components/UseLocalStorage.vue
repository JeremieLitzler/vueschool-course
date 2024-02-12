<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useLocalStorage & useSessionStorage</pre>
    </summary>
    <h3>Demo <i>useLocalStorage</i></h3>
    <input type="text" v-model="name" />
    <h3>Demo <i>useSessionStorage</i></h3>
    <input type="text" v-model="transportationMode" />
  </details>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useLocalStorage, useSessionStorage } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const name = useLocalStorage("name", "Jeremie");
const transportationMode = useSessionStorage("transportationMode", "Bicycle");
</script>
<style scoped></style>
