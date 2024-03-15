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
    <div class="push-top">
      <button type="submit" class="btn-blue btn-block">Log in</button>
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

const route = useRoute();
const form = ref<UserLoginRequest>({ email: '', password: '' });

interface AppLoginFormProps {
  enableRegister: boolean;
  errorMessage?: string;
}
const props = withDefaults(defineProps<AppLoginFormProps>(), {
  enableRegister: true,
});
const emits = defineEmits<{
  (event: '@login', request: UserLoginRequest): void;
}>();

const showCheckEmailMessage = ref(false);
const verifiedEmail = ref('');
console.log('redirectTo', route.query[AppQueryStringParam.redirectTo]);

const redirectToValue = route.query[AppQueryStringParam.redirectTo] as string;
console.log(redirectToValue);

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
const login = async () => {
  emits('@login', {
    ...form.value,
  });
};
</script>

<style scoped></style>
