import firebaseService from "@/services/firebaseService";

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authUserObserverUnsubscribe: null,
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters["users/getUser"](state.authId);
    },
  },
  actions: {
    async fetchAuthUser({ commit, dispatch }) {
      const userId = firebaseService().getAuthUserId();
      //console.log("fetchAuthUser > getAuthUserId returned ", userId);
      if (userId === undefined) {
        return new Promise((resolve) => resolve({}));
      }
      const user = await dispatch(
        "fetchItem",
        {
          source: "users",
          id: userId,
          handleUnsubscribe: (unsubscribe) => {
            commit("setAuthUserUnsubscribe", unsubscribe);
          },
        },
        { root: true }
      );

      commit("setAuthId", { authId: userId });
      return user;
    },
    initAuthentification({ state, commit, dispatch }) {
      //console.log("auth > initAuthentification called");
      if (state.authUserObserverUnsubscribe) {
        state.authUserObserverUnsubscribe();
        commit("setAuthUserObserverUnsubscribe", { unsubscribe: null });
      }
      return new Promise((resolve) => {
        const unsubscribe = firebaseService().auth.onAuthStateChanged(
          async (user) => {
            // console.log(
            //   "actions > initAuthentification > onAuthStateChanged running"
            // );
            dispatch("runUnsubscribeAuthUser");
            if (user) {
              await dispatch("fetchAuthUser");
            }
            dispatch("notifyAppIsReady", "initAuthentification", {
              root: true,
            });
            resolve(user);
          }
        );
        commit("setAuthUserObserverUnsubscribe", { unsubscribe });
      });
    },
    async runUnsubscribeAuthUser({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe();
        commit("setAuthUserUnsubscribe", null);
      }
    },
    async registerUserWithEmailAndPassword(
      { dispatch },
      { name, username, email, password, avatar }
    ) {
      email = email.toLowerCase();
      const registerResult = await firebaseService().registerUser({
        email,
        password,
      });
      //console.log("actions > registerUserWithEmailAndPassword", registerResult);
      const user = await dispatch(
        "users/createUser",
        {
          name,
          username,
          email,
          avatar,
          id: registerResult.user.uid,
        },
        { root: true }
      );
      // dispatch("fetchAuthUser");
      return user;
    },
    async loginWithGoogle({ dispatch, commit }) {
      const user = await firebaseService().signinWithGoogle();
      console.log("actions > loginWithGoogle > user", user);
      if (!user.exists) {
        dispatch("users/createUser", { ...user }, { root: true });
        commit("setAuthId", { authId: user.id });
      }
    },
    loginUserWithEmailAndPassword(context, { email, password }) {
      return firebaseService().loginUserWithEmailAndPassword({
        email,
        password,
      });
    },
    async logoutUser({ commit }) {
      firebaseService().signOut();
      console.log("Called firebaseService().signOut()");
      commit("setAuthId", { authId: null });
    },
  },
  mutations: {
    setAuthId(state, { authId }) {
      //console.log("Calling setAuthId with a authId = ", authId);
      state.authId = authId;
      //console.log("Called setAuthId so authId is ", state.authId);
    },

    setAuthUserUnsubscribe(state, { unsubscribe }) {
      state.authUserUnsubscribe = unsubscribe;
    },
    setAuthUserObserverUnsubscribe(state, { unsubscribe }) {
      state.authUserObserverUnsubscribe = unsubscribe;
    },
  },
};
