<script setup lang="ts">
import { FormKitSchema, createInput } from "@formkit/vue";
import VueMultiSelectFormKit from "@/formkit-components/VueMultiSelectFormKit.vue";

const multiSelect = createInput(VueMultiSelectFormKit);
const formData = ref([]);

async function submit(data: Object): Promise<void> {
  await wait(3000);
  console.log(data);
}
</script>
<template>
  <h1>FormKit demos</h1>
  <h2>FormKit Schema demo</h2>
  <FormKitSchema
    :data="{ formData, attrs: { onSubmit: submit } }"
    :schema="[
      {
        $formkit: 'form',
        submitLabel: 'Login',
        value: '$formData',
        bind: '$attrs',
        children: [
          { $el: 'h3', children: 'Login' },
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
          //{
          //  $formkit: 'multiSelect',
          //  label: 'Framework',
          //  options: ['Vue', 'React', 'Svelte'],
          //  multiple: true,
          //},
        ],
      },
    ]"
  />
  <h2>FormKit Pro démo</h2>
  <pre>{{ formData }}</pre>
  <FormKit
    v-model="formData"
    id="repeater"
    name="users"
    type="repeater"
    label="Users"
  >
    <FormKit
      type="email"
      label="Email"
      name="email"
      validation="required|email"
      placeholder="Add email address..."
    />
    <FormKit type="text" label="Name" name="name" validation="required" />
    <FormKit type="toggle" name="toggle" label="Is Admin" />
  </FormKit>
</template>
