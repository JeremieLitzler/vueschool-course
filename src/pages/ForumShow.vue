<template>
  <div class="col-full push-top">
    <!-- <ul class="breadcrumbs">
        <li>
          <a href="/index.html"><i class="fa fa-home fa-btn"></i>Home</a>
        </li>
        <li><a href="/category.html">Discussions</a></li>
        <li class="active"><a href="#">Cooking</a></li>
      </ul> -->
    <router-link
      :to="{ name: RouteName.CategoryShow, params: { id: forum.categoryId } }"
      >⬅️ Back to the Category</router-link
    >
    <div class="forum-header" :title="`Forum ID: ${forum.id}`">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{ name: RouteName.ThreadCreate, params: { forumid: forum.id } }"
        class="btn-green btn-small"
        >Start a thread</router-link
      >
    </div>
  </div>

  <div class="col-full push-top">
    <thread-list :threads="pageThreads" />
    <app-pagination
      :page-count="pageCount"
      :pages-around="1"
      :current-page="currentPage"
      :parentRouteName="RouteName.ForumShow"
    >
      <template #prevRange>⏮️</template>
      <template #prevPage>◀️</template>
      <template #nextPage>▶️</template>
      <template #nextRange>⏭️</template>
    </app-pagination>
  </div>
</template>

<script setup async lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
import { useHead } from '@vueuse/head';
import { useCustomPageHead } from '@/composables/usePagesHead';
const head = await useCustomPageHead().useForumPage(props.id);
useHead({ ...head });

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';

import { RouteName } from '@/enums/RouteName';
import type ThreadHydraded from '@/types/ThreadHydraded';
import ThreadList from '@/components/ThreadList.vue';

const route = useRoute();
const itemsToFetch = ref(8);
const currentPage = ref(1);
const pageThreads = ref<ThreadHydraded[]>([]);

const pageCount = computed(() => {
  return Math.ceil((forum.value?.threads?.length! || 0) / itemsToFetch.value);
});
const fetchPageThreads = async () => {
  pageThreads.value = await useThreadStore().fetchByPage(
    forum.value?.threads! || [],
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
useCommonStore().notifyAppIsReady();
const forum = ref(await useForumStore().fetchForum(props.id));
if (isCurrentPageSetInQuery()) {
  //console.log('ThreadShow > setup > currentPage (before)', currentPage.value);
  currentPage.value = parseInt(route.query.page as string);
  //console.log('ThreadShow > setup > currentPage (after)', currentPage.value);
}
await fetchPageThreads();
const userIds = pageThreads.value.flatMap(({ userId }) => userId!);
await useUserStore().fetchUsers(userIds);
useCommonStore().notifyAppIsReady();
</script>

<style scoped></style>
