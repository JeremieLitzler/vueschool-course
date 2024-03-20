<template>
  <vue-hcaptcha
    ref="asyncExecuteHCaptcha"
    :sitekey="siteKey"
    language="en-US"
    @verify="onVerify"
    @expired="onExpire"
    @challenge-expired="onChallengeExpire"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import type CaptchaEmitNotification from '@/types/CaptchaEmitNotification';

const siteKey = import.meta.env.VITE_HCAPTCHA_SITEKEY;
const isVerified = ref(false);

const emits = defineEmits<{
  (event: '@hcaptcha-notification', entry: CaptchaEmitNotification): void;
}>();

const asyncExecuteHCaptcha = ref<VueHcaptcha | null>(null);

/**
 * The following are the callback supported by @hcaptcha package
 * @see https://github.com/hCaptcha/vue-hcaptcha?tab=readme-ov-file#callback-events
 */
/**
 * The challenge is validated.
 */
const onVerify = (_token: string, _eKey: string) => {
  // console.log('onVerify: ', { _token, _eKey });
  isVerified.value = true;
  emits('@hcaptcha-notification', { success: true });
};
/**
 * The token has expired.
 */
const onExpire = () => {
  // console.log('Token expired');
  emits('@hcaptcha-notification', {
    success: false,
    message: 'hCaptcha verification expired',
  });
};
/**
 * The challenge expired.
 */
const onChallengeExpire = () => {
  // console.log('Challenge expired');
  emits('@hcaptcha-notification', {
    success: false,
    message: 'hCaptcha challenge expired',
  });
};
/**
 * An error occured.
 */
const onError = (_err: unknown) => {
  // console.log('Error', err);
  emits('@hcaptcha-notification', {
    success: false,
    message: 'hCaptcha error',
  });
};
/**
 * Run the captcha if not verified.
 * The user is prompted to resolve the challenge.
 * On resolution, it will trigger a onVerify callback.
 */
const runCaptcha = async () => {
  if (isVerified.value) {
    //To prevent the execution to run again if the captcha is
    //verified
    return;
  }
  if (!asyncExecuteHCaptcha.value) {
    return;
  }
  await asyncExecuteHCaptcha.value!.executeAsync();
};
/**
 * Finally expose the function to the parent components using
 * this component.
 */
defineExpose({ runCaptcha });
</script>
