import useNotification from "@/composables/useNotification";
import useUUID from "@/helpers/uniqueIdHelper";
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
      { dispatch /*state*/ },
      { name, username, email, password, avatar = null }
    ) {
      email = email.toLowerCase();
      const registerResult = await firebaseService().registerUser({
        email,
        password,
      });
      //console.log(
      //   "auth>this.registerUserWithEmailAndPassword>userId",
      //   registerResult.user.uid
      // );
      //console.log(
      //   "auth>this.registerUserWithEmailAndPassword>authId",
      //   state.authId
      // );
      let { imageUrl } = await dispatch("uploadAvatar", {
        userId: registerResult.user.uid,
        avatar,
      });

      //console.log("actions > registerUserWithEmailAndPassword", registerResult);
      const user = await dispatch(
        "users/createUser",
        {
          name,
          username,
          email,
          avatar: imageUrl,
          id: registerResult.user.uid,
        },
        { root: true }
      );
      // dispatch("fetchAuthUser");
      return user;
    },
    async loginWithGoogle({ dispatch, commit }) {
      const user = await firebaseService().signinWithGoogle();
      //console.log("actions > loginWithGoogle > user", user);
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
      //console.log("Called firebaseService().signOut()");
      commit("setAuthId", { authId: null });
    },
    async uploadAvatar(context, { userId, avatar }) {
      try {
        if (!avatar) {
          return { imageUrl: null };
        }
        const storageBucket = firebaseService().getStorageBucket(
          `uploads/${userId}/images/${useUUID().createId()}-${
            avatar.name || "random-image"
          }`
        );
        const snapshot = await firebaseService().uploadToStorageBucket(
          storageBucket,
          avatar
        );
        const imageUrl = await firebaseService().getImageURL(snapshot.ref);
        //console.log("auth>uploadAvatar>imageUrl", imageUrl);
        return { imageUrl, success: true };
      } catch (error) {
        //console.error(error);
        useNotification().addNotification({
          message: `Failed to upload image (${error.code})`,
          type: "error",
        });
        return { imageUrl: null };
      }
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
