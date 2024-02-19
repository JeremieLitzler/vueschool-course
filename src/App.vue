<template>
  <the-nav-bar />
  <div class="container"><router-view /></div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheNavBar from '@/components/TheNavBar.vue';
</script>

<style scoped></style>
