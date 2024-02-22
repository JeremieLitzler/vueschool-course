<template>
  <div class="col-large push-top">
    <router-link :to="{ name: RouteName.TheHome }">Back</router-link>
    <section v-if="$store.getters.isFetching" class="loading">
      Loading...
    </section>
    <section v-else>
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
          >{{ thread.repliesCount }}
          replies by
          {{ thread.contributorsCount }}
          contributors</span
        >
      </section>
      <post-list :posts="threadPosts" />
      <post-editor :threadId="id" @add-post="savePost" />
    </section>
  </div>
</template>

<script>
// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "@/config/firebase";
// import { getFirestore, doc, onSnapshot } from "firebase/firestore";
// const firebaseApp = initializeApp(firebaseConfig);

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
  async created() {
    this.$store.dispatch("fetchSomething");
    const nonAsyncPromises = [];
    const thread = await this.$store.dispatch("fetchThread", { id: this.id });
    const userPromise = this.$store.dispatch("fetchUser", {
      id: thread.userId,
    });
    nonAsyncPromises.push(userPromise);

    thread.posts.forEach(async (postId) => {
      const post = await this.$store.dispatch("fetchPost", { id: postId });
      const userPromise = this.$store.dispatch("fetchUser", {
        id: post.userId,
      });
      nonAsyncPromises.push(userPromise);
    });

    await Promise.all(nonAsyncPromises);
    this.$store.dispatch("fetchSomething");
  },
};
</script>

<style scoped></style>
