<template>
  <div class="nav">
    <router-link id="logo" :to="{name: 'home'}"
      >Vue School Travel App</router-link
    >
    <router-link
      v-for="destination in data.destinations"
      :key="destination.id"
      :to="{name: 'destination-show', params:{id:destination.id,slug:destination.slug}}"
    >
      {{ destination.name }}
    </router-link>
  </div>
</template>

<script setup>
  import useSourceData from "../composables/useSourceData";
  const data = useSourceData();
</script>

<style lang="scss" scoped></style>
