<template>
  <h1>Welcome to the forum</h1>
  <div class="col-full">
    <CategoryList :categories="categoriesData" />
  </div>
</template>

<script setup lang="ts">
import useSampleData from '@/composables/useSampleData.ts';
import CategoryList from '@/components/CategoryList.vue';

const { categoriesData } = useSampleData();
</script>
<style scoped></style>
