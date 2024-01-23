<script setup lang="ts">
import { ref, watch } from 'vue'
const numbers = ref<number[]>([])

watch(
  () => [...numbers.value],
  () => console.log('new number added')
)

const randomNum = () => numbers.value.push(Math.random())
</script>
<template>
  <button @click="randomNum">Add Random Number</button>
</template>
