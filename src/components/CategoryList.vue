<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsByCategory(category.id).value"
    :category-name="category.name"
    :category-id="category.id"
  />
</template>

<script setup lang="ts">
import Category from '@/types/Category';
import { useForumStore } from '@/stores/ForumStore';
import ForumList from './ForumList.vue';

const { getForumsByCategory } = useForumStore();
const { categories } = defineProps<{ categories: Category[] }>();
console.log(`RouteName.TheHome > CategoryList`, categories);
</script>

<style scoped></style>
