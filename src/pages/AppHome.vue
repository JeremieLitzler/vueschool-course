<template>
  <div class="col-full">
    <CategoryList :categories="categories" />
  </div>
</template>

<script setup async lang="ts">
import { useCategoryStore } from '@/stores/CategoryStore';
import { useCommonStore } from '@/stores/CommonStore';
import CategoryList from '@/components/CategoryList.vue';
import { useForumStore } from '@/stores/ForumStore';
// import { RouteName } from '@/enums/RouteName';

const categories = await useCategoryStore().fetchAllCategories();
const forumIds = categories.flatMap(({ forums }) => forums!);
await useForumStore().fetchForums(forumIds);
useCommonStore().notifyAppIsReady();
//console.log(RouteName.TheHome, categories);
</script>
