<template>
  <section class="destination">
    <h2>{{ destination.name }}</h2>
    <div class="destination-details">
      <img :src="`/images/${destination.image}`" :alt="destination.name" />
      <p>{{ destination.description }}</p>
    </div>
  </section>
</template>

<script setup>
  import { useRoute } from "vue-router";
  import useApiData from "../composables/useApiData";
  // import { watch } from "vue";

  const route = useRoute();
  const { destination, fetchDestination} = useApiData(route.params.slug);
  fetchDestination();
  // watch(() => route.params, fetchDestination);
</script>

<style lang="scss" scoped></style>
