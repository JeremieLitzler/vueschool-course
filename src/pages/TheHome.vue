<template>
  <section v-if="$store.getters.isFetching" class="loading">Loading...</section>
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
    this.$store.dispatch("fetchSomething");
    const categories = await this.$store.dispatch("fetchAllCategories");
    const forumIds = categories.flatMap(({ forums }) => forums);
    //console.log("categories > forums", forumIds);
    await this.$store.dispatch("fetchForums", {
      ids: forumIds,
    });

    this.$store.dispatch("fetchSomething");
  },
};
</script>

<style lang="scss" scoped></style>
