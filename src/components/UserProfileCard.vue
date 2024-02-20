<template>
  <div class="profile-card">
    <p class="text-center">
      <img
        :src="user.instance!.avatar"
        :alt="`${user.instance!.name} profile picture`"
        class="avatar-xlarge"
      />
    </p>

    <h1 class="title">{{ user.instance!.username }}</h1>

    <p class="text-lead">{{ user.instance!.name }}</p>

    <p class="text-justify">
      {{ user.instance!.bio || 'No bio specified' }}
    </p>

    <span class="online">{{ user.instance!.name }} is online</span>

    <div class="stats">
      <span>{{ user.postsCount }} posts</span>
      <span>{{ user.threadsCount }} threads</span>
    </div>

    <hr />

    <p v-if="user.instance!.website" class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="user.instance!.website" target="_blank" rel="noopener">{{
        user.instance!.website
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

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import User from '@/types/User';
import { RouteName } from '@/enums/RouteName';
const { getUserById, getAuthUser } = useUserStore();

const props = defineProps<{
  user: User;
}>();

const user = computed(() => getUserById(props.user.id));
const isEditableProfile = computed(() => {
  const route = useRoute();
  const result = route.params.id === undefined && getAuthUser() !== undefined;
  return result;
});
</script>

<style scoped></style>
