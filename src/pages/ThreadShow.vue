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
    <PostEditor :thread-id="props.id" @@add-post="savePost" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type Thread from '@/types/Thread.ts';
import AddPostPayload from '@/types/AddPostPayload';
import { usePostStore } from '@/stores/PostStore';
import { useThreadStore } from '@/stores/ThreadStore';

import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';

const { getPostsByThreaId, addPost } = usePostStore();
const { threads } = useThreadStore();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const threadPosts = getPostsByThreaId(props.id);

const thread = computed((): Thread | undefined => {
  const match = threads.find(
    (threadItem: Thread) => threadItem.id === props.id
  );
  if (!match) return undefined;

  return match;
});

const savePost = (entry: AddPostPayload) => {
  if (!entry.post.id) throw new Error('post.id cannot be undefined');

  threadPosts.value.push(entry.post);
  //reactive is lost between
  // => the above (update a component's ref)
  //and
  // => the below (call composable's method), I keep both for now
  addPost(entry.post);
  thread.value?.posts?.push(entry.post.id!);
};
</script>

<style scoped></style>
