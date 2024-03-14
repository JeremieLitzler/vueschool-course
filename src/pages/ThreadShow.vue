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
        <span
          v-if="!thread.threadJustCreated"
          class="hide-mobile text-faded text-small"
          >{{ thread.repliesCount }}
          replies by
          {{ thread.contributorsCount }}
          contributors</span
        >
        <span v-else>No replies yet.</span>
      </section>
      <app-pagination
        :page-count="pageCount"
        :pages-around="1"
        :current-page="currentPage"
        :parentRouteName="RouteName.ThreadShow"
      />
      <!-- TODO: would be nice to focus in the PostEditor -->
      <router-link
        v-if="!routeAllowsToPost"
        :to="{ ...route, query: { page: pageCount } }"
        class="btn-green"
        >Reply</router-link
      >

      <post-list :posts="pagePosts" />
      <app-pagination
        :page-count="pageCount"
        :pages-around="1"
        :current-page="currentPage"
        :parentRouteName="RouteName.ThreadShow"
      />

      <app-loading-state v-if="savingPost" />
      <post-editor
        v-if="routeAllowsToPost"
        :threadId="id"
        :disable-form="savingPost"
        @add-post="savePost"
        class="push-top"
      />
    </div>
  </section>
</template>

<script>
import uniqueIdHelper from "@/helpers/uniqueIdHelper";
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

import { useRouteName } from "@/helpers/routeNameEnum";
// import useNotification from "@/composables/useNotification";
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
      pagePosts: [],
      paginationKey: uniqueIdHelper().createId,
    };
  },
  components: {
    PostList,
    PostEditor,
  },
  computed: {
    routeAllowsToPost() {
      return this.currentPageIsLast;
    },
    savingPost() {
      return !this.$store.getters.isUiElementReady(asyncUiElement);
    },
    thread() {
      const match = this.$store.getters["threads/threadById"](this.id);
      return match;
    },
    threadEditable() {
      return this.thread.userId === this.$store.getters["auth/authUser"].id;
    },
    currentPageIsLast() {
      return this.currentPage === this.pageCount;
    },
    pageCount() {
      return Math.ceil(this.thread.posts.length / this.itemsToFetch);
    },
    updateCurrentPage() {
      if (!this.currentPageIsLast) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async savePost(payload) {
      this.$store.dispatch("notifyUiElementLoading", asyncUiElement);
      //console.log("ThreadShow > savePost called");
      await this.$store.dispatch("posts/createPost", { ...payload });
      if (this.pageCount != this.currentPage) {
        //console.log("ThreadShow > need to update current page");
        this.currentPage = this.pageCount;
      }
      if (!this.updateCurrentPage) {
        await this.fetchPagePosts();
        this.$store.dispatch("notifyUiElementReady", asyncUiElement);
      } else {
        //console.log("updatePage>pageCount", this.pageCount);
        //TODO: Doesn't update the route in the browser, but the UI is...
        this.$router.push({
          name: RouteName.ThreadShow,
          query: { page: this.pageCount },
        });
        this.paginationKey = uniqueIdHelper().newUniqueId;
      }
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
      // let start = Date.now();
      //console.log("initialize > query.page", this.$route.query.page);
      this.currentPage =
        this.$route.query.page === undefined
          ? 1
          : parseInt(this.$route.query.page);
      await this.fetchPagePosts(thread);
      //console.log(
      //   "ThreadShow > created > posts fetched in ",
      //   `${Date.now() - start} ms`
      // );
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
};
</script>

<style scoped></style>
