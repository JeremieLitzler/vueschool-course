<script lang="ts" setup>
interface Movie {
  /**
   * These are returned in a search
   */
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
  /**
   * These are returned on a single item fetch
   */
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
interface Rating {
  Source: string;
  Value: string;
}
interface ApiSearchResponse {
  Response: boolean;
  Search: Movie[];
  totalResults: number;
}

import { ref } from 'vue';
const init = ref(true);
const ready = ref(false);
const query = ref('');
const movies = ref<Movie[]>([]);
const resultsFound = ref<number | null>(null);
const noMovies = computed(() => movies.value.length === 0);
const search = async () => {
  ready.value = false;
  init.value = false;
  //You can use $fetch that Nuxt provides out-of-the-box
  const response: ApiSearchResponse = await $fetch(
    `http://www.omdbapi.com/?apikey=236d985a&page=1&s=${query.value}`
  );
  // const searchResponse: ApiSearchResponse = { ...(await response.json()) };
  movies.value = [...response.Search];
  resultsFound.value = response.totalResults;
  ready.value = true;
};
</script>

<template>
  <h1>Page: movies/index</h1>
  <form @submit.prevent="search">
    <input v-model="query" type="text" name="query" id="query" /><button>
      Search
    </button>
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
