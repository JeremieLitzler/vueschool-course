<template>
  <h1>{{ title }}</h1>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useTitle</pre>
    </summary>
    <h2>Demo of useTitle</h2>
    <input type="text" v-model="title" />
  </details>
</template>

<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { inject } from "vue";
import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel = inject(summaryAccessibilityLabelKey);

const title = useTitle();
</script>

<style scoped></style>
