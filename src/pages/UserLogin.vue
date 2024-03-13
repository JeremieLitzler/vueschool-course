<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <vee-form @submit.prevent="login" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <vee-field
            name="email"
            label="Email"
            v-model="form.email"
            rules="required|email"
            id="email"
            type="text"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <vee-field
            name="password"
            label="Password"
            v-model="form.password"
            rules="required|min:8"
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
      </vee-form>

      <div class="push-top text-center">
        <button @click="loginWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
import UserLoginRequest from '@/types/UserLoginRequest';
import { FirebaseError } from 'firebase/app';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';

const route = useRoute();
const router = useRouter();
const { toSuccessRedirect } = useAppendRouteHelper();
const form = ref<UserLoginRequest>({ email: '', password: '' });
const errorMessage = ref('');

const login = async () => {
  //console.log(form.value);
  const result = await useUserStore().loginWithEmailAndPassword({
    ...form.value,
  });
  const error = result as FirebaseError;
  if (error['name'] === 'FirebaseError') {
    errorMessage.value = error.message;
  } else {
    //console.log('UserLogin > login:', result);
    await router.push(toSuccessRedirect(route));
  }
};
const loginWithGoogle = async () => {
  await useUserStore().loginWithGoogle();
  await router.push(toSuccessRedirect(route));
};
</script>

<style scoped></style>
