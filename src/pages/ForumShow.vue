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
    <thread-list :threads="threads!" />

    <!-- <div class="pagination">
        <button class="btn-circle" disabled>
          <i class="fa fa-angle-left"></i>
        </button>
        1 of 3
        <button class="btn-circle"><i class="fa fa-angle-right"></i></button>
      </div> -->
  </div>
</template>

<script setup async lang="ts">
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';
import ThreadList from '@/components/ThreadList.vue';
import { RouteName } from '@/enums/RouteName';

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

useCommonStore().notifyAppIsReady();
const forum = await useForumStore().fetchForum(id);
const threads = await useThreadStore().fetchThreads(forum.threads!);
const userIds = threads.flatMap(({ userId }) => userId!);
await useUserStore().fetchUsers(userIds);
useCommonStore().notifyAppIsReady();
</script>

<style scoped></style>
