<template>
  <div class="profile-card">
    <p class="text-center">
      <app-avatar-image
        :src="user?.avatar"
        :alt="`${user?.name} profile picture`"
        cssClass="avatar-xlarge"
      />
    </p>

    <h1 class="title">{{ user?.username }}</h1>

    <p class="text-lead">{{ user?.name }}</p>

    <p class="text-justify">
      {{ user?.bio || "No bio specified" }}
    </p>

    <span class="online">{{ user?.name }} is online</span>

    <div class="stats">
      <span>{{ user?.postsCount }} posts</span>
      <span>{{ user?.threadsCount }} threads</span>
    </div>

    <div v-if="user?.website">
      <hr />
      <p class="text-large text-center">
        <i class="fa fa-globe"></i>
        <a :href="user?.website" target="_blank" rel="noopener">{{
          user?.website
        }}</a>
      </p>
    </div>

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
    };
  },
  computed: {
    isEditableProfile() {
      return (
        this.$route.params.id === undefined &&
        this.$store.getters["auth/authUser"] !== undefined
      );
    },
  },
  created() {
    console.log("UserProfileCard>created>user", this.user);
  },
};
</script>

<style lang="scss" scoped></style>
