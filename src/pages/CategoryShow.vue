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
import useForum from '@/composables/useForum';
import useCategory from '@/composables/useCategory';

const { id: categoryId } = defineProps<{ id: string }>();
const { getCategoryById } = useCategory();
const { getForumsByCategory } = useForum();

const category = getCategoryById(categoryId);
const categoryForums = getForumsByCategory(category.id);
</script>

<style scoped></style>
