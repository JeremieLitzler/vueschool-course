<template>
  <the-header />
  <div class="container"><router-view /></div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
</script>

<style scoped></style>
