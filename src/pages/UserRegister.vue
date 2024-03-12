<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>
        <div class="text-center push-top">
          <button @click="loginWithGoogle" class="btn-red btn-xsmall">
            <i class="fa fa-google fa-btn"></i>Register with Google
          </button>
        </div>

        <div class="form-group push-top">
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
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" />
            </div>
          </label>
          <input
            v-show="!avatarPreview"
            id="avatar"
            type="file"
            @change="handleFileUpload"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type User from '@/types/User';
import type UserRegisterRequest from '@/types/UserRegisterRequest';
import type { FirebaseError } from 'firebase/app';
import type FileUploadEvent from '@/types/FileUploadEvent';
import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';
import objectHelper from '@/helpers/objectHelper';

const { toSuccessRedirect } = useAppendRouteHelper();
const error = ref('');
const form = ref<UserRegisterRequest>({
  name: '',
  username: '',
  email: '',
  password: '',
  avatarFile: null,
  avatar: '',
});

const avatarPreview = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

const handleFileUpload = (uploadEvent: Event) => {
  //console.log('UserRegister>handleFileUpload', uploadEvent);

  form.value.avatarFile = (uploadEvent as FileUploadEvent).target!.files[0];
  //console.log('UserRegister>handleFileUpload', form.value.avatarFile);
  const reader = new FileReader();
  //TODO: preview is not displayed
  reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
    //console.log('reader.onload>result', readerEvent.target!.result as string);
    avatarPreview.value = readerEvent.target!.result as string;
  };
  if (form.value.avatar) reader.readAsDataURL(form.value.avatarFile as Blob);
};
const register = async () => {
  //console.log('The form data >', form.value);
  const user = await useUserStore().registerUserWithEmailAndPassword({
    ...form.value,
  });
  if (!objectHelper().instanceOf<User>(user, 'username')) {
    error.value = (user as FirebaseError).message;
    return;
  }
  //console.log('The created user >', user);
  await router.push(toSuccessRedirect(route));
};
const loginWithGoogle = async () => {
  await useUserStore().loginWithGoogle();
  await router.push(toSuccessRedirect(route));
};
</script>

<style scoped></style>
