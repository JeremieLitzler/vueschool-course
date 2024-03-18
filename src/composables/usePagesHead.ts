import { RoutePath } from '@/enums/RoutePath';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useForumStore } from '@/stores/ForumStore';
import { useThreadStore } from '@/stores/ThreadStore';
import { useUserStore } from '@/stores/UserStore';
import type AppPageHeadProps from '@/types/AppPageHeadProps';
import type Category from '@/types/Category';
import type Forum from '@/types/Forum';
import type User from '@/types/User';
import type WithName from '@/types/WithName';
import { UseHeadInput } from '@vueuse/head';

export function useCustomPageHead(baseSlug: RoutePath | string | null = '') {
  const _getSlug = (id: string | null = null) =>
    baseSlug!.substring(1, baseSlug!.length).replace(':id', id!);

  const _useStandardPageWithId = <T extends WithName>(
    entity: T,
    id: string,
    label: string | null,
    customDescription: string | null = null
  ) => {
    const headData: UseHeadInput = {
      title: `${label ? `${label}:` : ''} ${entity.name}`,
      meta: [
        {
          name: 'description',
          content: customDescription ?? `The page for ${label} ${entity.name}`,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: `${import.meta.env.VITE_BASE_URL}/${_getSlug(id)}`,
        },
      ],
    };
    return headData;
  };
  const useHomePage = () => {
    const headData: AppPageHeadProps = {
      title: 'Welcome to the Vue.js 3 Master Class Forum',
      description: 'An awesome Vue.js powered forum backed by Firebase',
    };
    return headData;
  };
  const usePublicUserPage = async (id: string) => {
    console.log('running usePublicUserPage...');

    const entity = await useUserStore().fetchUser(id);
    const headData = _useStandardPageWithId<User>(entity, id, 'User');
    return headData;
  };
  const useCategoryPage = async (id: string) => {
    const entity = await useCategoryStore().fetchCategory(id);
    const headData = _useStandardPageWithId<Category>(entity, id, 'Category');
    return headData;
  };
  const useForumPage = async (id: string) => {
    const entity = await useForumStore().fetchForum(id);
    const headData = _useStandardPageWithId<Forum>(entity, id, 'Forum');
    return headData;
  };
  const useThreadPage = async (id: string) => {
    const entity = await useThreadStore().fetchThread(id);
    const headData: AppPageHeadProps = {
      title: `Thread: ${entity.title}`,
      description: `Read the posts of the thread.`,
      slug: _getSlug(id),
    };
    return headData;
  };
  const useThreadCreatePage = async (id: string) => {
    const entity = await useForumStore().fetchForum(id);
    const headData: AppPageHeadProps = {
      title: `Create a thread for ${entity.name} forum`,
      description: `By creating a new thread, ask your questions, share your experience and engage cordially.`,
      slug: _getSlug(id),
    };
    return headData;
  };
  const useLoginPage = () => {
    const headData: AppPageHeadProps = {
      title: 'Sign-in to the app',
      description:
        'You can use your credentials or your Google account to sign-in',
      slug: _getSlug(),
    };
    return headData;
    return headData;
  };
  const useRegisterPage = () => {
    const headData: AppPageHeadProps = {
      title: 'Register for free',
      description:
        'Please provide your details to get started and reply to the threads or create one.',
      slug: _getSlug(),
    };
    return headData;
    return headData;
  };
  return {
    useHomePage,
    useCategoryPage,
    useForumPage,
    useThreadPage,
    useThreadCreatePage,
    useLoginPage,
    useRegisterPage,
    usePublicUserPage,
  };
}
