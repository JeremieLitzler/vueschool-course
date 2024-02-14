<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <post-list :posts="threadPosts" />
    <div class="col-full">
      <form @submit.prevent="addPost">
        <div class="form-group">
          <textarea
            v-model="newPostText"
            cols="30"
            rows="10"
            class="form-input"
          />
        </div>
        <div class="form-actions">
          <button class="btn-blue">Submit post</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import sourceData from "@/data.json";
import PostList from "@/components/PostList.vue";

export default {
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  components: {
    PostList,
  },
  data() {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      newPostText: "",
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
    addPost() {
      const postId = "gggg" + Math.random();
      const post = {
        id: postId,
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: "38St7Q8Zi2N1SPa5ahzssq9kbyp1",
      };
      this.posts.push(post);
      this.thread.posts.push(postId);
      this.newPostText = "";
    },
  },
};
</script>

<style scoped></style>
