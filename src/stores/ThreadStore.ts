import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

import useSampleData from '@/helpers/sampleData';
import useDateHelper from '@/helpers/dateHelper';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import { useForumStore } from './ForumStore';
import { useUserStore } from './UserStore';
import { usePostStore } from './PostStore';

import type Thread from '@/types/Thread';
import type ThreadHydraded from '@/types/ThreadHydraded';
import AppendPostToThreadRequest from '@/types/AppendPostToThreadRequest';

const { threadsData } = useSampleData();
// const { findById, findManyById } = useArraySearchHelper();

export const useThreadStore = defineStore('ThreadStore', () => {
  //STATE
  const threads = ref(threadsData);
  //GETTERS
  const getThreadById = (threadId: string | undefined): ThreadHydraded => {
    const match = threads.value.find(
      (thread: Thread) => thread.id === threadId
    );
    if (match === undefined)
      return { author: '', repliesCount: 0, contributorsCount: 0 };

    return {
      ...match,
      get author() {
        return useUserStore().getUserById(match.userId).instance!.name!;
      },
      get repliesCount() {
        return match.posts!.length - 1; //the first post isn't counted hence the '-1'
      },
      get contributorsCount() {
        return [...new Set(match!.contributors)].length;
      },
    };
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
  const createThread = (request: ThreadCreateRequest) => {
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

    _setThread(thread);
    createThreadAddRelated(request, thread);
    return id;
  };
  const updateThread = (request: ThreadUpdateRequest): Thread => {
    //console.log("updatedThread > id ", id);
    const thread = getThreadById(request.threadId);
    //console.log("updatedThread > thread ", thread);
    const updatedThread = {
      ...thread,
      title: request.title,
    };

    //console.log("updatedThread > ", updatedThread);

    _setThread(updatedThread);
    usePostStore().updatePost({
      id: updatedThread.posts![0],
      body: request.body,
    });
    return thread;
  };

  const _setThread = (thread: Thread) => {
    const index = threads.value.findIndex(
      (element) => element.id === thread.id
    );
    if (thread.id && index !== -1) {
      threads.value[index] = thread;
    } else {
      threads.value.push(thread);
    }
  };

  const createThreadAddRelated = (
    threadRequest: ThreadCreateRequest,
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
    updateThread,
    appendPostToThread,
  };
});
