import router from '@/router';
import { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router';
import { RouteName } from '@/enums/RouteName';
import { AppQueryStringParam } from '@/enums/AppQueryStringParam';
import { getQueryStringValue } from './queryStringHelper';

export default function appendRouteHelper() {
  /**
   * Rebuild the route to load from 'redirectTo' query parameter.
   *
   * @param route The current route
   * @returns The full route found in the 'redirectTo' query parameter value.
   */
  const _toRequestedRoute = (route: RouteLocationNormalizedLoaded) => {
    const redirectToValue = getQueryStringValue(
      route.query,
      AppQueryStringParam.redirectTo
    );
    if (!redirectToValue) {
      return toHomePage();
    }
    const [path, queryRaw] = redirectToValue!.split('?');
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
