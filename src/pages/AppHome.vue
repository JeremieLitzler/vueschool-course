<template>
  <h1>Welcome to the forum</h1>
  <div class="col-full">
    <CategoryList :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/CategoryStore';
import CategoryList from '@/components/CategoryList.vue';
// import { RouteName } from '@/enums/RouteName';

const { categories } = useCategoryStore();
//console.log(RouteName.TheHome, categories);
</script>
<style scoped></style>
