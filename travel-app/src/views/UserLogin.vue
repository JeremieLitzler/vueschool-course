<template>
  <div class="login">
    <form class="form" @submit.prevent="loginUser">
      <h1>Login</h1>
      <label>
        Username:
        <input type="text" class="input" v-model="username" />
      </label>
      <label>
        Password:
        <input type="password" class="input" v-model="password" />
      </label>
      <button class="btn">Login</button>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const username = ref("");
  const password = ref("");

  const loginUser = () => {
    window.userLogged = `{user: ${username.value}, password: ${password.value}}`;
    router.push({name: 'protected'});
  }
</script>

<style lang="scss" scoped></style>
