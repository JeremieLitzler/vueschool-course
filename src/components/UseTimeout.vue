<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>useTimout</pre>
    </summary>
    <article>
      <h3>Toast- notification</h3>
      <label>
        Timeout in miliseconds
        <input type="number" v-model="timeoutLength" />
      </label>
      <div class="alert">
        This is a nice notification...
        <button @cliclikek="stop">Close early</button>
      </div>

      <transition appear>
        <div v-if="!ready" class="alert">
          This is a nice notification... that will disappear!
          <button @click="stop">Close early</button>
        </div>
      </transition>
      <button @click="start">Show alert again</button>
    </article>
    <article>
      <h3>Toast- notification with stop on mouse hover</h3>
      <p>Hover the notification before it disappears (within 5 seconds)!</p>
      <p>
        Then move the mouse away from the the notification to make it disappear
        (within 5 seconds)!
      </p>
      <transition appear>
        <div
          v-if="showAlert"
          @mouseenter="stopFn"
          @mouseleave="startFn"
          class="alert"
        >
          This is a nice notification... that will disappear!
          <pre>{{ isPending }}</pre>
          <button @click="stopFn">Close early</button>
        </div>
      </transition>
    </article>
  </details>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useTimeout, useTimeoutFn } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const timeoutLength = ref(3000);
const { ready, start, stop } = useTimeout(timeoutLength.value, {
  controls: true,
});

const timeoutLengthHover = ref(5000);
const showAlert = ref(true);
const {
  isPending,
  start: startFn,
  stop: stopFn,
} = useTimeoutFn(() => {
  showAlert.value = false;
}, timeoutLengthHover.value);
</script>
<style scoped>
.alert {
  margin: 1em;
  padding: 0.5em;
  border-radius: 0.5em;
  border: 1px solid var(--theme-color-tint-10);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
