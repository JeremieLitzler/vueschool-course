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
  // import useApiData from "../composables/useApiData";
  import useSourceData from "@/composables/useSourceData";

  const route = useRoute();
  const { destination, /* fetchDestination */ } = useSourceData(route.params.slug);
  //fetchDestination();
</script>

<style lang="scss" scoped></style>
