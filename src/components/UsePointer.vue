<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>usePointer & useElementBounding</pre>
    </summary>
    <h3>What is <i>usePointer useful for?</i></h3>
    <pre>{{ brush }}</pre>
    <h3>Usecase: draw something below</h3>
    <label>
      Pick your brush color:
      <input type="color" v-model="brushColor" />
    </label>
    <pre>Color picked: {{ brushColor }}</pre>
    <pre>Mouse position: {{ xMouse }} x {{ yMouse }} </pre>
    <pre>
Canvas position: {{ Math.round(canvasPosition.x.value) }} x {{
        Math.round(canvasPosition.y.value)
      }}</pre
    >
    <pre>
Brush position (in regards to document): {{ Math.round(brush.x) }} x {{
        Math.round(brush.y)
      }}</pre
    >
    <pre>
Brush position (in regards to canvas): {{ Math.round(xCanvasOffset) }} x {{
        Math.round(yCanvasOffset)
      }}</pre
    >
    <canvas ref="canvas"></canvas>
    <button @click="clear" class="btn spaced">Clear drawing</button>
  </details>
</template>

<script setup lang="ts">
import { inject, ref, reactive, watch, computed /*onMounted*/ } from 'vue';
import { summaryAccessibilityLabelKey } from '../injectKeys.ts';
const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

import { usePointer, useElementBounding, useMouse } from '@vueuse/core';
const { x: xMouse, x: yMouse } = useMouse();
const canvas = ref<HTMLCanvasElement | null>(null);
const canvasPosition = useElementBounding(canvas);
const brush = reactive(usePointer());

const xCanvasOffset = computed(() => brush.x - canvasPosition.x.value);
const yCanvasOffset = computed(() => (brush.y - canvasPosition.y.value) / 2);

const brushColor = ref('#000000');

watch(brush, () => {
  if (brush.pressure === 0) return;
  const context = canvas.value?.getContext('2d');
  console.log(brushColor.value);
  context!.fillStyle = `${brushColor.value}`;
  context!.fillRect(xCanvasOffset.value - 5, yCanvasOffset.value - 5, 5, 5);
  //console.log("Canvas ctx", context);
});
// onMounted(() => {
//   canvas.value?.height = document.body.clientHeight;
//   canvas.value?.width = document.body.clientWidth;
// });
const clear = () => {
  const context = canvas.value?.getContext('2d');
  context?.clearRect(
    canvasPosition.x.value,
    canvasPosition.y.value,
    canvasPosition.width.value,
    canvasPosition.height.value
  );
};
</script>
<style scoped>
canvas {
  display: block;
  height: 40vh;
  min-width: 15vh;
  max-width: 18em;
  box-shadow: 1em;
  border: 1px solid black;
}
</style>
