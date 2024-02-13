<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useFileSystemAccess</pre>
    </summary>
    <article>
      <h2>Demo</h2>
      <p>
        Create a text file on your computer. Its contents will be loaded in the
        textarea.
      </p>
      <p>
        Your browser <b>{{ isSupported ? "" : "doesn't" }} supports</b> this
        demo.
      </p>
      <div class="file-editor-controls">
        <button class="btn-spaced" @click="open">Open file</button>
        <button class="btn-spaced" @click="save">Save</button>
      </div>

      <div class="file-editor">
        <textarea v-model="data" cols="30" rows="10"></textarea>
      </div>
    </article>
  </details>
</template>

<script setup>
import { /*ref,*/ inject } from "vue";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel = inject(summaryAccessibilityLabelKey);

import { useFileSystemAccess } from "@vueuse/core";
const { isSupported, data, open, save } = useFileSystemAccess();
</script>
<style scoped>
.file-editor-controls {
  margin-bottom: 1em;
}
.file-editor textarea {
  width: fit-content;
}
</style>
