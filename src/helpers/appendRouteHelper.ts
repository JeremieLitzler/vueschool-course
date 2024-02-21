import { RouteName } from '@/enums/RouteName';
import { useRouter } from 'vue-router';

export default function useAppendRouteHelper() {
  const router = useRouter();

  const toForumPage = (id: string) => {
    router.push({
      name: RouteName.ForumShow,
      params: { id },
    });
  };

  const toThreadPage = (id: string) => {
    router.push({
      name: RouteName.ThreadShow,
      params: { id },
    });
  };

  return {
    toForumPage,
    toThreadPage,
  };
}
