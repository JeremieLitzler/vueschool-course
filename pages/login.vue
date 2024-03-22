<template>
  <form @submit.prevent="">
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
  </form>
</template>

<script setup>
const form = ref({ username: '', password: '' });

definePageMeta({
  layout: 'plain',
});
</script>

<style scoped></style>
