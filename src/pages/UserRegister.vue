<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input v-model="form.name" id="name" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
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

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            v-model="form.avatar"
            id="avatar"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
        <div class="error-message" v-if="error != ''">{{ error }}</div>
        <div class="form-actions text-right">
          <router-link :to="{ name: RouteName.UserLogin }">
            Already have an account?
          </router-link>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type UserRegisterRequest from '@/types/UserRegisterRequest';
import type { FirebaseError } from 'firebase/app';
import { useUserStore } from '@/stores/UserStore';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';
import objectHelper from '@/helpers/objectHelper';

import User from '@/types/User';
import { RouteName } from '@/enums/RouteName';
const { toHomePage } = useAppendRouteHelper();
const error = ref('');
const form = ref<UserRegisterRequest>({
  name: '',
  username: '',
  email: '',
  password: '',
  avatar: '',
});

const register = async () => {
  console.log('The form data >', form.value);
  const user = await useUserStore().registerUserWithEmailAndPassword({
    ...form.value,
  });
  if (!objectHelper().instanceOf<User>(user, 'username')) {
    error.value = (user as FirebaseError).message;
    return;
  }
  console.log('The created user >', user);
  toHomePage();
};
</script>

<style scoped></style>
