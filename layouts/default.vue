<script setup lang="ts">
const isLoggedIn = userIsLoggedIn();
</script>

<template>
  <nav>
    <nuxt-link class="nav-link" to="/">Home</nuxt-link>
    <nuxt-link class="nav-link" to="/movies">Movies</nuxt-link>
    <nuxt-link class="nav-link" v-if="isLoggedIn" to="/admin">Admin </nuxt-link>
    <nuxt-link class="nav-link" v-if="!isLoggedIn" to="/login">Login</nuxt-link>
    <nuxt-link class="nav-link" v-else to="/logout">Logout</nuxt-link>
    <nuxt-link
      class="nav-link"
      to="https://vueschool.io/courses"
      target="_blank"
      >VueSchool</nuxt-link
    >
  </nav>
  <slot></slot>
</template>
<style scoped>
.nav-link::after {
  content: '|';
  padding: 0 0.25em;
}
.nav-link:last-child::after {
  content: '';
}
</style>
