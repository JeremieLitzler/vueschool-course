<script setup>
import { computed, inject, ref } from 'vue'

const menu = inject('menu')
const li = ref(null)

const val = computed(() => li?.value?.textContent ?? '')

const api = computed(() => menu.api.value)

// If the item is active
const active = computed(() => menu?.selectedId?.value === val?.value)

</script>

<template>
  <li v-bind="api.getItemProps({ id: val })" ref="li">
    <slot :active="active" />
  </li>
</template>