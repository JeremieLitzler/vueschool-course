<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useGeolocation</pre>
    </summary>
    <pre lang="json">{{
      JSON.stringify(
        {
          coords: {
            accuracy: coords.accuracy,
            latitude: coords.latitude,
            longitude: coords.longitude,
            altitude: coords.altitude,
            altitudeAccuracy: coords.altitudeAccuracy,
            heading: coords.heading,
            speed: coords.speed,
          },
          locatedAt,
          error: error ? error.message : error,
        },
        null,
        2
      )
    }}</pre>
  </details>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useGeolocation } from "@vueuse/core";

const { coords, locatedAt, error } = useGeolocation();
console.log(coords.value);

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);
</script>
<style scoped></style>
