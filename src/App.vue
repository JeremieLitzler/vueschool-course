<script setup>
import { ref } from 'vue';
import Swiper from './components/Swiper.vue';
import SwiperSlide from './components/SwiperSlide.vue';
import images from './images.json';

const index = ref(0);
</script>

<template>
  <section>
    <Swiper
      :list="images"
      :index="index"
      v-slot="{ item }"
      @change="index = $event"
    >
      <SwiperSlide v-bind="item" />
    </Swiper>
  </section>
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
</style>
