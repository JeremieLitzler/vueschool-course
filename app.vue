<script setup lang="ts">
import type { FormKitSchema } from "@formkit/vue";
const formData = ref({
  username: "Jeremiel",
  password: "",
});

async function submit(data: Object): Promise<void> {
  await wait(3000);
  console.log(data);
}
</script>
<template>
  <FormKitSchema
    :data="{ formData, attrs: { onSubmit: submit } }"
    :schema="[
      {
        $formkit: 'form',
        submitLabel: 'Login',
        value: '$formData',
        bind: '$attrs',
        children: [
          { $el: 'h1', children: 'Login' },
          {
            validation: '(500)username_is_unique',
            $formkit: 'text',
            label: 'Username',
            name: 'username',
            help: 'Please fill out your username',
          },
          {
            $formkit: 'password',
            label: 'Password',
            name: 'password',
            validation: 'required|alpha|length:10-30',
            if: '$value.username',
          },
          {
            $formkit: 'checkbox',
            label: 'Remember me?',
            name: 'rememberMe',
            if: '$value.username',
          },
        ],
      },
    ]"
  />
</template>
