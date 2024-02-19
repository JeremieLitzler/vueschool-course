<template>
  <the-nav-bar />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import TheNavBar from "@/components/TheNavBar.vue";
export default {
  name: "App",
  components: { TheNavBar },
};
</script>

<style></style>
