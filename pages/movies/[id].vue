<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <h1>Page: movies/{{ route.params.id }}</h1>
</template>

<style scoped></style>
