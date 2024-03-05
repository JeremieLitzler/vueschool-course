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
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import objectHelper from '@/helpers/objectHelper';
import UserRegisterRequest from '@/types/UserRegisterRequest';
import UserLoginRequest from '@/types/UserLoginRequest';

// const { findById } = useArraySearchHelper();

export const useUserStore = defineStore('UserStore', () => {
  //STATE
  const users = ref<User[]>([]);
  const authId = ref('');
  let authUserObserverUnsubscribe: null | Function = null;

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
  const fetchAuthUser = async (
    reFetch: boolean | undefined = undefined
  ): Promise<string | null> => {
    console.log('UserStore > authId', authId);
    const userId = firebaseService().getAuthUserId();
    if (userId === undefined) {
      return authId.value;
    } else {
      await fetchUser(userId, reFetch);
      authId.value = userId;
      return userId;
    }
  };
  const fetchUser = (
    id: string,
    reFetch: boolean | undefined = undefined
  ): Promise<User> => {
    return useCommonStore().fetchItem<User>({
      targetStore: users,
      collection: FirestoreCollection.Users,
      id,
      reFetch,
    });
  };
  const fetchUsers = (ids: string[]): Promise<Awaited<User>[]> => {
    return useCommonStore().fetchSomeItems<User>({
      ids,
      targetStore: users,
      collection: FirestoreCollection.Users,
    });
  };
  const registerUserWithEmailAndPassword = async ({
    name,
    username,
    email,
    password,
    avatar,
  }: UserRegisterRequest): Promise<User | FirebaseError> => {
    const emailLower = email.toLowerCase();
    const registerResult = await firebaseService().registerUser({
      email: emailLower,
      password,
    });

    if (
      !objectHelper().instanceOf<UserCredential>(
        registerResult,
        'operationType'
      )
    ) {
      return registerResult as FirebaseError;
    }
    console.log('actions > registerUserWithEmailAndPassword', registerResult);
    const user = await createUser(
      {
        name,
        username,
        email: emailLower,
        avatar,
      },
      registerResult.user.uid
    );
    await fetchAuthUser();
    return user;
  };
  const loginWithEmailAndPassword = ({ email, password }: UserLoginRequest) => {
    return firebaseService().loginWithEmailAndPassword({ email, password });
  };
  const loginWithGoogle = async () => {
    const user = await firebaseService().signinWithGoogle();
    console.log('actions > loginWithGoogle > user', user);
    if (!user.exists) {
      createUser(user, user.uid);
      authId.value = user.uid;
    }
  };
  const initAuthentification = () => {
    if (authUserObserverUnsubscribe) {
      (authUserObserverUnsubscribe as Function)();
      authUserObserverUnsubscribe = null;
    }
    return new Promise((resolve) => {
      const unsubscribe = firebaseService().auth.onAuthStateChanged(
        async (user) => {
          console.log(
            'actions > initAuthentification > onAuthStateChanged running'
          );

          if (user) {
            await fetchAuthUser();
          }
          useCommonStore().notifyAppIsReady();
          resolve(user);
        }
      );
      authUserObserverUnsubscribe = unsubscribe;
    });
  };
  const logoutUser = async () => {
    await firebaseService().signOut();
    authId.value = '';
  };
  const createUser = async (
    { name, username, email, avatar }: UserCreateRequest,
    id: string
  ): Promise<User | FirebaseError> => {
    const newUser = {
      id,
      name,
      username,
      avatar,
      email,
      bio: '',
      postsCount: 0,
      registeredAt: firebaseService().getServerTimeStamp(),
      threads: [],
      usernameLower: username.toLowerCase(),
    };

    console.log('No error... Let´s continue');

    const userRef = useFirebase().doc(useFirebase().db, 'users', id);
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
  const refreshFromFirebase = (id: string | undefined) => {
    return fetchUser(id!, true);
  };
  return {
    authId,
    users,
    getAuthUser,
    getUserById,
    fetchAuthUser,
    fetchUser,
    fetchUsers,
    initAuthentification,
    registerUserWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logoutUser,
    createUser,
    updateUser,
    setUser,
    appendThreadToUser,
    refreshFromFirebase,
  };
});
