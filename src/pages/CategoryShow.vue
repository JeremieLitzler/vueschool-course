<template>
  <div class="col-full push-top">
    <h1>
      {{ category.name }}
    </h1>
  </div>
  <ForumList :forums="categoryForums" />
</template>

<script setup lang="ts">
import ForumList from '@/components/ForumList.vue';
import { useForumStore } from '@/stores/ForumStore';
import { useCategoryStore } from '@/stores/CategoryStore';
import { RouteName } from '@/enums/RouteName';

const { id: categoryId } = defineProps<{ id: string }>();
const { getCategoryById } = useCategoryStore();
const { getForumsByCategory } = useForumStore();

const category = getCategoryById(categoryId);
console.log(RouteName.CategoryShow, category);

const categoryForums = getForumsByCategory(category.id);
console.log(RouteName.CategoryShow, categoryForums.value);
</script>

<style scoped></style>
