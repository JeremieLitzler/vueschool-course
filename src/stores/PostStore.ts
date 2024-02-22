import { ref } from 'vue';
import { defineStore } from 'pinia';
import type Post from '@/types/Post.ts';
import type Thread from '@/types/Thread';
// import useSampleData from '@/helpers/sampleData';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import { useUserStore } from '@/stores/UserStore';
import { useCommonStore } from '@/stores/CommonStore';
import useFirebase from '@/helpers/fireBaseConnector';

// const { postsData } = useSampleData();
// const { findById, findManyById } = useArraySearchHelper();

export const usePostStore = defineStore('PostStore', () => {
  //STATE
  const posts = ref<Post[]>([]);

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
  const fetchPost = (id: string): Promise<Post> => {
    useCommonStore().updateFetching();
    console.log(`🚨fetching a post (ID: ${id}) on firebase 🚨`);
    return new Promise((resolve) => {
      useFirebase().onSnapshot(
        useFirebase().doc(useFirebase().db, 'posts', id),
        (responseDoc) => {
          //console.log("from firestore > responseDoc: ", responseDoc);
          //console.log("from firestore > responseDoc.data: ", responseDoc.data());
          //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
          const post = { ...responseDoc.data(), id: responseDoc.id };
          console.log('from firestore > post:', post);
          setPost(post);
          useCommonStore().updateFetching();
          resolve(post);
        }
      );
    });
  };

  const addPost = (post: Post) => {
    //console.log('calling addPost in PostStore', post);
    post.publishedAt = Math.floor(Date.now() / 1000);
    const { getAuthUser } = useUserStore();
    post.userId = getAuthUser().instance?.id;
    setPost(post);
  };

  const updatePost = (request: PostUpdateRequest) => {
    //console.log("updatePost > id ", id);

    const post = getPostById(request.id);
    //console.log("updatePost > post ", post);
    const updatedPost = { ...post, text: request.body };
    //console.log("updatePost > updatedPost ", updatedPost);
    setPost(updatedPost);
  };

  const setPost = (post: Post) => {
    const index = posts.value.findIndex((element) => element.id === post.id);
    if (post.id && index !== -1) {
      posts.value![index] = post;
    } else {
      posts.value!.push(post);
    }
  };
  return {
    //state
    posts,
    //getters
    getPostById,
    getPostsByThreaId,
    getPostsByUserId,
    getThreadFirstPostBody,
    //actions
    fetchPost,
    addPost,
    updatePost,
    setPost,
  };
});
