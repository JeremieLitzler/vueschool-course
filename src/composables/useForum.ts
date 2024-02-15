import type Forum from '@/types/Forum';
import useSampleData from '@/composables/useSampleData.ts';

const { forumsData } = useSampleData();

export default function useForum() {
  const getForumById = (forumId: string | undefined): Forum => {
    const match = forumsData.value.find((forum: Forum) => forum.id === forumId);
    if (match === undefined) return {};

    return match;
  };

  return {
    getForumById,
  };
}
