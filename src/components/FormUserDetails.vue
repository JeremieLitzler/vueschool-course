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
          @blur="submitUserData"
          type="text"
          v-model="v$.userForm.email.$model"
          placeholder="your@email.com"
          class="form-control"
          id="email"
        />
        <div
          v-if="v$.userForm.email.$error && !v$.userForm.email.required"
          class="error"
        >
          email is required
        </div>
        {{ v$.userForm.email }}
        <div
          v-if="v$.userForm.email.$error && !v$.userForm.email.email"
          class="error"
        >
          email is invalid
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <input
          @blur="submitUserData"
          v-model="v$.userForm.password.$model"
          type="password"
          placeholder="Super Secret Password"
          class="form-control"
          id="password"
        />
        {{ v$.userForm.password }}

        <div
          v-if="!v$.userForm.password.$error && !v$.userForm.password.required"
          class="error"
        >
          password is required
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          @blur="submitUserData"
          v-model="v$.userForm.name.$model"
          type="text"
          placeholder="What should we call you?"
          class="form-control"
          id="name"
        />
        {{ v$.userForm.name }}

        <div v-if="v$.userForm.name.$error" class="error">name is required</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const userForm = ref({
  email: null,
  password: null,
  name: null,
});

const rules = {
  userForm: {
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
const v$ = useVuelidate(rules, userForm);

const emit = defineEmits(["setUserInfo"]);
const submitUserData = () => {
  console.log("v$ > ", v$);
  console.log("v$.$invalid > ", v$.$invalid);
  if (!v$.$invalid) {
    emit("setUserInfo", userForm.value);
  } else {
    console.log("Form is invalid...");
  }
};
</script>

<style scoped></style>
