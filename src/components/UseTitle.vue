<template>
  <h1>{{ title }}</h1>
  <h2>Demo of useTitle</h2>
  <input type="text" v-model="title" />
</template>

<script setup lang="ts">
import { useTitle } from "@vueuse/core";
const title = useTitle();
</script>

<style scoped></style>
