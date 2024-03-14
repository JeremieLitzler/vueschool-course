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

    <app-pagination
      :page-count="pageCount"
      :pages-around="1"
      :current-page="currentPage"
    >
      <template #prevRange>⏮️</template>
      <template #prevPage>◀️</template>
      <template #nextPage>▶️</template>
      <template #nextRange>⏭️</template>
    </app-pagination>
    <post-list :posts="pagePosts!" />
    <app-pagination
      :page-count="pageCount"
      :pages-around="1"
      :current-page="currentPage"
    >
      <template #prevRange>⏮️</template>
      <template #prevPage>◀️</template>
      <template #nextPage>▶️</template>
      <template #nextRange>⏭️</template>
    </app-pagination>

    <app-spinner v-if="savingPost" />
    <post-editor
      :thread-id="id"
      :source-post="null"
      @@add-post="savePost"
      @@update-post="updatePost"
    />
  </div>
</template>

<script setup async lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { RouteName } from '@/enums/RouteName';
import type Post from '@/types/Post';
import type ThreadHydraded from '@/types/ThreadHydraded.ts';
import type PostAddRequest from '@/types/PostAddRequest';
import { usePostStore } from '@/stores/PostStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { useUserStore } from '@/stores/UserStore';
import { useCommonStore } from '@/stores/CommonStore';

import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';
import PostUpdateRequest from '@/types/PostUpdateRequest';

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const asyncUiElement = 'newPost';
const itemsToFetch = ref(5);
const currentPage = ref(1);
const pagePosts = ref<Post[]>([]);

const savingPost = computed(() => {
  return !useCommonStore().isUiElementReady(asyncUiElement);
});

const thread = computed((): ThreadHydraded | undefined =>
  useThreadStore().getThreadById(id)
);
const threadEditable = computed(() => {
  return thread.value?.userId === useUserStore().getAuthUser().id;
});
const pageCount = computed(() => {
  return Math.ceil(thread.value?.posts?.length! / itemsToFetch.value);
});

const savePost = async (entry: PostAddRequest) => {
  useCommonStore().notifyAsyncUiElementState({ uiElement: asyncUiElement });
  const post = await usePostStore().addPost({ ...entry });
  await useThreadStore().refreshFromFirebase(post.threadId);
  await useUserStore().refreshFromFirebase(post.userId);
  useCommonStore().notifyAsyncUiElementState({
    uiElement: asyncUiElement,
    ready: true,
  });
};

const updatePost = async (entry: PostUpdateRequest) => {
  useCommonStore().notifyAsyncUiElementState({ uiElement: asyncUiElement });
  await usePostStore().updatePost({ ...entry });
  useCommonStore().notifyAsyncUiElementState({
    uiElement: asyncUiElement,
    ready: true,
  });
};

const fetchPagePosts = async () => {
  pagePosts.value = await usePostStore().fetchPostsByPage(
    thread.value?.posts!,
    itemsToFetch.value,
    currentPage.value - 1
  );
};

const isCurrentPageSetInQuery = () => {
  return (
    route.query.page !== undefined &&
    !isNaN(parseInt(route.query.page as string))
  );
};

//fetch requested thread
const threadFetch = await useThreadStore().fetchThread(id);
//... and its author
const firstUserPromise = useUserStore().fetchUser(threadFetch.userId!);
//... and its posts
if (isCurrentPageSetInQuery()) {
  //console.log('ThreadShow > setup > currentPage (before)', currentPage.value);
  currentPage.value = parseInt(route.query.page as string);
  //console.log('ThreadShow > setup > currentPage (after)', currentPage.value);
}
await fetchPagePosts();
const userIds = pagePosts.value.map((post) => post.userId!);
// and finally the posts's authors
const extraUserPromise = useUserStore().fetchUsers(userIds);
await Promise.all([firstUserPromise, extraUserPromise]);
useCommonStore().notifyAppIsReady();
</script>

<style scoped></style>
