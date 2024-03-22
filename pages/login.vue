<template>
  <form @submit.prevent="login">
    <label>
      Login
      <input
        v-model="form.username"
        type="text"
        name="username"
        id="username"
      />
    </label>
    <label>
      Password
      <input
        v-model="form.password"
        type="password"
        name="password"
        id="password"
      />
    </label>
    <button>Login</button>
    <p v-if="logging">Logging in...</p>
  </form>
  <pre>{{ isLoggedIn }}</pre>
</template>

<script setup lang="ts">
useHead({
  title: 'Login',
  meta: [
    {
      name: 'description',
      content: 'To manage your favorite movies, please login',
    },
  ],
});

definePageMeta({
  layout: 'plain',
});

const form = ref({ username: '', password: '' });
const logging = ref(false);
const isLoggedIn = userIsLoggedIn();

const login = async () => {
  logging.value = true;
  isLoggedIn.value = true;
  await useRouter().push({ name: 'index' });
  logging.value = false;
};
</script>

<style scoped></style>
