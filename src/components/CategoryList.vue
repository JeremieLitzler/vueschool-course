<template>
  <forum-list
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsByCategory(category.id).value"
    :category-name="category.name"
    :category-id="category.id"
  />
</template>

<script setup lang="ts">
import { useForumStore } from '@/stores/ForumStore';
import type Category from '@/types/Category';
import ForumList from '@/components/ForumList.vue';

const { categories } = defineProps<{ categories: Category[] }>();
const { getForumsByCategory } = useForumStore();
</script>

<style scoped></style>
