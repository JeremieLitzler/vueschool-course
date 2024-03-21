<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import type ApiResponseError from '@@/types/ApiResponseError';
import type Movie from '@@/types/Movie';
const nuxtApp = useNuxtApp();
const route = useRoute();
const {
  pending,
  data: movie,
  error,
} = await useFetch<Movie | null>(
  `${import.meta.env.VITE_OMDBAPI_URL}&i=${route.params.id}`,
  {
    key: `/movies/${route.params.id}`,
    default: () => null,
    pick: ['Title', 'Plot', 'Poster', 'imdbID'],
    /**
     * Below is the same as above but quicker to write.
     * Also, you get intellisense if you typed the Promise
     * returned on the handler.
     */
    // transform(data) {
    //   return {
    //     Title: data.Title,
    //     Plot: data.Plot,
    //     Poster: data.Poster,
    //     imdbID: data.imdbID,
    //   };
    getCachedData(key) {
      console.log('getCachedData>key', key);
      const data = nuxtApp.static.data[key] || nuxtApp.payload.data[key];
      console.log('getCachedData>data', data);

      if (!data || data === undefined) {
        return;
      }
      return data;
    },
  }
);
console.log({ pending: pending.value, error: error.value, movie: movie.value });
if (movie.value?.imdbID === undefined) {
  showError({ statusCode: 404, message: 'Movie not found...' });
}

useHead({
  title: movie.value?.Title,
  meta: [{ name: 'description', content: movie.value?.Plot }],
});
</script>
<template>
  <section v-if="pending">Fetching movie details...</section>
  <section v-else-if="error">{{ error }}</section>
  <section v-else>
    <h1>{{ movie?.Title }}</h1>

    <img :src="movie?.Poster" :alt="movie?.Title" />
    <p>
      {{ movie?.Plot }}
    </p>
    <pre>{{ movie }}</pre>
  </section>
</template>

<style scoped></style>
~/types/ApiErrorResponse
