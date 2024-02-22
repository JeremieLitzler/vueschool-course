import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
// import useSampleData from '@/helpers/sampleData';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import Forum from '@/types/Forum';

// const { forumsData } = useSampleData();
// const { findById, findManyById } = useArraySearchHelper();

export const useForumStore = defineStore('ForumStore', () => {
  //STATE
  const forums = ref<Forum[]>([]);
  const getForumById = (forumId: string | undefined): Forum => {
    const match = forums.value.find((forum: Forum) => forum.id === forumId);
    if (match === undefined) return {};

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
    appendThreadToForum,
  };
});
