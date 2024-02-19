<template>
  <div class="profile-card">
    <p class="text-center">
      <img
        :src="user.avatar"
        :alt="`${user.name} profile picture`"
        class="avatar-xlarge"
      />
    </p>

    <h1 class="title">{{ user.username }}</h1>

    <p class="text-lead">{{ user.name }}</p>

    <p class="text-justify">
      {{ user.bio || "No bio specified" }}
    </p>

    <span class="online">{{ user.name }} is online</span>

    <div class="stats">
      <span>{{ userPostsCount }} posts</span>
      <span>{{ userThreadsCount }} threads</span>
    </div>

    <hr />

    <p v-if="user.website" class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="user.website" target="_blank" rel="noopener">{{
        user.website
      }}</a>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    userPosts() {
      return this.$store.getters.postsByUserId(this.user.id);
    },
    userThreads() {
      return this.$store.getters.threadsByUserId(this.user.id);
    },
    userPostsCount() {
      return this.userPosts.length;
    },
    userThreadsCount() {
      return this.userThreads.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
