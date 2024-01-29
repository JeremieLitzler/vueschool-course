<script setup>
import { ref, defineExpose } from "vue"

const isOpen = ref(false)
const open = () => isOpen.value = true
const close = () => isOpen.value = false

defineExpose({
  open
})

</script>

<template>
  <button @click="open()">Toggle</button>
  <div class="modal" v-if="isOpen">
    <div class="backdrop">
    </div>
    <div class="modal-body">
      <p>My awesome modal content</p>
      <button @click="close()">Close</button>
    </div>
  </div>
</template>

<style>
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.backdrop {
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  position: absolute;
}

.modal-body {
  z-index: 10;
  width: 300px;
  height: 100px;
  background: white;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  flex-direction: column;
}
</style>