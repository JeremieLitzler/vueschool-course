<template>
  <dialog ref="nativeDialogEl" class="modal-overlay">
    <section class="modal-content">
      <form method="dialog">
        <button
          class="close"
          aria-label="Click or Hit ESC"
          title="Click or Hit ESC"
        >
          Cancel
        </button>
      </form>
      <article>
        <h3>You're authentication cookie is too old 😟</h3>
        <p>Please enter your credentials again 🗝️</p>
        <app-login-form :errorMessage="errorMessage" @@login="login" />
      </article>
    </section>
  </dialog>
</template>

<script setup lang="ts">
//TODO: bug > From UserProfileCardEditor, I pass on displayModal to trigger showModal native
//      method of the dialog element.
//      But the 'nativeDialogEl.value' in showNativeDialog is null... resulting in not
//      calling showModal() and not displaying the modal
//      I tried to set the 'open' attribut on the dialog element, but the focus is not
//      top-layered as expected (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)
//      I put the exact same code below in the UserProfileCardEditor directly: it works...
//
//      Why?
//      Create a bug on Vue.js repo for help providing a working demo.
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import type UserLoginRequest from '@/types/UserLoginRequest';
import type { FirebaseError } from 'firebase/app';

const errorMessage = ref('');

const props = defineProps<{ displayModal: boolean }>();
const emits = defineEmits<{
  (event: '@logged-back', success: boolean): void;
}>();

const login = async (request: UserLoginRequest) => {
  //console.log(form.value);
  const result = await useUserStore().loginWithEmailAndPassword({
    ...request,
  });
  const error = result as FirebaseError;
  if (error['name'] === 'FirebaseError') {
    errorMessage.value = error.message;
  } else {
    console.log('Reauthenticated successfully!');
    hideNativeDialog();
    // emits('@logged-back', true);
  }
};

const nativeDialogEl = ref<HTMLDialogElement | null>(null);
const showNativeDialog = () => {
  console.log(
    'UserProfileCardEditorReauthenticate>showNativeDialog>nativeDialogEl',
    nativeDialogEl.value
  );
  nativeDialogEl.value?.showModal();
  console.log(
    'UserProfileCardEditorReauthenticate>showNativeDialog>showModal called'
  );
};
const hideNativeDialog = () => nativeDialogEl.value?.close();

if (props.displayModal) {
  console.log('user-profile-card-editor-reauthenticate>showModal triggered');
  showNativeDialog();
}
</script>

<style scoped>
/* The Modal (background) */
.modal-overlay {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
dialog .close {
  font-size: 1rem;
  border-radius: 10em;
  padding: 0.25em 0.5em;
  color: var(--light-main);
}
</style>
