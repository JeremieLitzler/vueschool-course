<template>
  <div v-if="post && user">
    <h1 class="text-3xl">{{ post.title }}</h1>
    <div class="text-gray-500 mb-10">by {{ user.name }}</div>
    <div>{{ post.body }}</div>
  </div>
</template>
<script setup>
  import { useRouter, useRoute } from "vue-router";
  import usePost from '../composables/usePost';

  const { post, fetchOne } = usePost();

  const route = useRoute();
  fetchOne(route.params.id);

  const user = {
    name: "Leanne Graham",
  };
</script>
