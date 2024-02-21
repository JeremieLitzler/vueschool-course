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
    <h1 class="thread-title">
      {{ thread!.title }}
      <router-link
        :to="{ name: RouteName.ThreadEdit, params: { id } }"
        class="btn-green btn-small"
        >Edit the thread</router-link
      >
    </h1>

    <PostList :posts="threadPosts!" />
    <PostEditor :thread-id="props.id" @@add-post="savePost" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type Thread from '@/types/Thread.ts';
import AddPostPayload from '@/types/AddPostPayload';
import { usePostStore } from '@/stores/PostStore';
import { useThreadStore } from '@/stores/ThreadStore';
import useUUID from '@/composables/useUUID';

import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';
import Post from '@/types/Post';
import { RouteName } from '@/enums/RouteName';

const { getPostsByThreaId, addPost } = usePostStore();
const { getThreadById, appendPostToThread } = useThreadStore();
const { newUniqueId } = useUUID();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const threadPosts = computed((): Post[] | undefined =>
  getPostsByThreaId(props.id)
);

const thread = computed((): Thread | undefined => getThreadById(props.id));

const savePost = (entry: AddPostPayload) => {
  entry.post.id = newUniqueId;
  addPost(entry.post);
  appendPostToThread({
    threadId: entry.post.threadId!,
    postId: entry.post.id!,
  });
};
</script>

<style scoped></style>
