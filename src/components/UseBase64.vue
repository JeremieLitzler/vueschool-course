<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useBase64</pre>
    </summary>
    <h3>Demo</h3>
    <label>
      String representing a base64 image:
      <input
        type="file"
        accept="image/*"
        @change="setImagePreview($event.target)"
      />
    </label>
    <hr />
    <img v-if="image" :src="base64" alt="base64 image" />
  </details>
</template>

<script setup>
import { ref, inject } from "vue";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel = inject(summaryAccessibilityLabelKey);

import { useBase64 } from "@vueuse/core";
const image = ref("");
const { base64 } = useBase64(image);
const setImagePreview = async (target /*: HTMLInputElement | null*/) => {
  console.log(typeof target);
  const files = target.files; // as FileList;
  image.value = files[0];
};
</script>
<style scoped></style>
