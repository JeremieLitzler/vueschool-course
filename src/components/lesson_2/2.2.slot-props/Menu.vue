<script setup>
import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, ref, provide } from "vue";

const selectedId = ref('')
const [state, send] = useMachine(menu.machine({
  id: "menu",
  "aria-label": "File",
  onSelect(selected) {
    selectedId.value = selected.value
  },
  closeOnSelect: false,
}));
const api = computed(() => menu.connect(state.value, send, normalizeProps));

provide('menu', { api, selectedId })

const close = () => api.value.close()
const open = () => api.value.open()

</script>

<template>
  <div>
    <slot :open="open" :close="close" />
  </div>
</template>

<style>
@import './menu.css';
</style>