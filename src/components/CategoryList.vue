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
import useForum from '@/composables/useForum';
import ForumList from './ForumList.vue';

const { getForumsByCategory } = useForum();
defineProps<{ categories: Category[] }>();
</script>

<style scoped></style>
