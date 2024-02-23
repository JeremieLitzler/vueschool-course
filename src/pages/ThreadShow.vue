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
    <router-link
      :to="{ name: RouteName.ForumShow, params: { id: thread?.forumId } }"
      >⬅️ Back to Forum</router-link
    >
    <h1 class="thread-title">
      {{ thread?.title }}
      <router-link
        :to="{ name: RouteName.ThreadEdit, params: { id } }"
        class="btn-green btn-small"
        >Edit the thread</router-link
      >
    </h1>
    <section class="thread-meta">
      <p>
        By <a href="#" class="link-unstyled">{{ thread?.author }}</a
        >, <app-date :timestamp="thread?.publishedAt" />.
      </p>
      <span class="hide-mobile text-faded text-small"
        >{{ thread?.repliesCount }} replies by
        {{ thread?.contributorsCount }} contributors</span
      >
    </section>

    <PostList :posts="threadPosts!" />
    <PostEditor :thread-id="id" @@add-post="savePost" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePostStore } from '@/stores/PostStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { useUserStore } from '@/stores/UserStore';
import { useCommonStore } from '@/stores/CommonStore';
import useUUID from '@/helpers/uniqueIdHelper';

import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';
import type AddPostPayload from '@/types/AddPostPayload';
import type Post from '@/types/Post';
import type ThreadHydraded from '@/types/ThreadHydraded.ts';
import { RouteName } from '@/enums/RouteName';

const { getPostsByThreaId, addPost } = usePostStore();
const { getThreadById, appendPostToThread } = useThreadStore();
const { newUniqueId } = useUUID();

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const threadPosts = computed((): Post[] | undefined => getPostsByThreaId(id));
const thread = computed((): ThreadHydraded | undefined => getThreadById(id));

const savePost = (entry: AddPostPayload) => {
  entry.post.id = newUniqueId;
  addPost(entry.post);
  appendPostToThread({
    threadId: entry.post.threadId!,
    postId: entry.post.id!,
  });
};

onMounted(async () => {
  useCommonStore().updateFetching();
  //fetch requested thread
  const thread = await useThreadStore().fetchThread(id);
  //... and its author
  const firstUserPromise = useUserStore().fetchUser(thread.userId!);
  //... and its posts
  const posts = await usePostStore().fetchPosts(thread.posts!);
  const userIds = posts.map((post) => post.userId!);
  // and finally the posts's authors
  const extraUserPromise = useUserStore().fetchUsers(userIds);
  await Promise.all([firstUserPromise, extraUserPromise]);
  useCommonStore().updateFetching();
});
</script>

<style scoped></style>
@/helpers/uniqueIdHelper @/helpers/uniqueIdHelper
