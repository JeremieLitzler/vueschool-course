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
  <FormKit type="form" :value="formData" @submit="submit" submit-label="Login">
    <h1>Login</h1>
    <FormKit
      validation="(500)username_is_unique"
      :validation-messages="{ username_is_unique({args, name, node}) : string {
        return `${node.value} is already taken!`;
      }}"
      type="text"
      label="Username"
      name="username"
    />
    <FormKit
      type="password"
      label="Password"
      name="password"
      validation="required|alpha|length:10-30"
    />
    <FormKit type="checkbox" label="Remember me?" name="rememberMe" />
  </FormKit>
</template>
