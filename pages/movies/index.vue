<script setup lang="ts">
useHead({
  title: 'Search your movies',
  meta: [
    {
      name: 'description',
      content: 'Search the movie from OMDB database by simply typing a keyword',
    },
  ],
});
</script>
<template>
  <MovieSearchV2 />
</template>
