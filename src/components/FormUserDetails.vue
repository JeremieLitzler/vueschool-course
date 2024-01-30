<template>
  <div>
    <h1 class="title">Create Account</h1>

    <h2 class="subtitle">
      Create an account or log in to order your liquid gold subscription
    </h2>

    <form class="form">
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input
          type="text"
          v-model="$v.form.email.$model"
          placeholder="your@email.com"
          class="form-control"
          id="email"
        />
        <div
          v-if="$v.form.email.$error && !$v.form.email.required"
          class="error"
        >
          email is required
        </div>
        <div v-if="$v.form.email.$error && !$v.form.email.email" class="error">
          email is invalid
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <input
          v-model="$v.form.password.$model"
          type="password"
          placeholder="Super Secret Password"
          class="form-control"
          id="password"
        />
        <div
          v-if="$v.form.password.$error && !$v.form.password.required"
          class="error"
        >
          password is required
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          v-model="$v.form.name.$model"
          type="text"
          placeholder="What should we call you?"
          class="form-control"
          id="name"
        />
        <div v-if="$v.form.name.$error" class="error">name is required</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const form = ref({
  email: null,
  password: null,
  name: null,
});

const rules = {
  form: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
    name: {
      required,
    },
  },
};
const $v = useVuelidate(rules, form);
console.table($v.value.form);
</script>

<style scoped></style>
