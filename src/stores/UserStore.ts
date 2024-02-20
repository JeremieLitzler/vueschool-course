import { ref } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import { usePostStore } from './PostStore';
import { useThreadStore } from './ThreadStore';
import type GetUserExtended from '@/types/GetUserExtended';
import User from '@/types/User';

const { usersData } = useSampleData();
export const useUserStore = defineStore('UserStore', () => {
  //STATE
  const users = ref(usersData);
  const authId = ref('7uVPJS9GHoftN58Z2MXCYDqmNAh2');

  //GETTERS
  const hydrateUserExtented = (userId: string | undefined) => {
    const { getPostsByUserId } = usePostStore();
    const { getThreadsByUserId } = useThreadStore();
    const posts = getPostsByUserId(userId);
    const postsCount = posts.length;
    const threads = getThreadsByUserId(userId);
    const threadsCount = threads.length;
    return {
      posts,
      postsCount,
      threads,
      threadsCount,
    };
  };
  const getUserById = (userId: string | undefined): GetUserExtended => {
    const matchingUser = users.value.find((user) => user.id === userId);
    if (matchingUser === undefined) return {};

    const extendedUser = hydrateUserExtented(userId);
    console.log('extendedUser', extendedUser);

    return {
      instance: matchingUser,
      ...extendedUser,
    };
  };

  const getAuthUser = (): GetUserExtended => {
    const result = getUserById(authId.value);
    console.log('authUser', result);

    return result;
  };

  //ACTIONS
  const updateUser = (updatedUser: User) => {
    const userIndex = users.value.findIndex(
      (user) => user.id === updatedUser.id
    );
    users.value[userIndex] = updatedUser;
  };

  return {
    users,
    getAuthUser,
    getUserById,
    updateUser,
  };
});
