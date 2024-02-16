<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsByCategory(category)"
    :category-name="category.name"
    :category-id="category.id"
  />
</template>

<script>
import sourceData from "@/data.json";
import ForumList from "@/components/ForumList.vue";

export default {
  components: { ForumList },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getForumsByCategory(category) {
      return sourceData.forums.filter(
        (forum) => forum.categoryId === category.id
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
