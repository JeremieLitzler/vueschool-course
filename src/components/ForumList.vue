<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <router-link :to="{ name: 'CategoryShow', params: { id: categoryId } }">
          {{ categoryName }}
        </router-link>
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
            >&nbsp;{{ hasManyThreads(forum) ? "threads" : "thread" }}
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

<script>
export default {
  props: {
    forums: {
      type: Array,
      required: true,
    },
    categoryName: {
      type: String,
      default: "Forums",
    },
    categoryId: {
      type: String,
      required: true,
    },
  },
  methods: {
    threadsLength(forum) {
      if (!forum.threads) return 0;

      return forum.threads.length;
    },
    hasManyThreads(forum) {
      return this.threadsLength(forum) > 1;
    },
  },
};
</script>

<style lang="scss" scoped></style>
