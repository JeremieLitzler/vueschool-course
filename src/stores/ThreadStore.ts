import { ref } from 'vue';
import { defineStore } from 'pinia';

// import useSampleData from '@/helpers/sampleData';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import { useCommonStore } from '@/stores/CommonStore';
import { useForumStore } from '@/stores/ForumStore';
import { useUserStore } from '@/stores/UserStore';
import { usePostStore } from '@/stores/PostStore';

import type Thread from '@/types/Thread';
import type ThreadHydraded from '@/types/ThreadHydraded';
import AppendPostToThreadRequest from '@/types/AppendPostToThreadRequest';
import { FirestoreCollection } from '@/enums/FirestoreCollection';
import useFirebase from '@/helpers/fireBaseConnector';
import firebaseService from '@/services/firebaseService';

// const { threadsData } = useSampleData();
// const { findById, findManyById } = useArraySearchHelper();

export const useThreadStore = defineStore('ThreadStore', () => {
  //STATE
  const threads = ref<Thread[]>([]);
  //GETTERS
  const getThreadById = (threadId: string | undefined): ThreadHydraded => {
    const match = threads.value.find(
      (thread: Thread) => thread.id === threadId
    );
    if (match === undefined)
      return { id: '', author: '', repliesCount: 0, contributorsCount: 0 };

    return _hydrateThread(match);
  };

  const getThreadsByForumId = (
    forumId: string | undefined
  ): ThreadHydraded[] => {
    const matches = threads.value.filter(
      (thread: Thread) => thread.forumId === forumId
    );
    return matches.map((thread) => _hydrateThread(thread));
  };

  const getThreadsByUserId = (userId: string | undefined): Thread[] => {
    const matches = threads.value.filter(
      (thread: Thread) => thread.userId === userId
    );
    return matches;
  };
  const _hydrateThread = (thread: Thread): ThreadHydraded => {
    return {
      ...thread,
      get author() {
        return useUserStore().getUserById(thread.userId)?.instance?.name!;
      },
      get repliesCount() {
        if (!thread?.posts) return 0;

        return thread?.posts!.length - 1; //the first post isn't counted hence the '-1'
      },
      get contributorsCount() {
        return [...new Set(thread?.contributors)].length;
      },
    };
  };

  //ACTIONS
  const fetchThread = (id: string): Promise<Thread> => {
    return useCommonStore().fetchItem<Thread>({
      targetStore: threads,
      collection: FirestoreCollection.Threads,
      id,
    });
  };
  const fetchThreads = async (ids: string[]) => {
    const threadsFetched = await useCommonStore().fetchSomeItems<Thread>({
      ids,
      targetStore: threads,
      collection: FirestoreCollection.Threads,
    });
    return threadsFetched.map((thread) => _hydrateThread(thread));
  };
  const createThread = async (request: ThreadCreateRequest) => {
    const thread = {
      forumId: request.forumId,
      publishedAt: firebaseService().getServerTimeStamp(),
      title: request.title,
      userId: useUserStore().getAuthUser().instance!.id,
    };

    const threadRef = useFirebase().doc(
      useFirebase().collection(useFirebase().db, 'threads')
    );
    const forumRef = useFirebase().doc(
      useFirebase().db,
      'forums',
      thread.forumId!
    );
    const userRef = useFirebase().doc(
      useFirebase().db,
      'users',
      thread.userId!
    );
    await useFirebase()
      .writeBatch(useFirebase().db)
      .set(threadRef, thread)
      .update(forumRef, {
        threads: useFirebase().arrayUnion(threadRef.id),
      })
      .update(userRef, {
        threads: useFirebase().arrayUnion(threadRef.id),
      })
      .commit();
    const newThread = await useFirebase().getDoc(threadRef);
    setThread({ ...newThread.data(), id: threadRef.id });
    createThreadAddRelated(request, {
      ...newThread.data(),
      id: threadRef.id,
    } as Thread);
    return threadRef.id;
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

    setThread(updatedThread);
    usePostStore().updatePost({
      id: updatedThread.posts![0],
      body: request.body,
    });
    return thread;
  };

  const setThread = (thread: Thread) => {
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
    console.log('createThreadAddRelated', thread);

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
      text: threadRequest.body,
    });
  };
  const appendPostToThread = (request: AppendPostToThreadRequest) => {
    const thread = getThreadById(request.threadId);
    if (!thread) {
      throw new Error(`Thread ID <${request.threadId}> was not found...`);
    }
    thread?.posts!.push(request.postId);
  };

  return {
    //state
    threads,
    //getters
    getThreadById,
    getThreadsByForumId,
    getThreadsByUserId,
    //actions
    fetchThread,
    fetchThreads,
    createThread,
    setThread,
    updateThread,
    appendPostToThread,
  };
});
