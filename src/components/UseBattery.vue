<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useBattery</pre>
    </summary>
    Try to unplug the AC and let the battery be drained... if
    <i>isSupported = true</i>, of course...
    <pre>{{ batteryInfo }}</pre>
  </details>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useBattery } from "@vueuse/core";

const batteryInfo = useBattery();
import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);
</script>
<style scoped></style>
