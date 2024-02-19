import type { Ref } from 'vue';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import type Thread from '@/types/Thread';

const { threadsData } = useSampleData();
export const useThreadStore = defineStore('ThreadStore', () => {
  //STATE
  const threads = ref(threadsData);
  //GETTERS
  const getThreadById = (threadId: string | undefined): Thread => {
    const match = threads.value.find(
      (thread: Thread) => thread.id === threadId
    );
    if (match === undefined) return {};

    return match;
  };

  const getThreadsByForumId = (forumId: string | undefined): Ref<Thread[]> => {
    const matches = ref(
      threads.value.filter((thread: Thread) => thread.forumId === forumId)
    );

    return matches;
  };

  return {
    threads,
    getThreadById,
    getThreadsByForumId,
  };
});
