<script setup>
import { inject, computed } from 'vue';

const menu = inject('menu')
const api = computed(() => menu.api.value)
</script>

<template>
  <button v-bind="api.triggerProps">
    <slot />
  </button>
</template>