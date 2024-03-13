<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <vee-form
        @submit="register"
        @invalid-submit="handleErrors"
        class="card card-form"
      >
        <h1 class="text-center">Register</h1>
        <div class="text-center push-top">
          <button @click="loginWithGoogle" class="btn-red btn-xsmall">
            <i class="fa fa-google fa-btn"></i>Register with Google
          </button>
        </div>

        <div class="form-group push-top">
          <label for="name">Full Name</label>
          <vee-field
            name="name"
            v-model="form.name"
            rules="required"
            id="name"
            type="text"
            class="form-input"
          />
          <vee-error-message class="error-message" name="name" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <vee-field
            name="username"
            v-model="form.username"
            rules="required"
            id="username"
            type="text"
            class="form-input"
          />
          <vee-error-message class="error-message" name="username" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <vee-field
            name="email"
            v-model="form.email"
            rules="required"
            id="email"
            type="email"
            class="form-input"
          />
          <vee-error-message class="error-message" name="email" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <vee-field
            name="password"
            v-model="form.password"
            rules="required"
            id="password"
            type="password"
            class="form-input"
          />
          <vee-error-message class="error-message" name="password" />
        </div>

        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" />
            </div>
          </label>
          <vee-field
            name="avatar"
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
      </vee-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage as VeeErrorMessage,
  GenericObject,
  InvalidSubmissionContext,
} from 'vee-validate';

import type User from '@/types/User';
// import type UserRegisterRequest from '@/types/UserRegisterRequest';
import type { FirebaseError } from 'firebase/app';
import type FileUploadEvent from '@/types/FileUploadEvent';
import type UserRegisterRequest from '@/types/UserRegisterRequest';
import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';
import objectHelper from '@/helpers/objectHelper';

const { toSuccessRedirect } = useAppendRouteHelper();

const form = ref<UserRegisterRequest>({
  name: '',
  username: '',
  email: '',
  password: '',
  avatarFile: null,
  avatar: '',
});

const error = ref('');
const avatarFile = ref<File | null>(null);

const avatarPreview = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

const handleFileUpload = (uploadEvent: Event) => {
  //console.log('UserRegister>handleFileUpload', uploadEvent);

  avatarFile.value = (uploadEvent as FileUploadEvent).target!.files[0];
  //console.log('UserRegister>handleFileUpload', form.value.avatarFile);
  const reader = new FileReader();
  //TODO: preview is not displayed
  reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
    //console.log('reader.onload>result', readerEvent.target!.result as string);
    avatarPreview.value = readerEvent.target!.result as string;
  };
  if (form.value.avatar) reader.readAsDataURL(avatarFile.value as Blob);
};

const handleErrors = ({
  errors,
  results,
}: InvalidSubmissionContext<GenericObject>) => {
  // console.log('UserRegister>handleErrors>context', context);
  console.log('UserRegister>handleErrors>errors', errors);
  console.log('UserRegister>handleErrors>results', results);
};

const register = async (values: Record<string, unknown>) => {
  if (values) {
    console.log('UserRegister>register', values);
  }
  //console.log('The form data >', form.value);
  const user = await useUserStore().registerUserWithEmailAndPassword({
    avatar: form.value.avatar,
    avatarFile: avatarFile.value,
    email: form.value.email,
    name: form.value.name,
    username: form.value.username,
    password: form.value.password,
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
