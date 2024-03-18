import { RouteName } from '@/enums/RouteName';
import { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router';
import router from '@/router';
import { AppQueryStringParam } from '@/enums/AppQueryStringParam';

export default function appendRouteHelper() {
  /**
   * Rebuild the route to load from 'redirectTo' query parameter.
   *
   * @param route The current route
   * @returns The full route found in the 'redirectTo' query parameter.
   */
  const _toRequestedRoute = (route: RouteLocationNormalizedLoaded) => {
    const [path, queryRaw] =
      route.query[AppQueryStringParam.redirectTo]!.toString().split('?');
    const query = Object.fromEntries(new URLSearchParams(queryRaw));
    const redirectTo: RouteLocationRaw = {
      path,
      query: query,
    };
    return redirectTo;
  };
  const toHomePage = () => {
    return { name: RouteName.TheHome };
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
    if (!route.query.redirectTo) {
      return toHomePage();
    }

    return _toRequestedRoute(route);
  };

  return {
    toHomePage,
    toForumPage,
    toThreadPage,
    toSignOut,
    toSuccessRedirect,
  };
}
