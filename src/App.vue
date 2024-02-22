<template>
  <!-- <section v-if="fetchingSomething" class="loading">Loading...</section> -->
  <!-- <section v-else> -->
  <the-header />
  <div class="container"><router-view /></div>
  <!-- </section> -->
</template>
<script setup lang="ts">
// import { computed } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
// import { useCommonStore } from './stores/CommonStore';

// const fetchingSomething = computed(() => useCommonStore().fetching);
</script>

<style scoped></style>
