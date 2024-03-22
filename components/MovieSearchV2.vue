<script lang="ts" setup>
import { ref } from 'vue';
import type Movie from '@@/types/Movie';
import type ApiResponseSearch from '@@/types/ApiResponseSearch';
import { errorMessages } from 'vue/compiler-sfc';

const nuxtApp = useNuxtApp();

const init = ref(true);
const pending = ref(false);
const query = ref('Steel');
const errorThrown = ref<string | null>(null);
const page = ref(1);
const searchResponse = ref<ApiResponseSearch | ApiResponseSearch | null>();
const resultsFound = ref<number | null>(null);
const noMovies = computed(() => searchResponse.value?.Search?.length === 0);

const search = async () => {
  pending.value = true;
  const {
    pending: isFetching,
    data: apiSearchResponse,
    error,
  } = await useFetch<ApiResponseSearch>(
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
  pending.value = !isFetching.value;
  /**
   * This watch is for the first request.
   * The response is undefined when pending is true
   *
   */
  watch(apiSearchResponse, (finalResponse) => {
    searchResponse.value = { ...finalResponse } || {};
  });
  if (!isFetching.value) {
    searchResponse.value = { ...apiSearchResponse.value };
  }
};

if (query.value !== '') {
  search();
}
</script>

<template>
  <h1>Page: movies/index</h1>
  <form @submit.prevent="search">
    <label for="query">What are you looking for?</label>
    <input v-model="query" type="text" name="query" id="query" />
    <label for="page">Pick the page</label>
    <input v-model="page" type="number" name="page" id="page" />
    <button>Search</button>
  </form>
  <section v-if="pending && !init">Searching...</section>
  <section v-else-if="errorThrown">{{ errorThrown }}</section>
  <section v-else-if="noMovies">No results to show.</section>
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
        v-for="movie in searchResponse?.Search"
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
~/types/ApiResponseSearch
