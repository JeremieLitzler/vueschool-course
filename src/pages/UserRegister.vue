<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <vee-form @submit="verifyCaptchaBeforeRegister" class="card card-form">
        <h1 class="text-center">Register</h1>
        <div class="text-center push-top">
          <button @click="loginWithGoogle" class="btn-red btn-xsmall">
            <i class="fa fa-google fa-btn"></i>Register with Google
          </button>
        </div>
        <app-form-field
          name="name"
          label="Name"
          v-model="form.name"
          rules="required|min:3"
          type="text"
        />
        <!-- using validation rules with string syntax -->
        <app-form-field
          name="username"
          label="Username"
          v-model="form.username"
          rules="required|unique|unique:users,username"
          type="text"
        />
        <!-- using validation rules with object syntax -->
        <app-form-field
          name="email"
          label="Email"
          v-model="form.email"
          :rules="{
            required: true,
            email: true,
            unique: { collectionName: 'users', prop: 'email' },
          }"
          type="email"
        />
        <app-form-field
          name="password"
          label="Password"
          v-model="form.password"
          rules="required|min:8"
          type="password"
        />
        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" />
            </div>
          </label>
          <input
            name="avatar"
            v-show="!avatarPreview"
            id="avatar"
            type="file"
            @change="handleFileUpload"
            class="form-input"
          />
        </div>
        <app-captcha
          ref="captchaRef"
          @@hcaptcha-notification="notifyUserWithCaptchaResponse"
        />
        <div class="form-actions">
          <button
            @click="captchaRef.runCaptcha()"
            type="submit"
            class="btn-blue btn-block"
          >
            Register
          </button>
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
import { Form as VeeForm } from 'vee-validate';

import type User from '@/types/User';
// import type UserRegisterRequest from '@/types/UserRegisterRequest';
import type { FirebaseError } from 'firebase/app';
import type FileUploadEvent from '@/types/FileUploadEvent';
import type UserRegisterRequest from '@/types/UserRegisterRequest';
import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
import appendRouteHelper from '@/helpers/appendRouteHelper';
import objectHelper from '@/helpers/objectHelper';
import AppCaptcha from '@/components/AppCaptcha.vue';
import CaptchaEmitNotification from '@/types/CaptchaEmitNotification';
import useNotification from '@/composables/useNotification';
import { NotificationType } from '@/enums/NotificationType';

const { toSuccessRedirect } = appendRouteHelper();

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
const captchaPassed = ref(false);
const captchaRef = ref(AppCaptcha);
const captchaErrorMessage = ref('');

const avatarPreview = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

const handleFileUpload = (uploadEvent: Event) => {
  //console.log('UserRegister>handleFileUpload', uploadEvent);

  avatarFile.value = (uploadEvent as FileUploadEvent).target!.files[0];
  //console.log('UserRegister>handleFileUpload', form.value.avatarFile);
  const reader = new FileReader();
  //TODO: bug > preview is not displayed
  reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
    //console.log('reader.onload>result', readerEvent.target!.result as string);
    avatarPreview.value = readerEvent.target!.result as string;
  };
  if (form.value.avatar) reader.readAsDataURL(avatarFile.value as Blob);
};

const notifyUserWithCaptchaResponse = (response: CaptchaEmitNotification) => {
  if (response.success) {
    captchaPassed.value = true;
  } else {
    captchaPassed.value = false;
    captchaErrorMessage.value =
      '🚧 Please resolve the captcha challenge to login.';
  }
};
const verifyCaptchaBeforeRegister = async (
  _values: Record<string, unknown>
) => {
  if (!captchaPassed.value) {
    useNotification().addNotification({
      message: captchaErrorMessage.value,
      type: NotificationType.Error,
    });
  } else {
    register(_values);
  }
};
const register = async (_values: Record<string, unknown>) => {
  const user = await useUserStore().registerUserWithEmailAndPassword({
    avatar: form.value.avatar,
    avatarFile: avatarFile.value,
    email: form.value.email,
    name: form.value.name,
    username: form.value.username,
    password: form.value.password,
  });
  if (!objectHelper().propExistsInObject<User>(user, 'username')) {
    error.value = (user as FirebaseError).message;
    return;
  }
  await router.push(toSuccessRedirect(route));
};
const loginWithGoogle = async () => {
  await useUserStore().loginWithGoogle();
  await router.push(toSuccessRedirect(route));
};
</script>

<style scoped></style>
