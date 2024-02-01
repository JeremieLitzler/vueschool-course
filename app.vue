<script setup lang="ts">
const formData = ref({
  username: "Jeremiel",
  password: "",
});

async function submit(data: Object): void {
  await wait(3000);
  console.log(data);
}
</script>
<template>
  <FormKit
    type="form"
    :value="formData"
    @submit="submit"
    submit-label="Login"
    :actions="false"
  >
    <template #default="{ state }">
      <h1>Login</h1>
      <FormKit type="text" label="Username" name="username" />
      <FormKit
        type="password"
        label="Password"
        name="password"
        validation="required"
      />
      <FormKit type="checkbox" label="Remember me?" name="rememberMe" />
      <button :disabled="state.loading">
        {{ state.loading ? "Logging-in you..." : "Login" }}
      </button>
    </template>
  </FormKit>
</template>
