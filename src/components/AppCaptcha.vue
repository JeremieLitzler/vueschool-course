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

const emits = defineEmits<{
  (event: '@hcaptcha-execute', entry: unknown): void;
  (event: '@hcaptcha-notification', entry: CaptchaEmitNotification): void;
}>();

const asyncExecuteHCaptcha = ref<VueHcaptcha | null>(null);

const onVerify = (token: string, eKey: string) => {
  console.log('Verified: ', { token, eKey });
  emits('@hcaptcha-notification', { success: true });
};
const onExpire = () => {
  console.log('Token expired');
  emits('@hcaptcha-notification', {
    success: false,
    message: 'hCaptcha verification expired',
  });
};
const onChallengeExpire = () => {
  console.log('Challenge expired');
  emits('@hcaptcha-notification', {
    success: false,
    message: 'hCaptcha challenge expired',
  });
};
const onError = (err: unknown) => {
  console.log('Error', err);
  emits('@hcaptcha-notification', {
    success: false,
    message: 'hCaptcha error',
  });
};

const runCaptcha = async () => {
  if (!asyncExecuteHCaptcha.value) {
    return;
  }

  const executeResponse = await asyncExecuteHCaptcha.value!.executeAsync();
  emits('@hcaptcha-execute', executeResponse);
};
defineExpose({ runCaptcha });
</script>
