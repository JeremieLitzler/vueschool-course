<script lang="ts" setup>
import { ref } from 'vue';
import type Movie from '@@/types/Movie';
import type ApiSearchResponse from '@@/types/ApiSearchResponse';

const init = ref(true);
const ready = ref(false);
const query = ref('Steel');
const page = ref(1);
const movies = ref<Movie[]>([]);
const resultsFound = ref<number | null>(null);
const noMovies = computed(() => movies.value.length === 0);
const search = async () => {
  ready.value = false;
  init.value = false;
  //You can use $fetch that Nuxt provides out-of-the-box
  const response: ApiSearchResponse = await $fetch(
    `${import.meta.env.VITE_OMDBAPI_URL}&page=${page.value}&s=${query.value}`
  );
  // const searchResponse: ApiSearchResponse = { ...(await response.json()) };
  movies.value = [...response.Search];
  resultsFound.value = response.totalResults;
  ready.value = true;
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
  <section v-if="!ready && !init">Searching...</section>
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
