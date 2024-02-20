import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

import useSampleData from '@/composables/useSampleData';
import useDateHelper from '@/composables/useDateHelper';
import { useForumStore } from './ForumStore';
import { useUserStore } from './UserStore';

import type Thread from '@/types/Thread';
import AppendPostToThreadRequest from '@/types/AppendPostToThreadRequest';
import { usePostStore } from './PostStore';

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

  const getThreadsByForumId = (forumId: string | undefined): Thread[] => {
    const matches = threads.value.filter(
      (thread: Thread) => thread.forumId === forumId
    );
    return matches;
  };

  const getThreadsByUserId = (userId: string | undefined): Thread[] => {
    const matches = threads.value.filter(
      (thread: Thread) => thread.userId === userId
    );
    return matches;
  };

  //ACTIONS
  const createThread = (request: CreateThreadRequest) => {
    const id = uuid();
    const postId = uuid();

    const thread = {
      forumId: request.forumId,
      posts: [postId],
      publishedAt: useDateHelper().nowTimeStamp,
      title: request.title,
      userId: useUserStore().getAuthUser().instance!.id,
      id,
    };

    threads.value.push(thread);
    createThreadAddRelated(request, thread);
    return id;
  };
  const createThreadAddRelated = (
    threadRequest: CreateThreadRequest,
    thread: Thread
  ) => {
    useForumStore().appendThreadToForum({
      threadId: thread.id!,
      forumId: thread.forumId!,
    });
    useUserStore().appendThreadToUser({
      thread,
      userId: thread.userId!,
    });
    usePostStore().addPost({
      threadId: thread.id,
      id: thread.posts![0],
      text: threadRequest.body,
    });
  };
  const appendPostToThread = (request: AppendPostToThreadRequest) => {
    const thread = getThreadById(request.threadId);
    if (!thread) {
      throw new Error(`Thread ID <${request.threadId}> waas not found...`);
    }
    thread?.posts!.push(request.postId);
  };

  return {
    threads,
    getThreadById,
    getThreadsByForumId,
    getThreadsByUserId,
    createThread,
    appendPostToThread,
  };
});
