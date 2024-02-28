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
  async beforeCreate() {
    //this.$store.dispatch("notifyAppIsReady");
    await this.$store.dispatch("fetchAuthUser");
    //this.$store.dispatch("notifyAppIsReady");
  },
  created() {
    //console.log("App.vue > Called created");
  },
  beforeMount() {
    //console.log("App.vue > Called beforeMount");
  },
  mounted() {
    //console.log("App.vue > Called mounted");
  },
  beforeUnmount() {
    //console.log("App.vue > Called beforeUnmount");
  },
  unmounted() {
    //console.log("App.vue > Called unmounted");
  },
};
</script>

<style></style>
