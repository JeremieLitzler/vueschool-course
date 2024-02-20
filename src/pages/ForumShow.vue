<template>
  <div class="col-full push-top">
    <!-- <ul class="breadcrumbs">
        <li>
          <a href="/index.html"><i class="fa fa-home fa-btn"></i>Home</a>
        </li>
        <li><a href="/category.html">Discussions</a></li>
        <li class="active"><a href="#">Cooking</a></li>
      </ul> -->

    <div class="forum-header">
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
    <thread-list :threads="forumThreads" />

    <!-- <div class="pagination">
        <button class="btn-circle" disabled>
          <i class="fa fa-angle-left"></i>
        </button>
        1 of 3
        <button class="btn-circle"><i class="fa fa-angle-right"></i></button>
      </div> -->
  </div>
</template>

<script setup lang="ts">
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import ThreadList from '@/components/ThreadList.vue';
import { RouteName } from '@/enums/RouteName';

const { getForumById } = useForumStore();
const { getThreadsByForumId } = useThreadStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const forum = getForumById(props.id);
const forumThreads = getThreadsByForumId(props.id);
</script>

<style scoped></style>
