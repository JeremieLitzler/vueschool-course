<template>
  <app-loading-state v-if="!$store.getters.isAppIsReady" />
  <div v-else class="flex-grid">
    <div class="col-3 push-top">
      <user-profile-card v-if="!edit" :user="user" />
      <user-profile-card-editor v-else :user="user" />

      <p class="text-xsmall text-faded text-center">
        Member since june 2003, last visited 4 hours ago
      </p>
    </div>

    <div class="col-7">
      <section class="text-center" v-if="userPosts.length === 0">
        No post yet.
        <router-link :to="{ name: RouteName.TheHome }"
          >Start here ⚡</router-link
        >
      </section>
      <post-list v-else :posts="userPosts" orderBy="desc" />
      <button
        @click="fetchNextPosts"
        v-if="!noMorePostsToFetch"
        class="btn-green btn-small"
      >
        Load more posts...
      </button>
    </div>
  </div>
  <div class="credits">
    The placeholder image is provided by
    <a
      href="https://commons.wikimedia.org/wiki/File:Portrait_Placeholder.png"
      target="_blank"
      rel="noopener noreferrer"
      >commons.wikimedia.org</a
    >.
  </div>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

import PostList from "@/components/PostList.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";
//import { mapGetters } from "vuex";
export default {
  props: {
    id: {
      type: String,
    },
    edit: { type: Boolean, default: false },
  },
  data() {
    return {
      RouteName,
      noMorePostsToFetch: false,
    };
  },
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor,
  },
  computed: {
    user() {
      //console.log("UserShow > user > id", this.id);
      if (this.id) {
        return this.$store.getters["users/getUser"](this.id);
      }
      //console.log(
      //   "UserShow > user > authUser getter",
      //   this.$store.getters["auth/authUser"]
      // );
      return this.$store.getters["auth/authUser"];
    },
    userPosts() {
      const posts = this.$store.getters["posts/postsByUserId"](this.user.id);
      //console.log("UserShow > userPosts computed", posts);
      return posts;
    },
    lastPostFetched() {
      if (this.userPosts.length === 0) return null;
      return this.userPosts[this.userPosts.length - 1];
    },
    userThreads() {
      return this.$store.getters["threads/threadsByUserId"](this.user.id);
    },
  },
  methods: {
    async fetchNextPosts() {
      const { amountFetched } = await this.$store.dispatch("fetchItemsByProp", {
        collectionName: "posts",
        whereProp: "userId",
        whereValue: this.user.id,
        orderByProp: "publishedAt",
        orderByDirection: "desc",
        startAt: this.lastPostFetched,
      });
      this.noMorePostsToFetch = amountFetched < 5;
    },
  },
  async created() {
    //get the authUser
    const userId = this.id ?? this.$store.getters["auth/authUser"].id;
    if (this.id) {
      await this.$store.dispatch("users/fetchUser", { id: this.id });
    } else {
      await this.$store.dispatch("auth/fetchAuthUser");
    }

    //get the posts
    const { amountFetched } = await this.$store.dispatch("fetchItemsByProp", {
      collectionName: "posts",
      whereProp: "userId",
      whereValue: userId,
      orderByProp: "publishedAt",
      orderByDirection: "desc",
      maxElements: this.maxElementsPerPage,
    });
    //console.log("UserShow > created > amountFetched", amountFetched);
    this.noMorePostsToFetch = amountFetched < 5;
    //get the threads

    this.$store.dispatch("notifyAppIsReady", "UserShow");
  },
};
</script>
