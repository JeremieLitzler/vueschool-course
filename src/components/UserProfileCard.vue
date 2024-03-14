<template>
  <div class="profile-card">
    <p class="text-center">
      <app-avatar-image
        :key="appAvatarImageCompKey"
        :src="user?.avatar"
        :alt="`${user?.name} profile picture`"
        cssClass="avatar-xlarge"
      />
    </p>

    <h1 class="title">{{ user?.username }}</h1>

    <p class="text-lead">{{ user?.name }}</p>

    <p class="text-justify">
      {{ user?.bio || 'No bio specified' }}
    </p>

    <span class="online">{{ user?.name }} is online</span>

    <div class="stats">
      <span>{{ user?.postsCount }} posts</span>
      <span>{{ user?.threadsCount }} threads</span>
    </div>

    <hr />

    <p v-if="user?.website" class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="user?.website" target="_blank" rel="noopener">{{
        user?.website
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import uniqueIdHelper from '@/helpers/uniqueIdHelper';
import User from '@/types/User';
import { RouteName } from '@/enums/RouteName';
const { getUserById, getAuthUser } = useUserStore();

const props = defineProps<{
  user: User;
}>();

const appAvatarImageCompKey = ref(uniqueIdHelper().newUniqueId);

const user = computed(() => getUserById(props.user?.id));
//console.log('user-profile-card>setup>user', user.value);

const isEditableProfile = computed(() => {
  const route = useRoute();
  const result = route.params.id === undefined && getAuthUser() !== undefined;
  return result;
});
</script>

<style scoped></style>
