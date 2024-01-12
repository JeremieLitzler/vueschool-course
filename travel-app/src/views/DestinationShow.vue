<template>
  <section class="destination">
    <h2>Hello {{ destination.name }}</h2>
    <div class="destination-details">
      <img :src="`/images/${destination.image}`" :alt="destination.name" />
      <p>{{ destination.description }}</p>
    </div>
  </section>
</template>

<script setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import sourceData from "@/data.json";

    const route = useRoute();

    const destinationId = computed(() => parseInt(route.params.id));
  //   console.log("destinationId => ", destinationId.value);
  //   console.log("destinations", sourceData.destinations);
    const destination = computed(
      () => sourceData.destinations.find(element => element.id === destinationId.value)
    );
  //   console.log("destination => ", destination);
</script>

<style lang="scss" scoped></style>
