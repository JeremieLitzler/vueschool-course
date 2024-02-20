<template>
  <div class="col-large push-top">
    <router-link :to="{ name: RouteName.TheHome }">Back</router-link>
    <h1>{{ thread.title }}</h1>
    <post-list :posts="threadPosts" />
    <post-editor :threadId="id" @add-post="savePost" />
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

import { useRouteName } from "@/composables/useRouteName";
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
    threads() {
      return this.$store.state.threads;
    },
    posts() {
      return this.$store.state.posts;
    },
    thread() {
      const match = this.threads.find((thread) => thread.id === this.id);
      return match;
    },
    threadPosts() {
      const matches = this.posts.filter((post) => post.threadId === this.id);
      console.log("threadPosts", matches);
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
