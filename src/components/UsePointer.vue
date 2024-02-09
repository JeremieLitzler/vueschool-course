<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>usePointer</pre>
    </summary>
    <h3>What is <i>usePointer useful for?</i></h3>
    <pre>{{ brush }}</pre>
    <h3>Usecase: draw something below (NOT WORKING AS TODAY)</h3>
    <label>
      Pick your brush color:
      <input type="color" v-model="brushColor" />
    </label>
    <pre>Color picked: {{ brushColor }}</pre>
    <canvas ref="canvas"></canvas>
  </details>
</template>

<script setup lang="ts">
import { inject, ref, reactive, watch /*onMounted*/ } from "vue";
import { summaryAccessibilityLabelKey } from "../injectKeys.ts";
const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

import { usePointer } from "@vueuse/core";
const brush = reactive(usePointer());
const canvas = ref<HTMLCanvasElement | null>(null);
const brushColor = ref("#000000");

watch(brush, () => {
  if (brush.pressure === 0) return;
  const context = canvas.value?.getContext("2d");
  console.log(brushColor.value);
  context!.fillStyle = `${brushColor.value}`;
  context!.fillRect(brush.x - 5, brush.y - 5, 5, 5);
  //console.log("Canvas ctx", context);
});
// onMounted(() => {
//   canvas.value?.height = document.body.clientHeight;
//   canvas.value?.width = document.body.clientWidth;
// });
</script>
<style scoped>
canvas {
  display: block;
  height: 20vh;
  width: 260px;
  box-shadow: 1em;
  border: 1px solid black;
}
</style>
