<template>
  <div class="col-large push-top">
    <h1>{{ thread!.title }}</h1>

    <div class="post-list">
      <div class="post" v-for="postId in thread!.posts" :key="postId">
        <div class="user-info">
          <a href="#" class="user-name">{{
            getUserById(getPostById(postId).userId).name
          }}</a>

          <a href="#">
            <img
              class="avatar-large"
              :src="getUserById(getPostById(postId).userId).avatar"
              :alt="getUserById(getPostById(postId).userId).name"
            />
          </a>

          <p class="desktop-only text-small">107 posts</p>
        </div>

        <div class="post-content">
          <div>
            <p>
              {{ getPostById(postId).text }}
            </p>
          </div>
        </div>

        <div class="post-date text-faded">
          {{ getPostById(postId).publishedAt }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type Thread from "../types/Thread.ts";
import useSampleData from "../composables/useSampleData.ts";
import usePost from "../composables/usePost";
import useUser from "../composables/useUser";
const { getPostById } = usePost();
const { getUserById } = useUser();
const { threadsData } = useSampleData();

const threads = ref<Thread[]>(threadsData);

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
</script>

<style scoped></style>
