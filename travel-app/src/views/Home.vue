<template>
  <div class="home">
    <h1>All destinations</h1>
    <section class="destinations">
      <router-link
        v-for="destination in destinations"
        :key="destination.id"
        :to="destination.slug"
      >
        <h2>{{ destination.name }}</h2>
        <img :src="`/images/${destination.image}`" :alt="destination.name" />
        <!-- <p>{{destination.description }}</p> -->
      </router-link>
    </section>
  </div>
</template>

<script setup>
  import { reactive } from "vue";
  import sourceData from "@/data.json";
  console.log(sourceData);
  const destinations = reactive(sourceData.destinations);
</script>

<style lang="scss" scoped></style>
