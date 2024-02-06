<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>onKeyStroke</pre>
    </summary>
    <h2>Demo from Vueuse docs</h2>
    <div class="container border-base">
      <div
        class="ball"
        :style="{ transform: `translate(${translateX}px, ${translateY}px)` }"
      />
    </div>
    <div class="text-center mt-4">
      <p>
        Use the arrow keys or w (up), a (left), s (down) or d (right) keys to
        control the movement of the ball.
      </p>
      <p>
        Repeated events are ignored on the key <i>`d`</i> or <i>`->`</i> (see
        property <i>`dedupe`</i>).
      </p>
    </div>
    <h2>Demo from Vueschool course</h2>
    <div class="container border-base">
      <div
        class="ball2"
        :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
      ></div>
      <input type="text" />
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { onKeyStroke } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const translateX = ref(0);
const translateY = ref(0);

onKeyStroke(["w", "W", "ArrowUp"], () => {
  translateY.value -= 10;
});

onKeyStroke(["s", "S", "ArrowDown"], () => {
  translateY.value += 10;
});

onKeyStroke(["a", "A", "ArrowLeft"], () => {
  translateX.value -= 10;
});

onKeyStroke(
  ["d", "D", "ArrowRight"],
  () => {
    translateX.value += 10;
  },
  { dedupe: true }
);

const controls = {
  ArrowDown: () => (position.value.y += 5),
  ArrowUp: () => (position.value.y -= 5),
  ArrowRight: () => (position.value.x += 5),
  ArrowLeft: () => (position.value.x -= 5),
};

onKeyStroke(Object.keys(controls), (e) => {
  e.preventDefault();
  controls[e.key]();
});

const position = ref({ x: 0, y: 0 });
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  height: 100px;
  margin: auto;
  overflow: hidden;
  border: 1px solid #a1a1a130;
  border-radius: 5px;
}

.ball {
  width: 16px;
  height: 16px;
  background: #a1a1a1;
  border-radius: 50%;
}
.ball2 {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  position: absolute;
}
</style>
