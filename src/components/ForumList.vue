<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <router-link
          v-if="categoryId"
          :to="{ name: 'CategoryShow', params: { id: props.categoryId } }"
        >
          {{ props.categoryName || 'Forums' }}
        </router-link>
        <span v-else>{{ props.categoryName || 'Forums' }}</span>
      </h2>

      <div class="forum-listing" v-for="forum in forums" :key="forum.id">
        <div class="forum-details">
          <router-link
            class="text-xlarge"
            :to="{ name: 'ForumShow', params: { id: forum.id } }"
            >{{ forum.name }}</router-link
          >
          <p>{{ forum.description }}</p>
        </div>

        <div class="threads-count">
          <p>
            <span class="count">{{ threadsLength(forum) }}</span
            >&nbsp;{{ hasManyThreads(forum) ? 'threads' : 'thread' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Forum from '@/types/Forum';

interface ForumListProps {
  forums: Forum[];
  categoryName?: string;
  categoryId?: string;
}

const props = defineProps<ForumListProps>();

const threadsLength = (forum: Forum) => {
  if (!forum.threads) return 0;

  return forum.threads.length;
};
const hasManyThreads = (forum: Forum) => {
  return threadsLength(forum) > 1;
};
</script>

<style scoped></style>
