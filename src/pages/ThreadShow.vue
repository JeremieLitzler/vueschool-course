<template>
  <div v-if="!thread" class="col-full text-center">
    <h1>Oops, the thread isn't valid</h1>
    <p>
      The thread (<b>ID: {{ id }}</b
      >) doesn't exist.
    </p>
    <router-link :to="{ name: 'Home' }">Back to a safe place</router-link>
  </div>
  <div v-else class="col-large push-top" :title="`Thread ID: ${thread.id}`">
    <router-link
      :to="{ name: RouteName.ForumShow, params: { id: thread?.forumId } }"
      >⬅️ Back to Forum</router-link
    >
    <h1 class="thread-title">
      {{ thread?.title }}
      <router-link
        v-if="threadEditable"
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
    <PostEditor :thread-id="id" :source-post="null" @@add-post="savePost" />
  </div>
</template>

<script setup async lang="ts">
import { computed } from 'vue';
import { usePostStore } from '@/stores/PostStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { useUserStore } from '@/stores/UserStore';
import { useCommonStore } from '@/stores/CommonStore';

import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';
import type Post from '@/types/Post';
import type ThreadHydraded from '@/types/ThreadHydraded.ts';
import { RouteName } from '@/enums/RouteName';
import PostAddRequest from '@/types/PostAddRequest';

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

useCommonStore().notifyAppIsReady();
//fetch requested thread
const threadFetch = await useThreadStore().fetchThread(id);
//... and its author
const firstUserPromise = useUserStore().fetchUser(threadFetch.userId!);
//... and its posts
const posts = await usePostStore().fetchPosts(
  threadFetch.posts ? threadFetch.posts! : []
);
const userIds = posts.map((post) => post.userId!);
// and finally the posts's authors
const extraUserPromise = useUserStore().fetchUsers(userIds);
await Promise.all([firstUserPromise, extraUserPromise]);
useCommonStore().notifyAppIsReady();

const thread = computed((): ThreadHydraded | undefined =>
  useThreadStore().getThreadById(id)
);
const threadEditable = computed(() => {
  return thread.value?.userId === useUserStore().getAuthUser().id;
});
//TODO Broken reactivity on the posts...
//when I add a new post, it is inserted into firestore
//but the UI doesn't show it
const threadPosts = computed((): Post[] | undefined =>
  usePostStore().getPostsByThreaId(id)
);

const savePost = async (entry: PostAddRequest) => {
  const post = await usePostStore().addPost({ ...entry });
  await useThreadStore().refreshFromFirebase(post.threadId);
  await useUserStore().refreshFromFirebase(post.userId);
};
</script>

<style scoped></style>
