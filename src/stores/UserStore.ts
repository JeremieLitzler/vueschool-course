import { ref } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import type User from '@/types/User';

const { usersData } = useSampleData();
export const useUserStore = defineStore('UserStore', () => {
  //STATE
  const users = ref(usersData);

  //GETTERS
  const getUserById = (userId: string | undefined): User => {
    const matchingUser = users.value.find((user) => user.id === userId);
    if (matchingUser === undefined) return {};

    return matchingUser;
  };

  return {
    users,
    getUserById,
  };
});
