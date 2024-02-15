import { ref } from 'vue';
import type { Ref } from 'vue';
import type Post from '@/types/Post.ts';
import useSampleData from '@/composables/useSampleData.ts';

const { postsData } = useSampleData();

export default function usePost() {
  const getPostById = (postId: string | undefined): Post => {
    const matchingPost = postsData.value.find(
      (post: Post) => post.id === postId
    );
    if (matchingPost === undefined) return {};

    return matchingPost;
  };

  const getPostsByThreaId = (threadId: string | undefined): Ref<Post[]> => {
    const matches = ref(
      postsData.value.filter((post: Post) => post.threadId === threadId)
    );

    return matches;
  };

  const addPost = (post: Post) => {
    console.log('calling addPost in usePost', post);

    postsData.value.push(post);
  };

  return {
    getPostById,
    getPostsByThreaId,
    addPost,
  };
}
