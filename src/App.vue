<template>
  <the-header />
  <div class="container">
    <router-view :key="`${$route.path}${JSON.stringify($route.query)}`" />
  </div>
  <app-notifications />
</template>

<script>
import TheHeader from "@/components/TheHeader.vue";
export default {
  name: "App",
  components: { TheHeader },
};
</script>

<style></style>
