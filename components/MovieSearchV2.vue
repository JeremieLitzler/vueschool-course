<script lang="ts" setup>
import { ref } from 'vue';
import type Movie from '@@/types/Movie';
import type ApiSearchResponse from '@@/types/ApiSearchResponse';

const nuxtApp = useNuxtApp();

const init = ref(true);
const pending = ref(false);
const query = ref('Steel');
const page = ref(1);
const movies = ref<Movie[]>([]);
const resultsFound = ref<number | null>(null);
const noMovies = computed(() => movies.value.length === 0);

const search = async () => {
  const { pending: fetchIsPending, data: apiSearchResponse } =
    await useFetch<ApiSearchResponse>(
      `${import.meta.env.VITE_OMDBAPI_URL}&page=${page.value}&s=${query.value}`,
      {
        key: `/movies-search/${query.value}`,
        lazy: true,
        default: () => null,
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
  pending.value = !fetchIsPending.value;
  /**
   * This watch is for the first request.
   * The response is undefined when pending is true
   *
   */
  watch(apiSearchResponse, (finalResponse) => {
    movies.value = [...(finalResponse?.Search || [])];
  });
  if (!fetchIsPending.value) {
    movies.value = [...(apiSearchResponse.value?.Search || [])];
  }
};

if (query.value !== '') {
  search();
}
</script>

<template>
  <h1>Page: movies/index</h1>
  <form @submit.prevent="search">
    <input v-model="query" type="text" name="query" id="query" />
    <input v-model="page" type="number" name="page" id="page" />
    <button>Search</button>
  </form>
  <section v-if="pending && !init">Searching...</section>
  <section v-if="noMovies">No results to show.</section>
  <section v-else>
    <h2>
      Search results
      <span v-show="query !== ''"
        >for <i>{{ query }}</i></span
      >
    </h2>
    <p>
      We found {{ resultsFound }} movie{{
        resultsFound && resultsFound > 1 ? 's' : ''
      }}
      for {{ query }}
    </p>
    <article class="movies">
      <NuxtLink
        v-for="movie in movies"
        :key="movie.imdbID"
        class="movie-link"
        :to="{ name: 'movies-id', params: { id: movie.imdbID } }"
        ><img :src="movie.Poster" :alt="movie.Title"
      /></NuxtLink>
    </article>
  </section>
  <!-- <pre>Movies: {{ movies }}</pre>
  <pre>noMovies: {{ noMovies }}</pre>
  <pre>ready: {{ ready }}</pre>
  <pre>query: {{ query }}</pre> -->
</template>

<style scoped>
.movies {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
