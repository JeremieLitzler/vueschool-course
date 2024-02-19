import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import useSampleData from '@/composables/useSampleData';
import type User from '@/types/User';

const { usersData } = useSampleData();
export const useUserStore = defineStore('UserStore', () => {
  //STATE
  const users = ref(usersData);
  const authId = ref('38St7Q8Zi2N1SPa5ahzssq9kbyp1');

  //GETTERS
  const getUserById = (userId: string | undefined): User => {
    const matchingUser = users.value.find((user) => user.id === userId);
    if (matchingUser === undefined) return {};

    return matchingUser;
  };

  const authUser = computed((): User => {
    const result = getUserById(authId.value);
    console.log('authUser', result);

    return result;
  });

  //ACTIONS

  return {
    users,
    authUser,
    getUserById,
  };
});
