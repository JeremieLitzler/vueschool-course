<template>
  <app-loading-state
    v-if="!$store.getters.isAppIsReady"
    message="Loading the forums... Please wait ⌛"
  />
  <section v-else>
    <h1 class="push-top">Welcome to the forum</h1>
    <CategoryList :categories="categories" />
  </section>
</template>

<script>
import CategoryList from "@/components/CategoryList.vue";

export default {
  components: {
    CategoryList,
  },
  computed: {
    categories() {
      return this.$store.getters.getCategories;
    },
  },
  async beforeCreate() {
    const categories = await this.$store.dispatch("fetchAllCategories");
    const forumIds = categories.flatMap(({ forums }) => forums);
    //console.log("categories > forums", forumIds);
    await this.$store.dispatch("fetchForums", {
      ids: forumIds,
    });

    this.$store.dispatch("notifyAppIsReady");
  },
};
</script>
