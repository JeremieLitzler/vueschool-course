<template>
  <details>
    <summary><pre>⬇️ useDark</pre></summary>
    <h2>Demo of useDark</h2>
    <pre>isDark = {{ isDark }}</pre>
    <button @click="toggleDark()">Toggle Dark mode</button>
    <p>
      The value is by default read from the system preferences.
      <a
        href="https://www.google.com/search?q=change+dark+on+system+level"
        target="_blank"
        rel="noopener noreferrer"
        >See how to adjust that.</a
      >
    </p>
  </details>
  <details>
    <summary><pre>⬇️ useColorMode</pre></summary>
    <h2>Demo of useColorMode</h2>
  </details>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
