<template>
  <div v-if="!thread" class="col-full text-center">
    <h1>Oops, the thread isn't valid</h1>
    <p>
      The thread (<b>ID: {{ id }}</b
      >) doesn't exist.
    </p>
    <router-link :to="{ name: 'Home' }">Back to a safe place</router-link>
  </div>
  <div v-else class="col-large push-top">
    <h1>{{ thread!.title }}</h1>
    <PostList :posts="threadPosts" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type Thread from '@/types/Thread.ts';
import useSampleData from '@/composables/useSampleData.ts';
import usePost from '@/composables/usePost';
import PostList from '@/components/PostList.vue';

const { getPostByThreaId } = usePost();
const { threadsData } = useSampleData();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const threads = ref<Thread[]>(threadsData);
const threadPosts = getPostByThreaId(props.id);

const thread = computed((): Thread | undefined => {
  const match = threads.value.find(
    (threadItem: Thread) => threadItem.id === props.id
  );
  if (!match) return undefined;

  return match;
});
</script>

<style scoped></style>
