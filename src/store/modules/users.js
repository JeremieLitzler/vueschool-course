import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById } = useArraySearchHelper();

import useMakeFetchActions from "@/helpers/makeFetchActionsHelper";
const { makeFetchItemAction, makeFetchItemsAction } = useMakeFetchActions();

import useFirebaseHelper from "@/helpers/firebaseHelper";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import {
  getFirestore,
  doc,
  // onSnapshot,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  query,
  where,
} from "firebase/firestore";

import firebaseService from "@/services/firebaseService";
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    getUser: (state, getters) => (userId) => {
      const user = findById(state.items, userId);
      //console.log("getUser > id", userId, user);
      return getters.hydrateUser(user);
    },

    hydrateUser: () => (user) => {
      const hydratedUser = {
        ...user,
        get postsCount() {
          return user.postsCount || 0;
        },
        get threadsCount() {
          return user.threads?.length || 0;
        },
      };
      // console.log("fetchUser > hydratedUser ", hydratedUser);
      return hydratedUser;
    },
  },
  actions: {
    async fetchItemsByProp(
      { commit },
      { collectionName, whereProp, whereValue }
    ) {
      const queryObj = query(
        collection(db, collectionName),
        where(whereProp, "==", whereValue)
      );
      const posts = await getDocs(queryObj);
      posts.forEach((post) => {
        commit(
          "setItem",
          {
            source: collectionName,
            item: { ...post.data(), id: post.id },
          },
          { root: true }
        );
      });
    },
    fetchUser: makeFetchItemAction({ source: "users" }),
    fetchUsers: makeFetchItemsAction({ source: "users" }),

    async createUser({ commit }, { id, name, username, email, avatar }) {
      const newUser = {
        id,
        name,
        username,
        email,
        avatar,
        bio: "",
        postsCount: 0,
        registeredAt: firebaseService().getServerTimeStamp(),
        threads: [],
        usernameLower: username.toLowerCase(),
      };

      console.log("actions > createUser > id", id);
      const userRef = doc(db, "users", id);
      await writeBatch(db)
        .set(userRef, { ...newUser })
        .commit();

      const newUserDoc = useFirebaseHelper().docToResource(
        await getDoc(userRef)
      );

      commit("setItem", { source: "users", item: newUserDoc }, { root: true });
      return newUserDoc;
    },
    async updateUser({ commit }, user) {
      const userRef = doc(db, "users", user.id);
      await writeBatch(db)
        .set(userRef, { ...user })
        .commit();

      const newUser = useFirebaseHelper().docToResource(await getDoc(userRef));
      commit("setItem", { source: "users", item: newUser }, { root: true });
      return newUser;
    },
  },
  mutations: {},
};
