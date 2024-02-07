<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>usePageLeave & native dialog element</pre>
    </summary>
    Try to move your cursor out of the window...
    <pre>
Cursor hovering the browser window? {{ userHasLeftWindow ? "No" : "Yes" }}</pre
    >
    <label>
      Want to see native dialog as cursor leaves windows? Check the box ➡️
      <input type="checkbox" v-model="callDemoUserHasLeftWindowDialog" />
    </label>
    <hr />
    <button @click="showNativeDialog()">Show native dialog</button>
  </details>
  <dialog ref="nativeDialogEl" class="modal-overlay">
    <section class="modal-content">
      <form method="dialog">
        <button
          class="close"
          aria-label="Click or Hit ESC"
          title="Click or Hit ESC"
        >
          Close
        </button>
      </form>
      <article>
        <h3>You are leaving? 😟</h3>
        <p>Please don't, pleasssse stay to enjoy more of VueUse ⚡</p>
        <p>
          Using <i>usePageLeave</i> and
          <i>Native dialog for BEST accessibility</i>
        </p>
        <form @submit.prevent="submitNativeDialog">
          <label for="demoDateInput">
            Pick a date
            <input type="datetime" name="demoDateInput" id="demoDateInput" />
          </label>
          <hr />
          <label for="demoColorInput">
            Pick a color
            <input type="color" name="demoColorInput" id="demoColorInput" />
          </label>
          <hr />
          <button>Submit</button>
        </form>
      </article>
    </section>
  </dialog>
  <dialog ref="confirmSubmitDialog" class="modal-overlay">
    <section class="modal-content">
      <form method="dialog">
        <button
          class="close"
          aria-label="Click or Hit ESC"
          title="Click or Hit ESC"
        >
          Close
        </button>
      </form>
      <article>
        <h3>Thanks 😊</h3>
        <p>Click or Hit ESC ⚡</p>
      </article>
    </section>
  </dialog>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { usePageLeave, whenever } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

// Native dialog with usePageLeave
const callDemoUserHasLeftWindowDialog = ref(false);
const userHasLeftWindowDialog = usePageLeave({});

whenever(callDemoUserHasLeftWindowDialog, () => {
  demoUserHasLeftWindowDialog();
});

const demoUserHasLeftWindowDialog = () => {
  const unwatch = whenever(userHasLeftWindowDialog, () => {
    showNativeDialog();
    if (callDemoUserHasLeftWindowDialog.value) {
      unwatch();
      console.log("Called unwatch (dialog)");
    } else {
      console.log("Didn't call unwatch (dialog)");
    }
  });
};

const nativeDialogEl = ref<HTMLDialogElement | null>(null);
const confirmSubmitDialog = ref<HTMLDialogElement | null>(null);
const showNativeDialog = () => nativeDialogEl.value?.showModal();
const hideNativeDialog = () => nativeDialogEl.value?.close();
const submitNativeDialog = () => {
  showConfirmNativeDialog();
  hideNativeDialog();
};
const showConfirmNativeDialog = () => confirmSubmitDialog.value?.showModal();
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
