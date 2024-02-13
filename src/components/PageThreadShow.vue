<template>
  <div class="col-large push-top">
    <h1>{{ thread!.title }}</h1>

    <div class="post-list">
      <div class="post" v-for="postId in thread!.posts" :key="postId">
        <div class="user-info">
          <a href="#" class="user-name">{{
            userById(postById(postId).userId).name
          }}</a>

          <a href="#">
            <img
              class="avatar-large"
              :src="userById(postById(postId).userId).avatar"
              :alt="userById(postById(postId).userId).name"
            />
          </a>

          <p class="desktop-only text-small">107 posts</p>
        </div>

        <div class="post-content">
          <div>
            <p>
              {{ postById(postId).text }}
            </p>
          </div>
        </div>

        <div class="post-date text-faded">
          {{ postById(postId).publishedAt }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type Thread from "../types/Thread.ts";
import type User from "../types/User.ts";
import type Post from "../types/Post.ts";

import useSampleData from "../composables/useSampleData.ts";

const { threadsData, postsData, usersData } = useSampleData();

const threads = ref<Thread[]>(threadsData);
const posts = ref<Post[]>(postsData);
const users = ref<User[]>(usersData);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const thread = computed((): Thread | undefined => {
  const match = threads.value.find(
    (threadItem: Thread) => threadItem.id === props.id
  );
  if (!match) return undefined;

  return match;
});

const postById = (postId: string | undefined): Post => {
  const matchingPost = posts.value.find((post: Post) => post.id === postId);
  if (matchingPost === undefined) return {};

  return matchingPost;
};

const userById = (userId: string | undefined): User => {
  const matchingUser = users.value.find((user) => user.id === userId);
  if (matchingUser === undefined) return {};

  return matchingUser;
};
</script>

<style scoped></style>
