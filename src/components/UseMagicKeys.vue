<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>onKeyStroke</pre>
    </summary>
    <h2>Demo from Vueuse docs</h2>
    <p>Instructions: press any key simultaneously to update the Set below.</p>
    <p>Simultaneously pressed keys:</p>
    <pre>{{ current }}</pre>
    <p>
      🫸 : si vous faites un CTRL+S ou CTRL+P, votre navigateur réagira comme il
      se doit...
    </p>
    <p>... and try <i>a+s</i></p>
    <p v-if="a_s_pressed">You did it! This will remain displayed</p>
    <p>... and try <i>a+w</i></p>
    <p v-if="a_w">
      You did it!
      <strong>But this will disappear as soon as you release the key...</strong>
    </p>
  </details>
</template>

<script setup lang="ts">
import { ref, inject, watch } from "vue";
import { useMagicKeys, whenever } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);
const { a_s, a_w, current } = useMagicKeys();
const a_s_pressed = ref(false);
whenever(a_s, (pressed) => (a_s_pressed.value = pressed));
const a_w_pressed = ref(false);
watch(a_w, (pressed) => (a_w_pressed.value = pressed));
</script>
<style scoped></style>
