<template>
  <div>
    <h1>dashboard Area</h1>
    <h2>Hello {{ username }}</h2>
    <section>
      <h3>Your invoices</h3>
      <router-link :to="{name: 'invoices'}"
        ><button class="btn">Go to Invoices</button></router-link
      >
    </section>
    <button class="btn" @click="logoutUser">Logout</button>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  const userLogged = JSON.parse(window.userLogged);
  const { user: username } = userLogged;

  const router = useRouter();
  const logoutUser  = () => {
    window.userLogged = undefined;
    router.push({name: 'home'});
  }
</script>

<style lang="scss" scoped></style>
