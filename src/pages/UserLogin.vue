<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <app-login-form :errorMessage="errorMessage" @@login="login" />
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
import { useUserStore } from '@/stores/UserStore';
import { FirebaseError } from 'firebase/app';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';
import UserLoginRequest from '@/types/UserLoginRequest';

const route = useRoute();
const router = useRouter();
const { toSuccessRedirect } = useAppendRouteHelper();
const errorMessage = ref('');
const login = async (request: UserLoginRequest) => {
  //console.log(form.value);
  const result = await useUserStore().loginWithEmailAndPassword({
    ...request,
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
