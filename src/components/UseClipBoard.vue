<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useClipboard</pre>
    </summary>
    <h2>Demo of useClipboard</h2>
    <h3>From Reactive Ref</h3>
    <input type="text" v-model="textToCopy" />
    <button @click="copyRefVar()">
      {{ copiedRefVar ? "Copied" : "Copy" }}
    </button>
    <input type="text" placeholder="paste here to check" />
    <h3>By passing the value to copy function</h3>
    <input type="text" v-model="textToCopy2" />
    <button @click="copyArg(textToCopy2)">
      {{ copiedArg ? "Copied" : "Copy" }}
    </button>
    <input type="text" placeholder="paste here to check" />
  </details>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useClipboard } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const textToCopy = ref("//Hello from Ref Var");
const textToCopy2 = ref("//Hello By Arg");

const { copy: copyRefVar, copied: copiedRefVar } = useClipboard({
  source: textToCopy.value,
  copiedDuring: 500,
});
const { copy: copyArg, copied: copiedArg } = useClipboard({
  source: textToCopy2.value,
  copiedDuring: 500,
});
</script>
