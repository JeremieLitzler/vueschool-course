export const useUserStore = defineStore('UserStore', () => {
  const isLoggedIn = ref(false);

  return {
    isLoggedIn,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
