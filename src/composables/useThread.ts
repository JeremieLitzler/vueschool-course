import type { Ref } from 'vue';
import { ref } from 'vue';
import type Thread from '@/types/Thread';
import useSampleData from '@/composables/useSampleData.ts';

const { threadsData } = useSampleData();

export default function useThread() {
  const getThreadById = (threadId: string | undefined): Thread => {
    const match = threadsData.value.find(
      (thread: Thread) => thread.id === threadId
    );
    if (match === undefined) return {};

    return match;
  };

  const getThreadsByForumId = (forumId: string | undefined): Ref<Thread[]> => {
    const matches = ref(
      threadsData.value.filter((thread: Thread) => thread.forumId === forumId)
    );

    return matches;
  };

  return {
    getThreadById,
    getThreadsByForumId,
  };
}
