import type { RouteLocationNormalized } from 'vue-router';

export const useUserStore = defineStore('UserStore', () => {
  const router = useRouter();
  const isLoggedIn = ref(false);

  const login = async () => {
    isLoggedIn.value = true;
    await router.push({ name: 'index' });
  };

  const logout = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => {
    isLoggedIn.value = false;
    console.log('UserStore>logout', {
      toName: to.name,
      fromName: from.name,
      userIsLoggedIn: isLoggedIn.value,
    });

    await router.push({ name: 'index' });
  };
  return {
    isLoggedIn,
    login,
    logout,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
