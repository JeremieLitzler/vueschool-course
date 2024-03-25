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

const configImg = ref({ w: 200, h: 300, fit: 'contain', format: 'avif' });
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
    <article>
      <label>
        Width
        <input v-model="configImg.w" type="number" />
      </label>
      <label>
        Height
        <input v-model="configImg.h" type="number" />
      </label>
      <label>
        Fit (contain (default), cover, fill)
        <input v-model="configImg.fit" type="text" />
      </label>
      <label>
        Format (avif, webp, jpg, gif)
        <input v-model="configImg.format" type="text" />
      </label>
    </article>
    <p>
      We found {{ resultsFound }} movie{{
        resultsFound && resultsFound > 1 ? 's' : ''
      }}
      for {{ query }}
    </p>
    <article class="movies">
      <nuxt-link
        v-for="movie in searchResponse?.Search"
        :key="movie.imdbID"
        class="movie-link"
        :to="{ name: 'movies-id', params: { id: movie.imdbID } }"
      >
        <div class="nuxt-image-variants">
          <!-- <div class="nuxt-image-variant">
            <h3>Default image</h3>
            <nuxt-img loading="lazy" :src="movie.Poster" :alt="movie.Title" />
          </div> -->
          <!-- <div class="nuxt-image-variant">
            <h3>Resized from the center to 200 x 150</h3>
            <nuxt-img
              loading="lazy"
              :src="movie.Poster"
              :alt="movie.Title"
              width="200"
              height="150"
            />
          </div>
          <div class="nuxt-image-variant">
            <h3>
              Resized to 200 x 150 but <b>contains</b> the whole original image
            </h3>
            <nuxt-img
              loading="lazy"
              :src="movie.Poster"
              :alt="movie.Title"
              width="300"
              height="200"
              fit="contain"
            />
          </div>
          <div class="nuxt-image-variant">
            <h3>Same as above but in WEBP.</h3>
            <nuxt-img
              loading="lazy"
              :src="movie.Poster"
              :alt="movie.Title"
              width="300"
              height="200"
              fit="contain"
              format="webp"
            />
          </div> -->
          <div class="nuxt-image-variant">
            <h3>Same as above but in AVIF.</h3>
            <nuxt-picture
              loading="lazy"
              :src="movie.Poster"
              :alt="movie.Title"
              width="200"
              height="300"
              fit="cover"
              format="avif,webp"
            />
          </div>
        </div>
      </nuxt-link>
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
.nuxt-image-variants {
}
.nuxt-image-variant {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
