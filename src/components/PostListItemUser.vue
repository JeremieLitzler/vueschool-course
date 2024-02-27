<template>
  <div class="user-info">
    <router-link
      :to="{ name: RouteName.UserShow, params: { id: user?.id } }"
      class="user-name"
      >{{ user?.name }}</router-link
    >

    <router-link :to="{ name: RouteName.UserShow, params: { id: user?.id } }">
      <img class="avatar-large" :src="user?.avatar" :alt="user?.name" />
    </router-link>

    <p class="desktop-only text-small">
      {{ user?.postsCount }}
      post{{ user?.postsCount! > 1 ? 's' : '' }}
    </p>
    <p class="desktop-only text-small">
      {{ user.threadsCount }}
      thread{{ user?.threadsCount! > 1 ? 's' : '' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/enums/RouteName';
import GetUserExtented from '@/types/GetUserExtended';

const { user } = defineProps<{ user: GetUserExtented }>();
</script>

<style scoped></style>
