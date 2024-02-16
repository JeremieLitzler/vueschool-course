<template>
  <h2 class="list-title">
    {{ category.name }}
  </h2>
  <ForumList :forums="categoryForums" />
</template>

<script>
import sourceData from "@/data.json";
import ForumList from "./ForumList.vue";

export default {
  components: { ForumList },
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  computed: {
    categoryForums() {
      return sourceData.forums.filter(
        (forum) => forum.categoryId === this.category.id
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
