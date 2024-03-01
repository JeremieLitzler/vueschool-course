import { RouteName } from '@/enums/RouteName';
import { useRouter } from 'vue-router';

export default function useAppendRouteHelper() {
  const router = useRouter();
  const toHomePage = () => {
    router.push({ name: RouteName.TheHome });
  };
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
    toHomePage,
    toForumPage,
    toThreadPage,
  };
}
