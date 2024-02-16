<template>
  <div class="col-full push-top">
    <h1>
      {{ category.name }}
    </h1>
  </div>

  <ForumList :forums="categoryForums" />
</template>

<script>
import sourceData from "@/data.json";
import ForumList from "@/components/ForumList.vue";

export default {
  components: { ForumList },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      categories: sourceData.categories,
    };
  },
  computed: {
    category() {
      const match = this.categories.find((item) => item.id === this.id);
      return match;
    },
    categoryForums() {
      return sourceData.forums.filter(
        (forum) => forum.categoryId === this.category.id
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
