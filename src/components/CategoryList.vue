<template>
  <div class="forum-list" v-for="category in categories" :key="category.id">
    <CategoryListItem :category="category" />
  </div>
</template>

<script>
import CategoryListItem from "./CategoryListItem.vue";

export default {
  components: { CategoryListItem },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
