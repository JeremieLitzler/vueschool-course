<template>
  <CategoryList :categories="categories" />
</template>

<script setup async lang="ts">
import { useCommonStore } from '@/stores/CommonStore';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useForumStore } from '@/stores/ForumStore';
import CategoryList from '@/components/CategoryList.vue';

const categories = await useCategoryStore().fetchAllCategories();
const forumIds = categories.flatMap(({ forums }) => forums!);
await useForumStore().fetchForums(forumIds);
useCommonStore().notifyAppIsReady();
</script>
