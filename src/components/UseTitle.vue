<template>
  <h1>{{ title }}</h1>
  <details>
    <summary>
      <pre :aria-label="clickToOpenTip" :title="clickToOpenTip">
⬇️ useTitle</pre
      >
    </summary>
    <h2>Demo of useTitle</h2>
    <input type="text" v-model="title" />
  </details>
</template>

<script setup lang="ts">
import { useTitle } from "@vueuse/core";
const clickToOpenTip = "Click to open or close the demo";
const title = useTitle();
</script>

<style scoped></style>
