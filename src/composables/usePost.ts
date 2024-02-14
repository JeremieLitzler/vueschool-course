import type Post from '@/types/Post.ts';
import useSampleData from '@/composables/useSampleData.ts';

const { postsData } = useSampleData();

export default function usePost() {
  const getPostById = (postId: string | undefined): Post => {
    const matchingPost = postsData.find((post: Post) => post.id === postId);
    if (matchingPost === undefined) return {};

    return matchingPost;
  };

  const getPostByThreaId = (threadId: string | undefined): Post[] => {
    const matches = postsData.filter(
      (post: Post) => post.threadId === threadId
    );

    return matches;
  };

  return {
    getPostById,
    getPostByThreaId,
  };
}
