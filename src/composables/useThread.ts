import type Thread from '@/types/Thread.ts';
import useSampleData from '@/composables/useSampleData.ts';

const { threadsData } = useSampleData();

export default function useThread() {
  const getThreadById = (threadId: string | undefined): Thread => {
    const match = threadsData.value.find(
      (post: Thread) => post.id === threadId
    );
    if (match === undefined) return {};

    return match;
  };

  return {
    getThreadById,
  };
}
