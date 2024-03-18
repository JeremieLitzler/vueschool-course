<template>
  <app-page-head
    :title="head.title"
    :description="head.description"
    :slug="head.slug"
  />
  <div
    v-if="emailWasVerified"
    class="block-message block-message-success block-message-no-mg push-top"
  >
    Your account is updated. You can continue using the
    <router-link :to="{ name: RouteName.TheHome }">Forums</router-link>.
  </div>
  <div class="flex-grid">
    <div class="col-3 push-top">
      <user-profile-card v-if="!edit" :user="user" />
      <user-profile-card-editor v-else :user="user" />
    </div>

    <div class="col-7">
      <section class="text-center" v-if="userPosts.length === 0">
        No post yet.
        <router-link :to="{ name: RouteName.TheHome }"
          >Start here ⚡</router-link
        >
      </section>
      <post-list v-else :posts="userPosts" :orderBy="OrderByDirection.Desc" />
      <button
        @click="fetchNextPosts"
        v-if="!noMorePostsToFetch"
        class="btn-green btn-small"
      >
        Load more posts...
      </button>
    </div>
  </div>
</template>
<script setup async lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useCommonStore } from '@/stores/CommonStore';
import { usePostStore } from '@/stores/PostStore';
import { RouteName } from '@/enums/RouteName';
import { OrderByDirection } from '@/enums/OrderByDirection';
import PostList from '@/components/PostList.vue';
import UserProfileCard from '@/components/UserProfileCard.vue';
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue';
import { getQueryStringValue } from '@/helpers/queryStringHelper';
import { useRoute } from 'vue-router';
import { AppQueryStringParam } from '@/enums/AppQueryStringParam';
import { useCustomPageHead } from '@/composables/usePagesHead';
import { RoutePath } from '@/enums/RoutePath';

const props = defineProps<{ id?: string; edit?: boolean }>();

const head = await useCustomPageHead(RoutePath.UserShow).usePublicUserPage(
  props.id!
);

const noMorePostsToFetch = ref(false);
const user = computed(() => {
  //console.log('getting user in UserShow > ', props.id);

  if (props.id) {
    return useUserStore().getUserById(props.id);
  }
  return useUserStore().getAuthUser();
});
const userPosts = computed(() =>
  usePostStore().getPostsByUserId(user.value.id)
);
const lastPostFetched = computed(() => {
  if (userPosts.value.length === 0) return null;
  return userPosts.value[userPosts.value.length - 1];
});
const emailWasVerified = ref(false);
const emailWasVerifiedValue = getQueryStringValue(
  useRoute().query,
  AppQueryStringParam.emailWasVerified
);
if (emailWasVerifiedValue) {
  emailWasVerified.value = Boolean(emailWasVerifiedValue);
}
const fetchNextPosts = async () => {
  const amountPostsFetched = await usePostStore().fetchPostsByUser(
    props.id!,
    lastPostFetched.value
  );

  noMorePostsToFetch.value = amountPostsFetched < 5;
};

await useUserStore().fetchUser(props.id!);
await usePostStore().fetchPostsByUser(props.id!);
useCommonStore().notifyAppIsReady();
</script>
