import type { Ref } from 'vue';
import { ref } from 'vue';
import type Forum from '@/types/Forum';
import useSampleData from '@/composables/useSampleData.ts';

const { forumsData } = useSampleData();

export default function useForum() {
  const getForumById = (forumId: string | undefined): Forum => {
    const match = forumsData.value.find((forum: Forum) => forum.id === forumId);
    if (match === undefined) return {};

    return match;
  };

  const getForumsByCategory = (
    categoryId: string | undefined
  ): Ref<Forum[]> => {
    const matches = ref(
      forumsData.value.filter((forum: Forum) => forum.categoryId === categoryId)
    );

    return matches;
  };

  return {
    getForumById,
    getForumsByCategory,
  };
}
