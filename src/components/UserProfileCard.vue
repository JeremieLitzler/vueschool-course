<template>
  <div class="profile-card">
    <p class="text-center">
      <img
        :src="userProfile?.avatar"
        :alt="`${userProfile?.name} profile picture`"
        class="avatar-xlarge"
      />
    </p>

    <h1 class="title">{{ userProfile?.username }}</h1>

    <p class="text-lead">{{ userProfile?.name }}</p>

    <p class="text-justify">
      {{ userProfile?.bio || "No bio specified" }}
    </p>

    <span class="online">{{ userProfile?.name }} is online</span>

    <div class="stats">
      <span>{{ userProfile?.postsCount }} posts</span>
      <span>{{ userProfile?.threadsCount }} threads</span>
    </div>

    <hr />

    <p v-if="userProfile?.website" class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="userProfile?.website" target="_blank" rel="noopener">{{
        userProfile?.website
      }}</a>
    </p>
    <div v-if="isEditableProfile" class="text-center">
      <hr />
      <router-link
        :to="{ name: RouteName.AccountEdit }"
        class="btn-green btn-small"
        >Edit Profile</router-link
      >
    </div>
  </div>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      RouteName,
      userProfile: { ...this.user },
    };
  },
  computed: {
    isEditableProfile() {
      return (
        this.$route.params.id === undefined &&
        this.$store.getters.authUser !== undefined
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
