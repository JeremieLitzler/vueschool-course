<template>
  <app-loading-state v-if="!$store.getters.isAppIsReady" />
  <section v-else>
    <div class="col-full push-top">
      <!-- <ul class="breadcrumbs">
      <li>
        <a href="/index.html"><i class="fa fa-home fa-btn"></i>Home</a>
      </li>
      <li><a href="/category.html">Discussions</a></li>
      <li class="active"><a href="#">Cooking</a></li>
    </ul> -->
      <router-link
        :to="{ name: RouteName.CategoryShow, params: { id: forum.categoryId } }"
        >⬅️ Back to the Category</router-link
      >
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum?.name }}</h1>
          <p class="text-lead">{{ forum?.description }}</p>
        </div>
        <router-link
          :to="{
            name: RouteName.ThreadCreate,
            params: { forumId: forum.id ?? '' },
          }"
          class="btn-green btn-small"
          >Start a thread</router-link
        >
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="pageThreads" />
      <app-pagination
        :page-count="pageCount"
        :pages-around="1"
        :current-page="currentPage"
        :parentRouteName="RouteName.ForumShow"
      />
      <!-- <div class="pagination">
        <button class="btn-circle" disabled>
          <i class="fa fa-angle-left"></i>
        </button>
        1 of 3
        <button class="btn-circle"><i class="fa fa-angle-right"></i></button>
      </div> -->
    </div>
  </section>
</template>

<script>
import uniqueIdHelper from "@/helpers/uniqueIdHelper";

import ThreadList from "@/components/ThreadList.vue";

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
      itemsToFetch: 8,
      currentPage: 1,
      pageThreads: [],
      paginationKey: uniqueIdHelper().createId,
    };
  },
  components: { ThreadList },
  computed: {
    forum() {
      const result = this.$store.getters["forums/getForumById"](this.id);
      //console.log("ForumShow > computed forum", result);
      return result;
    },

    currentPageIsLast() {
      return this.currentPage === this.pageCount;
    },
    pageCount() {
      return Math.ceil(this.forum.threads?.length / this.itemsToFetch);
    },
  },
  methods: {
    async fetchPageThreads() {
      const threads = await this.$store.dispatch("fetchItemsByChunk", {
        source: "threads",
        ids: this.forum.threads,
        chunckIndex: this.currentPage - 1,
        chunckSize: this.itemsToFetch,
      });
      const hydratedThreads = threads.map((item) =>
        this.$store.getters["threads/hydrateThread"](item)
      );
      this.pageThreads = hydratedThreads;
    },
  },
  async created() {
    const forum = await this.$store.dispatch("forums/fetchForum", {
      id: this.$route.params.id,
    });
    //console.log("ForumShow > created > forum", forum);
    this.currentPage =
      this.$route.query.page === undefined
        ? 1
        : parseInt(this.$route.query.page);
    await this.fetchPageThreads(forum);
    const userIds = this.pageThreads.flatMap(({ userId }) => userId);
    await this.$store.dispatch("users/fetchUsers", { ids: userIds });
    this.$store.dispatch("notifyAppIsReady", "ForumShow");
  },
};
</script>

<style lang="scss" scoped></style>
