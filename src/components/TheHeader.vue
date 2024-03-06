<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'TheHome' }">
      <img src="../assets/img/svg/vueschool-logo.svg" />
    </router-link>
    <the-nav-bar />
  </header>
</template>

<script setup lang="ts">
import TheNavBar from '@/components/TheNavBar.vue';
</script>

<style scoped></style>
