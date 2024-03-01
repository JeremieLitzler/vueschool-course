import { ref } from 'vue';
import { defineStore } from 'pinia';
import User from '@/types/User';
import AppendThreadToUserRequest from '@/types/AppendThreadToUserRequest';
// import useArraySearchHelper from '@/helpers/arraySearchHelper';
import { useCommonStore } from '@/stores/CommonStore';
import type GetUserExtended from '@/types/GetUserExtended';
import { FirestoreCollection } from '@/enums/FirestoreCollection';
import UserCreateRequest from '@/types/UserCreateRequest';
import firebaseService from '@/services/firebaseService';
import useFirebase from '@/helpers/fireBaseConnector';
import useFirebaseHelper from '@/helpers/firebaseHelper';

// const { findById } = useArraySearchHelper();

export const useUserStore = defineStore('UserStore', () => {
  //STATE
  const users = ref<User[]>([]);
  const authId = ref('7uVPJS9GHoftN58Z2MXCYDqmNAh2');

  //GETTERS
  const _hydrateUser = (user: User) => {
    const hydratedUser = {
      ...user,
      get postsCount() {
        return user.postsCount || 0;
      },
      get threadsCount() {
        return user.threads?.length || 0;
      },
    };
    // console.log('fetchUser > hydratedUser ', hydratedUser);
    return hydratedUser;
  };
  const getUserById = (userId: string | undefined): GetUserExtended => {
    const matchingUser = users.value.find((user) => user.id! === userId);
    if (matchingUser === undefined) return { id: '' };

    const extendedUser = _hydrateUser(matchingUser);
    //console.log('extendedUser', extendedUser);

    return extendedUser;
  };

  const getAuthUser = (): GetUserExtended => {
    const result = getUserById(authId.value);
    //console.log('authUser', result);
    return result;
  };

  //ACTIONS
  const fetchUser = (id: string): Promise<User> => {
    return useCommonStore().fetchItem<User>({
      targetStore: users,
      collection: FirestoreCollection.Users,
      id,
    });
  };
  const fetchUsers = (ids: string[]): Promise<Awaited<User>[]> => {
    return useCommonStore().fetchSomeItems<User>({
      ids,
      targetStore: users,
      collection: FirestoreCollection.Users,
    });
  };
  const createUser = async (request: UserCreateRequest): Promise<User> => {
    const emailLower = request.email.toLowerCase();
    const newUser = {
      ...request,
      email: emailLower,
      bio: '',
      postsCount: 0,
      registeredAt: firebaseService().getServerTimeStamp(),
      threads: [],
      usernameLower: request.username.toLowerCase(),
    };

    const userRef = await useFirebase().doc(
      useFirebase().collection(useFirebase().db, 'users')
    );
    await useFirebase()
      .writeBatch(useFirebase().db)
      .set(userRef, newUser)
      .commit();

    const newUserDoc = useFirebaseHelper().docToResource(
      await useFirebase().getDoc(userRef)
    );

    useCommonStore().setItem<User>({ targetStore: users, item: newUserDoc });
    return newUserDoc;
  };
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
    user?.threads!.push(request.thread.id);
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
    authId,
    users,
    getAuthUser,
    getUserById,
    fetchUser,
    fetchUsers,
    createUser,
    updateUser,
    setUser,
    appendThreadToUser,
  };
});
