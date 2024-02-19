<template>
  <h1>Welcome to the forum</h1>
  <div class="col-full">
    <CategoryList :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/CategoryStore';
import CategoryList from '@/components/CategoryList.vue';

const { categories } = useCategoryStore();
</script>
<style scoped></style>
