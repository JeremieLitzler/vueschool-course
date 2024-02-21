import { ref } from 'vue';
import { defineStore } from 'pinia';
import type Post from '@/types/Post.ts';
import type Thread from '@/types/Thread';
import useSampleData from '@/helpers/sampleData';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import { useUserStore } from './UserStore';

const { postsData } = useSampleData();
// const { findById, findManyById } = useArraySearchHelper();

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

  const getThreadFirstPostBody = (thread: Thread) => {
    const match = posts.value.find((post) => post.id === thread.posts![0]);
    return match;
  };
  //ACTIONS
  const addPost = (post: Post) => {
    //console.log('calling addPost in PostStore', post);
    post.publishedAt = Math.floor(Date.now() / 1000);
    const { getAuthUser } = useUserStore();
    post.userId = getAuthUser().instance?.id;
    _setPost(post);
  };

  const updatePost = (request: PostUpdateRequest) => {
    //console.log("updatePost > id ", id);

    const post = getPostById(request.id);
    //console.log("updatePost > post ", post);
    const updatedPost = { ...post, text: request.body };
    //console.log("updatePost > updatedPost ", updatedPost);
    _setPost(updatedPost);
  };

  const _setPost = (post: Post) => {
    const index = posts.value.findIndex((element) => element.id === post.id);
    if (post.id && index !== -1) {
      posts.value![index] = post;
    } else {
      posts.value!.push(post);
    }
  };
  return {
    posts,
    getPostById,
    getPostsByThreaId,
    getPostsByUserId,
    getThreadFirstPostBody,
    addPost,
    updatePost,
  };
});
