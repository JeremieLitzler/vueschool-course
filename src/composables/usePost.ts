import type Post from '@/types/Post.ts';
import useSampleData from '@/composables/useSampleData.ts';

const { postsData } = useSampleData();

export default function usePost() {
  const getPostById = (postId: string | undefined): Post => {
    const matchingPost = postsData.find((post: Post) => post.id === postId);
    if (matchingPost === undefined) return {};

    return matchingPost;
  };

  return {
    getPostById,
  };
}
