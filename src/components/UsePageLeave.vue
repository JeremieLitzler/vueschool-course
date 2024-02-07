<template>
  <details>
    <summary
      :aria-label="summaryAccessibilityLabel"
      :title="summaryAccessibilityLabel"
    >
      <pre>usePageLeave & useConfirmDialog</pre>
    </summary>
    Try to move your cursor out of the window...
    <pre>
Cursor hovering the browser window? {{ userHasLeftWindow ? "No" : "Yes" }}</pre
    >
    <label>
      Want to see modal as cursor leaves windows? Check the box ➡️
      <input type="checkbox" v-model="callDemoUserHasLeftWindow" />
    </label>
    <hr />
    <button @click="dialog.reveal()">
      Reveal model using <i>useConfirmDialog</i>
    </button>
  </details>
  <div v-if="showModal" id="myModal" class="modal-overlay" aria-modal="true">
    <!-- Modal content -->
    <section class="modal-content">
      <span
        @click="closeModal()"
        class="close"
        aria-label="Click or Hit ESC"
        title="Click or Hit ESC"
        >&times;</span
      >
      <h3>You are leaving? 😟</h3>
      <p>Please don't, pleasssse stay to enjoy more of VueUse ⚡</p>
      <p>Using <i>usePageLeave</i></p>
    </section>
  </div>
  <div v-if="showDialog" id="myModal" class="modal-overlay" aria-modal="true">
    <!-- Modal content -->
    <section class="modal-content">
      <span
        @click="dialog.cancel()"
        class="close"
        aria-label="Click or Hit ESC"
        title="Click or Hit ESC"
        >&times;</span
      >
      <h3>You are leaving? 😟</h3>
      <p>Please don't, pleasssse stay to enjoy more of VueUse ⚡</p>
      <p>Using <i>useConfirmDialog</i></p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { usePageLeave, useConfirmDialog, whenever } from "@vueuse/core";

import { summaryAccessibilityLabelKey } from "../injectKeys.ts";

const summaryAccessibilityLabel: string | undefined = inject(
  summaryAccessibilityLabelKey
);

const showModal = ref(false);
const callDemoUserHasLeftWindow = ref(false);
const userHasLeftWindow = usePageLeave({});

whenever(callDemoUserHasLeftWindow, () => {
  demoUserHasLeftWindow();
});

const demoUserHasLeftWindow = () => {
  const unwatch = whenever(userHasLeftWindow, () => {
    showModal.value = true;

    if (callDemoUserHasLeftWindow.value) {
      unwatch();
      console.log("Called unwatch");
    } else {
      console.log("Didn't call unwatch");
    }
  });
};
const closeModal = () => (showModal.value = false);

//useConfirmDialog

const showDialog = ref(false);
const dialog = useConfirmDialog(showDialog);

// Native dialog with usePageLeave
const callDemoUserHasLeftWindowDialog = ref(false);
const userHasLeftWindowDialog = usePageLeave({});

whenever(callDemoUserHasLeftWindowDialog, () => {
  demoUserHasLeftWindowDialog();
});

const demoUserHasLeftWindowDialog = () => {
  const unwatch = whenever(userHasLeftWindowDialog, () => {
    showModal.value = true;
    if (callDemoUserHasLeftWindowDialog.value) {
      unwatch();
      console.log("Called unwatch (dialog)");
    } else {
      console.log("Didn't call unwatch (dialog)");
    }
  });
};
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
