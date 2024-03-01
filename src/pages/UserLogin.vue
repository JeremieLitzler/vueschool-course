<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="login" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="text"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>
        <div v-if="errorMessage != ''" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="form-actions text-right">
          <router-link :to="{ name: RouteName.UserRegister }">
            Create an account?
          </router-link>
        </div>
      </form>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';
import UserLoginRequest from '@/types/UserLoginRequest';
import { FirebaseError } from 'firebase/app';

const { toHomePage } = useAppendRouteHelper();
const form = ref<UserLoginRequest>({ email: '', password: '' });
const errorMessage = ref('');

const login = async () => {
  console.log(form.value);
  const result = await useUserStore().loginWithEmailAndPassword({
    ...form.value,
  });
  const error = result as FirebaseError;
  if (error['name'] === 'FirebaseError') {
    errorMessage.value = error.message;
  } else {
    console.log('UserLogin > login:', result);
    toHomePage();
  }
};
</script>

<style scoped></style>
