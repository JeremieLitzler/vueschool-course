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
      <ThreadList :threads="forumThreads" />

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
    };
  },
  components: { ThreadList },
  computed: {
    forum() {
      return this.$store.getters.getForumById(this.id);
    },
    forumThreads() {
      const threads = this.$store.getters.getThreadsByForumId(this.id);
      //console.log("forumThreads", threads);
      return threads;
    },
  },
  async beforeCreate() {
    const forum = await this.$store.dispatch("fetchForum", {
      id: this.$route.params.id,
    });
    //console.log("ForumShow > created > forum", forum);
    const threads = await this.$store.dispatch("fetchThreads", {
      ids: forum.threads,
    });
    //console.log("ForumShow > created > forumThreads", threads);
    const userIds = threads.flatMap(({ userId }) => userId);
    //console.log("ForumShow > created > userIds", userIds);
    await this.$store.dispatch("fetchUsers", { ids: userIds });
    this.$store.dispatch("notifyAppIsReady");
  },
};
</script>

<style lang="scss" scoped></style>
