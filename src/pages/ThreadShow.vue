<template>
  <app-loading-state
    v-if="!$store.getters.isAppIsReady"
    message="Loading the thread... Please wait ⌛"
  />
  <section v-else>
    <div class="col-large push-top">
      <router-link
        :to="{ name: RouteName.ForumShow, params: { id: thread.forumId } }"
        >⬅️ Back to Forum</router-link
      >
      <h1 class="thread-title">
        {{ thread.title }}
        <router-link
          v-if="threadEditable"
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
      <post-list :posts="pagePosts" />
      <app-pagination
        :page-count="pageCount"
        :pages-around="1"
        :current-page="currentPage"
        :previous-page="previousPage"
      />

      <app-loading-state
        v-if="savingPost"
        message="Saving your post... Please wait ⌛"
      />
      <post-editor
        :threadId="id"
        :disable-form="savingPost"
        @add-post="savePost"
        class="push-top"
      />
    </div>
  </section>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */
const asyncUiElement = "newPost";
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
      itemsToFetch: 5,
      currentPage: 1,
      previousPage: null,
      pagePosts: [],
      pageChanged: false,
    };
  },
  components: {
    PostList,
    PostEditor,
  },
  computed: {
    savingPost() {
      return !this.$store.getters.isUiElementReady(asyncUiElement);
    },

    threadEditable() {
      return this.thread.userId === this.$store.getters["auth/authUser"].id;
    },
    posts() {
      const posts = this.$store.state.posts.items;
      //console.log("ThreadShow > computed > posts", posts);
      return posts;
    },
    lastPostFetched() {
      if (this.posts.length === 0) return null;
      return this.posts[this.posts.length - 1];
    },
    thread() {
      const match = this.$store.getters["threads/threadById"](this.id);
      return match;
    },
    threadPosts() {
      const matches = this.posts.filter((post) => post.threadId === this.id);
      //console.log("ThreadShow > computed > threadPosts", matches);
      return matches;
    },
    pageCount() {
      return Math.ceil(this.thread.posts.length / this.itemsToFetch);
    },
    currentPageSetInQuery() {
      return (
        this.$route.query.page !== undefined &&
        !isNaN(parseInt(this.$route.query.page))
      );
    },
  },
  methods: {
    updatePage(page) {
      this.currentPage = page;
    },
    async savePost(payload) {
      this.$store.dispatch("notifyUiElementLoading", asyncUiElement);
      //console.log("ThreadShow > savePost called");
      await this.$store.dispatch("posts/createPost", { ...payload });
      if (this.pageCount != this.currentPage) {
        //console.log("ThreadShow > need to update current page");
        this.currentPage = this.pageCount;
      }
      await this.fetchPagePosts();
      this.$store.dispatch("notifyUiElementReady", asyncUiElement);
    },
    async fetchPagePosts() {
      //console.log(
      //   "ThreadShow > fetchItemsByProp > lastPostFetched",
      //   this.lastPostFetched
      // );
      this.pagePosts = await this.$store.dispatch("fetchItemsByChunk", {
        source: "posts",
        ids: this.thread.posts,
        chunckIndex: this.currentPage - 1,
        chunckSize: this.itemsToFetch,
      });
      //console.log(
      //   "ThreadShow > fetchPagePosts > posts",
      //   this.pagePosts.map((post) => post.text)
      // );
    },
    async initialize() {
      //console.log("ThreadShow > created start");
      // console.log(
      //   "ThreadShow > beforeCreate > $route.params.id",
      //   this.$route.params.id
      // );
      const thread = await this.$store.dispatch("threads/fetchThread", {
        id: this.$route.params.id,
      });
      // console.log("ThreadShow > thread", thread);
      // await this.$store.dispatch("fetchUser", {
      //   id: thread.userId,
      // });
      // console.log("ThreadShow > beforeCreate > postIds", thread.posts);
      let start = Date.now();
      //console.log("initialize > query.page", this.$route.query.page);
      this.currentPage =
        this.$route.query.page === undefined
          ? 1
          : parseInt(this.$route.query.page);
      await this.fetchPagePosts(thread);
      console.log(
        "ThreadShow > created > posts fetched in ",
        `${Date.now() - start} ms`
      );
      // console.log("ThreadShow > created > posts ", posts);
      const users = this.pagePosts.map((post) => post.userId);
      await this.$store.dispatch("users/fetchUsers", {
        ids: users,
      });
      // console.log("ThreadShow > beforeCreate > fetchUser called and done");
    },
  },
  async created() {
    await this.initialize();
    this.$store.dispatch("notifyAppIsReady", "ThreadShow (created)");
  },
  async updated() {
    // console.log("ThreadShow > updated");
    // console.log("ThreadShow > updated > query.page", this.$route.query.page);
    // console.log("ThreadShow > updated > currentPage", this.currentPage);
    if (!this.currentPageSetInQuery) {
      return;
    }
    // console.log(
    //   "ThreadShow > updated > currentPage (before if)",
    //   this.currentPage
    // );
    const pageChanged = parseInt(this.$route.query.page) !== this.currentPage;
    if (pageChanged) {
      this.pageChanged = !this.pageChanged;
      this.currentPage = parseInt(this.$route.query.page);
      // console.log("ThreadShow > updated > currentPage (if)", this.currentPage);
      await this.fetchPagePosts();
      const users = this.pagePosts.map((post) => post.userId);
      //console.log("ThreadShow > updated > pagePosts", this.pagePosts);
      //console.log("ThreadShow > updated > users", users);
      await this.$store.dispatch("users/fetchUsers", {
        ids: users,
      });
      this.$store.dispatch("notifyAppIsReady", "ThreadShow (updated)");
    } else {
      // console.log(
      //   "ThreadShow > updated > currentPage (else)",
      //   this.currentPage
      // );
    }
    // this.$store.dispatch("notifyAppIsReady", "ThreadShow (updated bis)");
  },
  beforeRouteEnter() {
    // this.previousPage = !this.currentPageSetInQuery
    //   ? null
    //   : parseInt(this.$route.query.page);
  },
};
</script>

<style scoped></style>
