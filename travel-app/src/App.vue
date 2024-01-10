<template>
  <!-- <ul>
  <li class="nav-link" v-for=""></li>
  </ul> -->
  <div class="nav">
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/brazil">Brazil</RouterLink> |
    <RouterLink to="/hawaii">Hawaii</RouterLink> |
    <RouterLink to="/panama">Panama</RouterLink> |
    <RouterLink to="/jamaica">Jamaica</RouterLink> |
    <a href="http://vuejs.org" target="_blank" rel="noopener noreferrer"
      >Vue docs</a
    >
  </div>

  <div class="container">
    <RouterView></RouterView>
  </div>
</template>

<script setup></script>
<style scoped></style>
