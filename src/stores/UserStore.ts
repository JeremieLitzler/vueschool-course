import { ref } from 'vue';
import { defineStore } from 'pinia';
import User from '@/types/User';
import AppendThreadToUserRequest from '@/types/AppendThreadToUserRequest';
// import arraySearchHelper from '@/helpers/arraySearchHelper';
import { useCommonStore } from '@/stores/CommonStore';
import type GetUserExtended from '@/types/GetUserExtended';
import { FirestoreCollection } from '@/enums/FirestoreCollection';
import UserCreateRequest from '@/types/UserCreateRequest';
import firebaseService from '@/services/firebaseService';
import useFirebase from '@/helpers/fireBaseConnector';
import firebaseHelper from '@/helpers/firebaseHelper';
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import objectHelper from '@/helpers/objectHelper';
import UserRegisterRequest from '@/types/UserRegisterRequest';
import UserLoginRequest from '@/types/UserLoginRequest';
import UserUpdateRequest from '@/types/UserUpdateRequest';

// const { findById } = arraySearchHelper();

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
    //console.log('fetchUser > hydratedUser ', hydratedUser);
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
    //console.log('UserStore>getAuthUser>authId', authId.value);

    const result = getUserById(authId.value);
    //console.log('UserStore>getAuthUser>authUser', result);
    return result;
  };

  //ACTIONS
  const fetchAuthUser = async (
    reFetch: boolean | undefined = undefined
  ): Promise<GetUserExtended | null> => {
    //console.log('UserStore > authId', authId);
    const userId = firebaseService().getAuthUserId();
    if (userId === undefined) {
      return null;
    } else {
      const authUser = await fetchUser(userId, reFetch);
      authId.value = authUser.id;
      return _hydrateUser(authUser);
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
    avatarFile,
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
    const avatarUrl = await useCommonStore().uploadImageToStorage({
      userId: registerResult.user.uid,
      image: avatarFile!,
    });
    //console.log("actions > registerUserWithEmailAndPassword", registerResult);

    //console.log('actions > registerUserWithEmailAndPassword', registerResult);
    const user = await createUser(
      {
        name,
        username,
        email: emailLower,
        avatar: avatarUrl!,
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
    //console.log('actions > loginWithGoogle > user', user);
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
          //console.log(
          //   'actions > initAuthentification > onAuthStateChanged running'
          // );

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

    //console.log('No error... Let´s continue');

    const userRef = useFirebase().doc(useFirebase().db, 'users', id);
    await useFirebase()
      .writeBatch(useFirebase().db)
      .set(userRef, newUser)
      .commit();

    const newUserDoc = firebaseHelper().docToResource(
      await useFirebase().getDoc(userRef)
    );

    useCommonStore().setItem<User>({ targetStore: users, item: newUserDoc });
    return newUserDoc;
  };
  const updateUser = async ({
    userUpdated,
    updatedAvatar,
    id,
  }: UserUpdateRequest) => {
    const avatarUrl = updatedAvatar
      ? await useCommonStore().uploadImageToStorage({
          userId: id,
          image: updatedAvatar!,
        })
      : null;

    const userRef = useFirebase().doc(useFirebase().db, 'users', id);
    await useFirebase()
      .writeBatch(useFirebase().db)
      .set(userRef, {
        avatar: avatarUrl || userUpdated.avatar,
        bio: userUpdated.bio || null,
        email: userUpdated.email || null,
        name: userUpdated.name || null,
        postsCount: userUpdated.postsCount || null,
        registeredAt: userUpdated.registeredAt || null,
        threads: userUpdated.threads || null,
        username: userUpdated.username || null,
        usernameLower: userUpdated.usernameLower || null,
        website: userUpdated.website || null,
        location: userUpdated.location || null,
      })
      .commit();

    const newUser = firebaseHelper().docToResource(
      await useFirebase().getDoc(userRef)
    );

    useCommonStore().setItem({ targetStore: users, item: newUser });
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
