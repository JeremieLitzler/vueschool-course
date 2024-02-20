import { ref } from 'vue';
// import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import type Post from '@/types/Post.ts';

const { postsData } = useSampleData();
export const usePostStore = defineStore('PostStore', () => {
  //STATE
  const posts = ref(postsData);

  //GETTERS
  const getPostById = (postId: string | undefined): Post => {
    const matchingPost = posts.value.find((post: Post) => post.id === postId);
    if (matchingPost === undefined) return {};

    return matchingPost;
  };

  const getPostsByThreaId = (threadId: string | undefined): Post[] => {
    const matches = posts.value.filter(
      (post: Post) => post.threadId === threadId
    );
    return matches;
  };

  const getPostsByUserId = (userId: string | undefined): Post[] => {
    const matches = posts.value.filter((post: Post) => post.userId === userId);
    return matches;
  };

  //ACTIONS
  const addPost = (post: Post) => {
    console.log('calling addPost in PostStore', post);

    posts.value.push(post);
  };

  return {
    posts,
    getPostById,
    getPostsByThreaId,
    getPostsByUserId,
    addPost,
  };
});