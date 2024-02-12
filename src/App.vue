<script setup lang="ts">
import { provide } from "vue";
import { summaryAccessibilityLabelKey } from "./injectKeys.ts";
import UseClipBoard from "./components/UseClipBoard.vue";
import UseTitle from "./components/UseTitle.vue";
import UseDarkAndColorMode from "./components/UseDarkAndColorMode.vue";
import ColorFilter from "./components/ColorFilter.vue";
import OnKeyStroke from "./components/OnKeyStroke.vue";
import UseMagicKeys from "./components/UseMagicKeys.vue";
import UseBattery from "./components/UseBattery.vue";
import UseOnlineAndNetwork from "./components/UseOnlineAndNetwork.vue";
import UseGeolocation from "./components/UseGeolocation.vue";
import UsePageLeave from "./components/UsePageLeave.vue";
import UsePageLeaveWithNativeDialog from "./components/UsePageLeaveWithNativeDialog.vue";
import UsePointer from "./components/UsePointer.vue";
import UseRafFn from "./components/UseRafFn.vue";
import UseTimeout from "./components/UseTimeout.vue";
import UseTimestamp from "./components/UseTimestamp.vue";
import UseTransition from "./components/UseTransition.vue";
import UseRefHistory from "./components/UseRefHistory.vue";

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
  <section class="use">
    <UseBattery />
  </section>
  <section class="use">
    <UseOnlineAndNetwork />
  </section>
  <section class="use">
    <UseGeolocation />
  </section>
  <section class="use">
    <UsePageLeave />
  </section>
  <section class="use">
    <UsePageLeaveWithNativeDialog />
  </section>
  <section class="use">
    <UsePointer />
  </section>
  <section class="use">
    <UseRafFn />
  </section>
  <section class="use">
    <UseTimeout />
  </section>
  <section class="use">
    <UseTimestamp />
  </section>
  <section class="use">
    <UseTransition />
  </section>
  <section class="use" id="Use-Ref-History">
    <UseRefHistory />
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
details {
  padding: 1em;
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
  padding: 0 0.5em;
  border-radius: 0.5em;
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
  margin-bottom: 1em;
}

summary {
  padding: 0.5em;
  /* border-radius: 1em 1em 100em 100em; */
}
</style>
