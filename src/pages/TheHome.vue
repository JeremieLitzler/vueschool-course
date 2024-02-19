<template>
  <h1>Welcome to the forum</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from "@/components/CategoryList.vue";

export default {
  components: {
    CategoryList,
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
  },
};
</script>

<style lang="scss" scoped></style>
