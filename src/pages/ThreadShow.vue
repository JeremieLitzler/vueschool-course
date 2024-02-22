<template>
  <div v-if="!thread" class="col-full text-center">
    <h1>Oops, the thread isn't valid</h1>
    <p>
      The thread (<b>ID: {{ id }}</b
      >) doesn't exist.
    </p>
    <router-link :to="{ name: 'Home' }">Back to a safe place</router-link>
  </div>
  <div v-else class="col-large push-top">
    <h1 class="thread-title">
      {{ thread?.title }}
      <router-link
        :to="{ name: RouteName.ThreadEdit, params: { id } }"
        class="btn-green btn-small"
        >Edit the thread</router-link
      >
    </h1>
    <section class="thread-meta">
      <p>
        By <a href="#" class="link-unstyled">{{ thread?.author }}</a
        >, <app-date :timestamp="thread?.publishedAt" />.
      </p>
      <span class="hide-mobile text-faded text-small"
        >{{ thread?.repliesCount }} replies by
        {{ thread?.contributorsCount }} contributors</span
      >
    </section>

    <PostList :posts="threadPosts!" />
    <PostEditor :thread-id="props.id" @@add-post="savePost" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AddPostPayload from '@/types/AddPostPayload';
import { usePostStore } from '@/stores/PostStore';
import { useThreadStore } from '@/stores/ThreadStore';
import useUUID from '@/helpers/uniqueIdHelper';

import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';
import type Post from '@/types/Post';
import type ThreadHydraded from '@/types/ThreadHydraded.ts';
import { RouteName } from '@/enums/RouteName';

const { getPostsByThreaId, addPost } = usePostStore();
const { getThreadById, appendPostToThread } = useThreadStore();
const { newUniqueId } = useUUID();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const threadPosts = computed((): Post[] | undefined =>
  getPostsByThreaId(props.id)
);

const thread = computed((): ThreadHydraded | undefined =>
  getThreadById(props.id)
);

const savePost = (entry: AddPostPayload) => {
  entry.post.id = newUniqueId;
  addPost(entry.post);
  appendPostToThread({
    threadId: entry.post.threadId!,
    postId: entry.post.id!,
  });
};

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/config/firebase';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import Thread from '@/types/Thread';
import { useCommonStore } from '@/stores/CommonStore';
import { useUserStore } from '@/stores/UserStore';
const firebaseApp = initializeApp(firebaseConfig);

onMounted(() => {
  const db = getFirestore(firebaseApp);
  useCommonStore().updateFetching();
  //fetch thread
  onSnapshot(doc(db, 'threads', props.id), (responseDoc) => {
    //console.log("from firestore > responseDoc: ", responseDoc);
    //console.log("from firestore > responseDoc.data: ", responseDoc.data());
    //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
    const thread: Thread = { ...responseDoc.data(), id: responseDoc.id };
    //console.log("from firestore > thread:", thread);
    useThreadStore().setThread(thread);
    //fetch user
    onSnapshot(doc(db, 'users', thread.userId!), (responseDoc) => {
      useUserStore().setUser({
        ...responseDoc.data(),
        id: responseDoc.id,
      });
    });
    thread?.posts?.forEach((postId) => {
      //fetch posts
      onSnapshot(doc(db, 'posts', postId), (responseDoc) => {
        const post: Post = { ...responseDoc.data(), id: responseDoc.id };
        usePostStore().setPost(post);
        //fetch each use per post
        onSnapshot(doc(db, 'users', post.userId!), (responseDoc) => {
          useUserStore().setUser({
            ...responseDoc.data(),
            id: responseDoc.id,
          });
          useCommonStore().updateFetching();
        });
      });
    });
  });
});
</script>

<style scoped></style>
@/helpers/uniqueIdHelper @/helpers/uniqueIdHelper
