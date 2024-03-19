<template>
  <div class="col-full push-top">
    <router-link :to="{ name: RouteName.TheHome }">⬅️ Back to Home</router-link>
    <h1>
      {{ category?.name }}
    </h1>
  </div>
  <ForumList :forums="categoryForums" />
</template>

<script setup async lang="ts">
import { useCommonStore } from '@/stores/CommonStore';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useForumStore } from '@/stores/ForumStore';
import { RouteName } from '@/enums/RouteName';
import ForumList from '@/components/ForumList.vue';

const props = defineProps<{ id: string }>();

useCommonStore().notifyAppIsReady();
const category = (await useCategoryStore().fetchAllCategories()).find(
  (item) => item.id === props.id
);

const categoryForums = await useForumStore().fetchForums(category?.forums!);
</script>

<style scoped></style>
