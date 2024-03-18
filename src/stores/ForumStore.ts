import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
// import useSampleData from '@/helpers/sampleData';
// import arraySearchHelper from '@/helpers/arraySearchHelper';
import Forum from '@/types/Forum';
import { FirestoreCollection } from '@/enums/FirestoreCollection';
import { useCommonStore } from './CommonStore';

// const { forumsData } = useSampleData();
// const { findById, findManyById } = arraySearchHelper();

export const useForumStore = defineStore('ForumStore', () => {
  //STATE
  const forums = ref<Forum[]>([]);
  const getForumById = (forumId: string | undefined): Forum => {
    const match = forums.value.find((forum: Forum) => forum.id === forumId);
    if (match === undefined) return { id: '' };

    return match;
  };

  //GETTERS
  const getForumsByCategory = (
    categoryId: string | undefined
  ): Ref<Forum[]> => {
    const matches = ref(
      forums.value.filter((forum: Forum) => forum.categoryId === categoryId)
    );

    return matches;
  };

  //ACTIONS
  const fetchForum = (id: string): Promise<Forum> => {
    return useCommonStore().fetchItem<Forum>({
      targetStore: forums,
      collection: FirestoreCollection.Forums,
      id,
    });
  };
  const fetchForums = (ids: string[]) => {
    return useCommonStore().fetchSomeItems<Forum>({
      ids,
      targetStore: forums,
      collection: FirestoreCollection.Forums,
    });
  };
  const appendThreadToForum = (request: AppendThreadToForumRequest) => {
    const forum = getForumById(request.forumId);
    if (!forum) {
      throw new Error(`Forum ID <${request.forumId}> waas not found...`);
    }
    forum?.threads!.push(request.threadId);
  };

  return {
    forums,
    getForumById,
    getForumsByCategory,
    fetchForum,
    fetchForums,
    appendThreadToForum,
  };
});
