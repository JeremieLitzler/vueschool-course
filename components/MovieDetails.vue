<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import type Movie from '@@/types/Movie';
const route = useRoute();
const init = ref(true);
const ready = ref(false);
ready.value = false;
const { data } = await useAsyncData(() =>
  $fetch(`${import.meta.env.VITE_OMDBAPI_URL}&i=${route.params.id}`)
);
const movie = ref<Movie | null>(data as unknown as Movie);
ready.value = true;
</script>
<template>
  <section v-if="!ready && !init">Searching...</section>
  <section v-else>
    <h1>{{ movie?.Title }}</h1>

    <img :src="movie?.Poster" :alt="movie?.Title" />
    <p>
      {{ movie?.Plot }}
    </p>
  </section>
</template>

<style scoped></style>
