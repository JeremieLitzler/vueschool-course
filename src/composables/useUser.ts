import useSampleData from './useSampleData.ts';
import type User from '@/types/User.ts';

const { usersData } = useSampleData();

export default function useUser() {
  const getUserById = (userId: string | undefined): User => {
    const matchingUser = usersData.value.find((user) => user.id === userId);
    if (matchingUser === undefined) return {};

    return matchingUser;
  };

  return {
    getUserById,
  };
}
