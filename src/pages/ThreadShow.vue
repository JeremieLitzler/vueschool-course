<template>
  <div class="col-large push-top">
    <router-link :to="{ name: RouteName.TheHome }">Back</router-link>
    <h1 class="thread-title">
      {{ thread.title }}
      <router-link
        :to="{ name: RouteName.ThreadEdit, params: { id } }"
        class="btn-green btn-small"
        >Edit the thread</router-link
      >
    </h1>
    <section class="thread-meta">
      <p>
        By <a href="#" class="link-unstyled">{{ thread.author }}</a
        >, <app-date :timestamp="thread.publishedAt" />.
      </p>
      <span class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors</span
      >
    </section>
    <post-list :posts="threadPosts" />
    <post-editor :threadId="id" @add-post="savePost" />
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      RouteName,
    };
  },
  components: {
    PostList,
    PostEditor,
  },
  computed: {
    posts() {
      return this.$store.state.posts;
    },
    thread() {
      const match = this.$store.getters.threadById(this.id);
      return match;
    },
    threadPosts() {
      const matches = this.posts.filter((post) => post.threadId === this.id);
      //console.log("threadPosts", matches);
      return matches;
    },
  },
  methods: {
    savePost({ post }) {
      this.$store.dispatch("createPost", post);
    },
  },
};
</script>

<style scoped></style>
@/helpers/routeNameEnum @/helpers/routeNameEnum
