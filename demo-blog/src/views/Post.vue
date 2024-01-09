<template>
  <div v-if="post && user">
    <h1 class="text-3xl">{{ post.title }}</h1>
    <div class="text-gray-500 mb-10">by {{ user.name }}</div>
    <div>{{ post.body }}</div>
  </div>
</template>
<script setup>
  import { watch } from "vue";
  import { useRoute } from "vue-router";
  import useResource from '../composables/useResource';

  const { item: post, fetchOne: fetchPost } = useResource('posts');

  const route = useRoute();
  fetchPost(route.params.id);

  const { item: user, fetchOne: fetchUser } = useResource('users');
  watch(() => ({...post.value}), () => {
    fetchUser(post.value.userId)
  })
</script>
