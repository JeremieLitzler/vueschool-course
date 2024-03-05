import { RouteName } from '@/enums/RouteName';
import { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router';
import router from '@/router';

export default function useAppendRouteHelper() {
  const toHomePage = () => {
    router.push({ name: RouteName.TheHome });
  };
  const toSignOut = () => {
    router.push({ name: RouteName.UserLogout });
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

  const toSuccessRedirect = (route: RouteLocationNormalizedLoaded) => {
    console.log(
      'toSuccessRedirect > route.query.redirectTo',
      route.query.redirectTo
    );

    if (!route.query.redirectTo) {
      console.log('toSuccessRedirect > going toHomePage');
      router.push({
        path: '/',
      });
    }

    const redirectTo: RouteLocationRaw = {
      path: route.query.redirectTo?.toString(),
    };
    router.push(redirectTo);
  };

  return {
    toHomePage,
    toForumPage,
    toThreadPage,
    toSignOut,
    toSuccessRedirect,
  };
}
