<script setup lang="ts">
import UseClipBoard from "./components/UseClipBoard.vue";
import UseTitle from "./components/UseTitle.vue";
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
    <UseClipBoard />
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
details summary::-webkit-details-marker,
details summary::marker {
  display: none;
  content: "";
}
details[open] > summary {
  background-color: bisque;
}
section.use {
  border: 1px solid gray;
  border-radius: 1em;
  padding: 1em;
  margin-bottom: 1em;
}

summary {
  background-color: beige;
  color: #333;
  padding: 0.5em 0em;
  border-radius: 1em 1em 100em 100em;
}
</style>
