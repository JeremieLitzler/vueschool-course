<script setup>
import MouseCoordinates from "./components/lesson_2/2.4.ExerciceMouse/MouseCoordinates.vue";
const screenSize = window.screen.width;
</script>

<template>
  <MouseCoordinates v-slot="{ x, y }">
    <div class="container">
      <div class="left">
        <button v-if="screenSize / 2 < x">Left</button>
      </div>
      <div class="right">
        <button v-if="screenSize / 2 > x">Right</button>
      </div>
    </div>
  </MouseCoordinates>
</template>

<style scoped>
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

.container {
  display: flex;
  width: 100%;
  /* flex-direction: column; */
}

.left {
  flex: 1;
}

.right {
  flex: 1;
}
</style>
