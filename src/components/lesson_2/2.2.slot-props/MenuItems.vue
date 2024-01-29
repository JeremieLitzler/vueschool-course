<script setup>
import { inject, computed } from 'vue';
const menu = inject('menu')
const api = computed(() => menu.api.value)
</script>

<template>
  <div v-bind="api.positionerProps">
    <ul v-bind="api.contentProps">
      <slot />
    </ul>
  </div>
</template>