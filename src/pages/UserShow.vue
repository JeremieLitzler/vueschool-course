<template>
  <div class="flex-grid">
    <div class="col-3 push-top">
      <user-profile-card v-if="!edit" :user="user" />
      <user-profile-card-editor v-else :user="user" />

      <p class="text-xsmall text-faded text-center">
        Member since june 2003, last visited 4 hours ago
      </p>
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user?.name }}'s recent activity </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <!-- <div class="activity-list">
          <div class="activity">
            <div class="activity-header">
              <img
                src="https://i.imgur.com/OqlZN48.jpg"
                alt=""
                class="hide-mobile avatar-small"
              />
              <p class="title">
                How can I chop onions without crying?
                <span>Joker started a topic in Cooking</span>
              </p>
            </div>
  
            <div class="post-content">
              <div>
                <p>
                  I absolutely love onions, but they hurt my eyes! Is there a way
                  where you can chop onions without crying?
                </p>
              </div>
            </div>
  
            <div class="thread-details">
              <span>4 minutes ago</span>
              <span>1 comments</span>
            </div>
          </div>
  
          <div class="activity">
            <div class="activity-header">
              <img
                src="http://i.imgur.com/s0AzOkO.png"
                alt=""
                class="hide-mobile avatar-small"
              />
  
              <p class="title">
                Wasabi vs horseraddish?
                <span>Joker replied to Robin's topic in Cooking</span>
              </p>
            </div>
  
            <div class="post-content">
              <div>
                <blockquote class="small">
                  <div class="author">
                    <a href="/user/robin" class=""> robin</a>
                    <span class="time">a month ago</span>
                    <i class="fa fa-caret-down"></i>
                  </div>
  
                  <div class="quote">
                    <p>
                      Is horseradish and Wasabi the same thing? I&amp;#39;ve heard
                      so many different things.
                    </p>
                  </div>
                </blockquote>
  
                <p>They're not the same!</p>
              </div>
            </div>
  
            <div class="thread-details">
              <span>2 days ago</span>
              <span>1 comment</span>
            </div>
          </div>
  
          <div class="activity">
            <div class="activity-header">
              <img
                src="https://i.imgur.com/OqlZN48.jpg"
                alt=""
                class="hide-mobile avatar-small"
              />
              <p class="title">
                Where is the sign in button??????!?!?!?!
                <span
                  >Joker replied to his own topic in Questions & Feedback</span
                >
              </p>
            </div>
  
            <div class="post-content">
              <div>
                <p>
                  <strong
                    ><i>Post deleted due to inappropriate language</i></strong
                  >
                </p>
              </div>
            </div>
  
            <div class="thread-details">
              <span>7 days ago</span>
              <span>7 comments</span>
            </div>
          </div>
        </div> -->
      <section class="text-center" v-if="userPosts.length === 0">
        No post yet.
        <router-link :to="{ name: RouteName.TheHome }"
          >Start here ⚡</router-link
        >
      </section>
      <post-list v-else :posts="userPosts" />
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
import PostList from '@/components/PostList.vue';
import { useUserStore } from '@/stores/UserStore';
import { useCommonStore } from '@/stores/CommonStore';
import UserProfileCard from '@/components/UserProfileCard.vue';
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue';
import { usePostStore } from '@/stores/PostStore';
import { RouteName } from '@/enums/RouteName';

const props = defineProps<{ id?: string; edit?: boolean }>();

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
