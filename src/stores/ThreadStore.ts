import { reactive } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import type Thread from '@/types/Thread';
import AppendPostToThreadRequest from '@/types/AppendPostToThreadRequest';

const { threadsData } = useSampleData();
export const useThreadStore = defineStore('ThreadStore', () => {
  //STATE
  const threads = reactive(threadsData);
  //GETTERS
  const getThreadById = (threadId: string | undefined): Thread => {
    const match = threads.find((thread: Thread) => thread.id === threadId);
    if (match === undefined) return {};

    return match;
  };

  const getThreadsByForumId = (forumId: string | undefined): Thread[] => {
    const matches = threads.filter(
      (thread: Thread) => thread.forumId === forumId
    );
    return matches;
  };

  const appendPostToThread = (request: AppendPostToThreadRequest) => {
    const thread = threads.find(
      (thread: Thread) => thread.id === request.threadId
    );
    if (!thread) {
      throw new Error(`Thread ID <${request.threadId}> waas not found...`);
    }
    thread?.posts!.push(request.postId);
  };

  return {
    threads,
    getThreadById,
    getThreadsByForumId,
    appendPostToThread,
  };
});
