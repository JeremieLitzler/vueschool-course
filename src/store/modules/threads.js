import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById, findManyByProp } = useArraySearchHelper();

import useMakeFetchActions from "@/helpers/makeFetchActionsHelper";
const { makeFetchItemAction, makeFetchItemsAction } = useMakeFetchActions();

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import {
  getFirestore,
  doc,
  //   onSnapshot,
  getDoc,
  //   getDocs,
  collection,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import firebaseService from "@/services/firebaseService";
import useFirebaseHelper from "@/helpers/firebaseHelper";
import useAppendChildToParentMutationHelper from "@/helpers/appendChildToParentMutationHelper";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const { appendChildToParentMutation } = useAppendChildToParentMutationHelper();

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    threadById: (state, getters, rootState) => (id) => {
      const thread = findById(state.items, id);
      return getters.hydrateThread(thread, rootState);
    },
    threadsByUserId: (state) => (userId) =>
      findManyByProp(state.items, "userId", userId),
    getThreadsByForumId: (state, getters) => (forumId) => {
      return findManyByProp(state.items, "forumId", forumId).map((thread) =>
        getters.hydrateThread(thread, getters)
      );
    },

    hydrateThread: () => (thread, rootState) => {
      return {
        ...thread,
        get author() {
          return findById(rootState.users.items, thread.userId)?.name;
        },
        get repliesCount() {
          return thread?.posts.length - 1; //the first post isn't counted hence the '-1'
        },
        get threadJustCreated() {
          return thread?.posts.length < 2;
        },
        get contributorsCount() {
          return [...new Set(thread?.contributors)].length;
        },
      };
    },
  },
  actions: {
    fetchThread: makeFetchItemAction({ source: "threads" }),
    fetchThreads: makeFetchItemsAction({ source: "threads" }),
    async createThread(
      { commit, dispatch, rootState },
      { title, body, forumId }
    ) {
      //console.log("threadId", id);
      const authId = rootState.auth.authId;
      if (!authId) {
        return new Promise((reject) => reject("You're not logged in"));
      }
      const thread = {
        forumId: forumId,
        publishedAt: firebaseService().getServerTimeStamp(),
        title: title,
        userId: authId,
      };

      const threadRef = doc(collection(db, "threads"));
      const forumRef = doc(db, "forums", thread.forumId);
      const userRef = doc(db, "users", authId);
      const batch = writeBatch(db);
      batch.set(threadRef, thread);
      batch.update(forumRef, {
        threads: arrayUnion(threadRef.id),
      });
      batch.update(userRef, {
        threads: arrayUnion(threadRef.id),
      });
      await batch.commit();

      const newThread = await getDoc(threadRef);

      commit(
        "setItem",
        {
          source: "threads",
          item: { ...newThread.data(), id: threadRef.id },
        },
        { root: true }
      );
      commit(
        "forums/appendThreadToForum",
        {
          childId: threadRef.id,
          parentId: forumId,
        },
        { root: true }
      );
      commit(
        "users/appendThreadToUser",
        {
          childId: threadRef.id,
          parentId: authId,
        },
        { root: true }
      );
      await dispatch(
        "posts/createPost",
        { threadId: threadRef.id, text: body },
        { root: true }
      );
      return threadRef.id;
    },
    async updateThread({ commit, getters }, { title, body, id }) {
      //console.log("updatedThread > id ", id);
      const thread = getters.threadById(id);
      //console.log("updateThread > thread", thread);
      const threadRef = doc(db, "threads", thread.id);
      const postRef = doc(db, "posts", thread.posts[0]);
      await writeBatch(db)
        .set(threadRef, thread)
        .update(threadRef, {
          title,
        })
        .update(postRef, {
          text: body,
        })
        .commit();

      const newThread = useFirebaseHelper().docToResource(
        await getDoc(threadRef)
      );
      const newPost = useFirebaseHelper().docToResource(await getDoc(postRef));

      commit(
        "setItem",
        {
          source: "threads",
          item: newThread,
        },
        { root: true }
      );
      commit(
        "setItem",
        {
          source: "posts",
          item: newPost,
        },
        { root: true }
      );

      return newThread;
    },
  },
  mutations: {
    appendPostToThread: appendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),
    appendContributorToThread: appendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),
  },
};
