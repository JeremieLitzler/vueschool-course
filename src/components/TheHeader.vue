<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'TheHome' }">
      <img src="../assets/img/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>
    <the-nav-bar />
  </header>
</template>

<script setup lang="ts">
import TheNavBar from '@/components/TheNavBar.vue';
</script>

<style scoped></style>
