<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useOnline & useNetwork</pre>
    </summary>
    <h3>Online flag</h3>
    <pre>{{ onlineInfo }}</pre>
    <h3>Network info</h3>
    <pre>{{ networkInfo }}</pre>
  </details>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useOnline, useNetwork } from "@vueuse/core";

const onlineInfo = useOnline();
const networkInfo = useNetwork();

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);
</script>
<style scoped></style>
