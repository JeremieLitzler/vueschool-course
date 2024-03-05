import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById, findManyByProp } = useArraySearchHelper();

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
  increment,
} from "firebase/firestore";
import firebaseService from "@/services/firebaseService";
import useFirebaseHelper from "@/helpers/firebaseHelper";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    getPostById: (state) => (id) => findById(state.items, id),
    postsByUserId: (state) => (userId) =>
      findManyByProp(state.items, "userId", userId),
    getThreadFirstPostBody: (state) => (thread) =>
      findById(state.items, thread.posts[0]),
  },
  actions: {
    fetchPost({ dispatch }, { id }) {
      return dispatch("fetchItem", { source: "posts", id }, { root: true });
    },
    fetchPosts({ dispatch }, { ids }) {
      return dispatch("fetchItems", { source: "posts", ids }, { root: true });
    },
    async createPost({ commit, rootGetters }, post) {
      //console.log("'createPost > post", post);
      const authId = rootGetters["auth/authUser"].id;
      post.publishedAt = firebaseService().getServerTimeStamp();
      //console.log("createPost > post.publishedAt", post.publishedAt);
      post.userId = authId;

      const postRef = doc(collection(db, "posts"));
      const threadRef = doc(db, "threads", post.threadId);
      const userRef = doc(db, "users", post.userId);
      await writeBatch(db)
        .set(postRef, post)
        .update(threadRef, {
          posts: arrayUnion(postRef.id),
          contributors: arrayUnion(authId),
        })
        .update(userRef, {
          postsCount: increment(1),
        })
        .commit();

      const newPost = await getDoc(postRef);
      commit(
        "setItem",
        {
          source: "posts",
          item: { ...newPost.data(), id: postRef.id },
        },
        { root: true }
      );
      commit(
        "threads/appendPostToThread",
        {
          childId: postRef.id,
          parentId: post.threadId,
        },
        { root: true }
      );
      commit(
        "threads/appendContributorToThread",
        {
          childId: authId,
          parentId: post.threadId,
        },
        { root: true }
      );

      return post;
    },
    async updatePost({ commit }, { id, text }) {
      const postRef = doc(db, "posts", id);
      await writeBatch(db)
        .update(postRef, {
          text,
        })
        .commit();

      const updatedPost = useFirebaseHelper().docToResource(
        await getDoc(postRef)
      );
      //console.log("updatePost > updatedPost ", updatedPost);
      commit("setItem", { source: "posts", item: updatedPost }, { root: true });
    },
  },
  mutations: {},
};
