import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import Forum from '@/types/Forum';

const { forumsData } = useSampleData();
export const useForumStore = defineStore('ForumStore', () => {
  //STATE
  const forums = ref(forumsData);
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
      forumsData.filter((forum: Forum) => forum.categoryId === categoryId)
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
