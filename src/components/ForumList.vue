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

        <div class="last-thread">
          <!-- <img
          class="avatar"
          src="https://pbs.twimg.com/profile_images/719242842598699008/Nu43rQz1_400x400.jpg"
          alt=""
        />
        <div class="last-thread-details">
          <a href="thread.html">Post Reactions</a>
          <p class="text-xsmall">
            By <a href="profile.html">Rolf Haug</a>, a month ago
          </p>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Forum from '@/types/Forum';

interface ForumListProps {
  forums: Forum[];
  //tried https://vuejs.org/api/sfc-script-setup.html#default-props-values-when-using-type-declaration
  //but another issue with ESLint and TypeScrit...
  //So I used the || operator to set the default in the template.
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
