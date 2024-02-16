<template>
  <h1>Welcome to the forum</h1>
  <ForumList :forums="forumsData" />
</template>

<script setup lang="ts">
import useSampleData from '@/composables/useSampleData.ts';
import ForumList from '@/components/ForumList.vue';

const { forumsData } = useSampleData();
</script>
<style scoped></style>
