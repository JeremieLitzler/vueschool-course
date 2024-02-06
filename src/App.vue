<script setup lang="ts">
import { provide } from "vue";
import { summaryAccessibilityLabelKey } from "./injectKeys.ts";
import UseClipBoard from "./components/UseClipBoard.vue";
import UseTitle from "./components/UseTitle.vue";
import UseDarkAndColorMode from "./components/UseDarkAndColorMode.vue";
import ColorFilter from "./components/ColorFilter.vue";
import OnKeyStroke from "./components/OnKeyStroke.vue";
import UseMagicKeys from "./components/UseMagicKeys.vue";

provide(summaryAccessibilityLabelKey, "Click to open or close the demo");
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <section class="use">
    <UseTitle />
  </section>
  <section class="use">
    <ColorFilter />
  </section>
  <section class="use">
    <UseClipBoard />
  </section>
  <section class="use">
    <UseDarkAndColorMode />
  </section>
  <section class="use">
    <OnKeyStroke />
  </section>
  <section class="use">
    <UseMagicKeys />
  </section>
</template>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

summary:hover,
summary:focus {
  border-bottom: 4px solid var(--theme-color-tint-10);
}
details {
  margin-bottom: 1em;
}
details summary::-webkit-details-marker,
details summary::marker {
  display: none;
  content: "";
}
details > summary {
  background-color: var(--theme-color-shade-50);
  color: var(--theme-color-tint-100);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
details > summary::after {
  content: "⬇️ Click to open";
  font-size: x-small;
  margin-right: 1em;
}
details[open] > summary::after {
  content: "⬆️ Click to close";
  font-size: x-small;
}
details[open] > summary {
  color: var(--theme-color-shade-100);
  background-color: var(--theme-color-tint-50);
}
section.use {
  border: 1px solid gray;
  border-radius: 1em;
  padding: 1em;
  margin-bottom: 1em;
}

summary {
  padding: 0.5em;
  /* border-radius: 1em 1em 100em 100em; */
}
</style>
