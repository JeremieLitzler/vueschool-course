<template>
  <div class="col-full push-top">
    <router-link :to="{ name: RouteName.TheHome }">⬅️ Back to Home</router-link>
    <h1>
      {{ category.name }}
    </h1>
  </div>
  <ForumList :forums="categoryForums" />
</template>

<script setup async lang="ts">
import ForumList from '@/components/ForumList.vue';
import { useForumStore } from '@/stores/ForumStore';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useCommonStore } from '@/stores/CommonStore';
import { RouteName } from '@/enums/RouteName';

const props = defineProps<{ id: string }>();

useCommonStore().notifyAppIsReady();
const category = await useCategoryStore().fetchCategory(props.id);
//console.log(RouteName.CategoryShow, category);

const categoryForums = await useForumStore().fetchForums(category.forums!);
//console.log(RouteName.CategoryShow, categoryForums.value);
</script>

<style scoped></style>
