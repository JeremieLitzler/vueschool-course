<template>
  <div class="col-large push-top">
    <router-link :to="{ name: 'Home' }">Back</router-link>
    <h1>{{ thread.title }}</h1>
    <post-list :posts="threadPosts" />
    <post-editor :threadId="id" @add-post="savePost" />
  </div>
</template>

<script>
import sourceData from "@/data.json";
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

export default {
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  components: {
    PostList,
    PostEditor,
  },
  data() {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
    };
  },
  computed: {
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
      this.posts.push(post);
      this.thread.posts.push(post.id);
    },
  },
};
</script>

<style scoped></style>
