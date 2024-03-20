<template>
  <vee-form @submit="login" class="card card-form">
    <h1 class="text-center">Login</h1>
    <p v-if="showCheckEmailMessage" class="block-message block-message-warning">
      🚧Please use <b>{{ verifiedEmail || 'your new email' }}</b> to login
      following your recent email address update.
    </p>
    <app-form-field
      name="email"
      label="Email"
      v-model="form.email"
      rules="required|email"
      type="text"
    />
    <app-form-field
      name="password"
      label="Password"
      v-model="form.password"
      rules="required|min:8"
      type="password"
    />
    <app-captcha
      ref="captchaRef"
      @@hcaptcha-notification="notifyUserWithCaptchaResponse"
      @@hcaptcha-execute="processCaptchaExecute"
    />
    <div class="push-top">
      <!-- 
        The button below calls the runCaptcha of the app-captcha.
        In test mode, it verifies the captcha.
        See comment of BenW301 to this reply: https://stackoverflow.com/a/55317353/3910066
       -->
      <button
        @click="captchaRef.runCaptcha()"
        type="submit"
        class="btn-blue btn-block"
      >
        Log in
      </button>
      <!-- <button type="submit" class="btn-blue btn-block">Log in</button> -->
    </div>
    <div v-if="props.errorMessage != ''" class="error-message">
      {{ props.errorMessage }}
    </div>
    <div v-if="enableRegister" class="form-actions text-right">
      <router-link :to="{ name: RouteName.UserRegister }">
        Create an account?
      </router-link>
    </div>
  </vee-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getQueryStringValue } from '@/helpers/queryStringHelper';
import { RouteName } from '@/enums/RouteName';
import { AppQueryStringParam } from '@/enums/AppQueryStringParam';
import type UserLoginRequest from '@/types/UserLoginRequest';
import type PropsAppLoginForm from '@/types/PropsAppLoginForm';
import useNotification from '@/composables/useNotification';
import { NotificationType } from '@/enums/NotificationType';
import CaptchaEmitNotification from '@/types/CaptchaEmitNotification';
import AppCaptcha from '@/components/AppCaptcha.vue';

const route = useRoute();

const props = withDefaults(defineProps<PropsAppLoginForm>(), {
  enableRegister: true,
});

const emits = defineEmits<{
  (event: '@login', request: UserLoginRequest): void;
}>();

const form = ref<UserLoginRequest>({ email: '', password: '' });
const captchaPassed = ref(false);
const captchaRef = ref(AppCaptcha);
const captchaErrorMessage = ref('');
const showCheckEmailMessage = ref(false);
const verifiedEmail = ref('');
const redirectToValue = route.query[AppQueryStringParam.redirectTo] as string;

const showReconnectMessage = () => {
  if (
    !!redirectToValue &&
    redirectToValue.includes(AppQueryStringParam.showReconnectMessage)
  ) {
    showCheckEmailMessage.value = true;
    verifiedEmail.value = getQueryStringValue(
      Object.fromEntries(
        new URLSearchParams(decodeURI(redirectToValue.split('?')[1] || ''))
      ),
      AppQueryStringParam.verifiedEmail
    )!;
  }
};

showReconnectMessage();

const notifyUserWithCaptchaResponse = (response: CaptchaEmitNotification) => {
  if (response.success) {
    captchaPassed.value = true;
  } else {
    captchaErrorMessage.value = response.message!;
  }
};

const processCaptchaExecute = (executeResponse: unknown) => {
  console.log(executeResponse);

  //  login();
};
const login = async () => {
  if (!captchaPassed.value) {
    useNotification().addNotification({
      message: captchaErrorMessage.value,
      type: NotificationType.Error,
    });
  } else {
    useNotification().addNotification({
      message: 'Logging-in...',
      type: NotificationType.Success,
    });
    // emits('@login', {
    //   ...form.value,
    // });
  }
};
</script>

<style scoped></style>
