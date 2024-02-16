<template>
  <h1>Welcome to the forum</h1>
  <div class="col-full">
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import sourceData from "@/data.json";
import CategoryList from "@/components/CategoryList.vue";

const categoriesData = sourceData.categories;
console.log(categoriesData);
export default {
  data() {
    return {
      categories: categoriesData,
    };
  },
  components: {
    CategoryList,
  },
};
</script>

<style lang="scss" scoped></style>
