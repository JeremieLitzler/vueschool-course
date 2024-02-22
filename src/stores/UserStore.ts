import { ref } from 'vue';
import { defineStore } from 'pinia';
// import useSampleData from '@/helpers/sampleData';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import { usePostStore } from './PostStore';
import { useThreadStore } from './ThreadStore';
import type GetUserExtended from '@/types/GetUserExtended';
import User from '@/types/User';
import AppendThreadToUserRequest from '@/types/AppendThreadToUserRequest';

// const { usersData } = useSampleData();
// const { findById } = useArraySearchHelper();

export const useUserStore = defineStore('UserStore', () => {
  //STATE
  const users = ref<User[]>([]);
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
    const matchingUser = users.value.find((user) => user.id! === userId);
    if (matchingUser === undefined) return {};

    const extendedUser = hydrateUserExtented(userId);
    //console.log('extendedUser', extendedUser);

    return {
      instance: matchingUser,
      ...extendedUser,
    };
  };

  const getAuthUser = (): GetUserExtended => {
    const result = getUserById(authId.value);
    //console.log('authUser', result);
    return result;
  };

  //ACTIONS
  const updateUser = (updatedUser: User) => {
    const userIndex = users.value.findIndex(
      (user) => user.id === updatedUser.id
    );
    users.value[userIndex] = updatedUser;
  };

  const appendThreadToUser = (request: AppendThreadToUserRequest) => {
    const user = getUserById(request.userId);
    if (!user) {
      throw new Error(`User ID <${request.userId}> waas not found...`);
    }
    user?.threads!.push(request.thread);
  };

  const setUser = (user: User) => {
    const index = users.value.findIndex((element) => element.id === user.id);
    if (user.id && index !== -1) {
      users.value![index] = user;
    } else {
      users.value!.push(user);
    }
  };
  return {
    users,
    getAuthUser,
    getUserById,
    updateUser,
    setUser,
    appendThreadToUser,
  };
});
