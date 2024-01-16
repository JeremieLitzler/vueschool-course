<template>
  <div class="nav">
    <AppLink id="logo" :to="{name: 'home'}">Vue School Travel App</AppLink>
    <AppLink
      v-for="destination in data.destinations"
      :key="destination.id"
      :to="{name: 'destination-show', params:{id:destination.id,slug:destination.slug}}"
    >
      {{ destination.name }}
    </AppLink>
    <AppLink :to="{name: 'dashboard'}">Dashboard</AppLink>
    <AppLink to="https://google.com">Google</AppLink>
  </div>
</template>

<script setup>
  import useSourceData from "../composables/useSourceData";
  const data = useSourceData();
</script>

<style lang="scss" scoped></style>
