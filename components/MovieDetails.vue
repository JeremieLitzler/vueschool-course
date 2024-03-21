<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import type Movie from '@@/types/Movie';
const nuxtApp = useNuxtApp();
const route = useRoute();
const init = ref(true);
const { pending, data: movie } = await useLazyAsyncData<Movie>(
  `/movies/${route.params.id}`,
  (): Promise<Movie> => {
    return $fetch(`${import.meta.env.VITE_OMDBAPI_URL}&i=${route.params.id}`);
  },
  {
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
    // },
    getCachedData(key) {
      const data = nuxtApp.static.data[key] || nuxtApp.payload.data[key];
      console.log('getCachedData>data', data);

      if (!data || data === undefined) {
        return;
      }
      return data;
    },
  }
);
console.log('MovieDetails>data', movie.value);

// const movie = ref<Movie | null>(data.value);
</script>
<template>
  <section v-if="pending">Fetching movie details...</section>
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
