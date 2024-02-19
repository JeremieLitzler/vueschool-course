<template>
  <the-header />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader.vue";
export default {
  name: "App",
  components: { TheHeader },
};
</script>

<style></style>
