<template>
  <div>
    <h1>Protected Area</h1>
    <h2>Hello {{ username }}</h2>
    <button class="btn" @click="logoutUser">Logout</button>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  const username = window.user;

  const router = useRouter();
  const logoutUser  = () => {
    window.user = undefined;
    router.push({name: 'home'});
  }
</script>

<style lang="scss" scoped></style>
