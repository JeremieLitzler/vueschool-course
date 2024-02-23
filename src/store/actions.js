import useUUID from "@/helpers/uniqueIdHelper";
import useDateHelper from "@/helpers/dateHelper";
import useArraySearchHelper from "@/helpers/arraySearchHelper";

const { createId } = useUUID();
const { nowTimeStamp } = useDateHelper();
const { findById } = useArraySearchHelper();

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import {
  getFirestore,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
  fetchSomething({ state, commit }) {
    console.log("fetching is", state.fetching);
    commit("setFetching");
  },
  fetchItem({ state, commit }, { source, id }) {
    const item = findById(state[source], id);
    if (item) {
      console.log(`🍍 found item in store (source: ${source}, id: ${id}) 🍍`);
      return new Promise((resolve) => {
        resolve(item);
      });
    }

    return new Promise((resolve) => {
      //console.log(`🚨 fetching a item (source: ${source}, id: ${id}) on firebase 🚨`);
      console.log(`🚨 fetching a item on firebase 🚨`);
      onSnapshot(doc(db, source, id), (responseDoc) => {
        //console.log("from firestore > responseDoc: ", responseDoc);
        //console.log("from firestore > responseDoc.data: ", responseDoc.data());
        //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
        const item = { ...responseDoc.data(), id: responseDoc.id };
        //console.log(`got from firestore > in ${source}:`, item);
        console.log(`got item from firestore`);
        commit("setItem", { source, item });
        resolve(item);
      });
    });
  },
  fetchItems({ dispatch }, { source, ids }) {
    const fetchs = ids.map((id) => dispatch("fetchItem", { source, id }));
    return Promise.all(fetchs);
  },
  //users
  fetchAuthUser({ state, dispatch }) {
    return dispatch("fetchUser", { id: state.authId });
  },
  async fetchUser({ dispatch }, { id }) {
    const user = await dispatch("fetchItem", { source: "users", id });
    return dispatch("hydrateUser", user);
  },
  fetchUsers({ dispatch }, { ids }) {
    return dispatch("fetchItems", { source: "users", ids });
  },
  updateUser({ commit }, user) {
    commit("setItem", { source: "users", item: user });
  },
  hydrateUser:
    async ({ dispatch }) =>
    (user) => {
      console.log("calling hydrateUser in actions");
      const posts = dispatch("fetchPosts", { ids: user?.posts });
      const threads = dispatch("fetchThreads", { ids: user?.threads });
      console.log("posts / threads", posts, threads);
      const hydrated = {
        ...user,
        postsCount: posts.length,
        posts,
        threadsCount: threads.length,
        threads,
      };
      //console.log(hydrated);
      return hydrated;
    },
  //categories
  fetchCategory({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "categories", id });
  },
  fetchAllCategories({ state, commit }) {
    if (state.categories.length > 0) {
      console.log(`🍍 found categories in store 🍍`);
      return new Promise((resolve) => {
        resolve(state.categories);
      });
    }
    console.log(`🚨 fetching categories from firestore 🚨`);
    return new Promise((resolve) => {
      const collectionName = "categories";
      getDocs(collection(db, collectionName)).then((querySnapshot) => {
        //console.log("from firestore > querySnapshot: ", querySnapshot);
        // console.log("from firestore > querySnapshot.docs: ", querySnapshot.docs);
        const categories = querySnapshot.docs.map((doc) => {
          //console.log("from firestore > doc: ", doc.id, doc.data());
          const category = { id: doc.id, ...doc.data() };
          //console.log("category created: ", category);
          commit("setItem", { source: "categories", item: category });
          return category;
        });
        //console.log(`got from firestore > in ${collectionName}:`, categories);

        resolve(categories);
      });
    });
  },
  //forums
  fetchForums({ dispatch }, { ids }) {
    return dispatch("fetchItems", { source: "forums", ids });
  },
  fetchForum({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "forums", id });
  },

  //posts
  fetchPost({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "posts", id });
  },
  fetchPosts({ dispatch }, { ids }) {
    return dispatch("fetchItems", { source: "posts", ids });
  },
  async createPost({ state, commit, getters }, post) {
    post.id = post.id ?? createId();
    post.publishedAt = nowTimeStamp;
    post.userId = getters.authUser.id;

    const postRef = doc(collection(db, "posts"));
    const threadRef = doc(db, "threads", post.threadId);
    await writeBatch(db)
      .set(postRef, post)
      .update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(state.authId),
      })
      .commit();

    const newPost = await getDoc(postRef);
    commit("setItem", {
      source: "posts",
      item: { ...newPost.data(), id: postRef.id },
    });
    commit("appendPostToThread", {
      childId: postRef.id,
      parentId: post.threadId,
    });
    commit("appendContributorToThread", {
      childId: state.authId,
      parentId: post.threadId,
    });

    return post;
  },
  async updatePost({ commit, getters }, { id, body }) {
    //console.log("updatePost > id ", id);
    const post = getters.getPostById(id);
    //console.log("updatePost > post ", post);
    const updatedPost = { ...post, text: body };

    const postRef = doc(db, "posts", id);
    await writeBatch(db)
      .update(postRef, {
        ...updatedPost,
      })
      .commit();
    //console.log("updatePost > updatedPost ", updatedPost);
    commit("setItem", { source: "posts", item: updatedPost });
  },
  //threads
  fetchThread({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "threads", id });
  },
  fetchThreads({ dispatch }, { ids }) {
    return dispatch("fetchItems", { source: "threads", ids });
  },
  createThread({ commit, dispatch, getters }, { title, body, forumId }) {
    const id = createId();
    const postId = createId();

    //console.log("threadId", id);
    const thread = {
      forumId: forumId,
      publishedAt: nowTimeStamp,
      title: title,
      userId: getters.authUser.id,
      id,
    };
    commit("setItem", { source: "threads", item: thread });
    commit("appendThreadToForum", { childId: id, parentId: forumId });
    commit("appendThreadToUser", {
      childId: id,
      parentId: getters.authUser.id,
    });
    dispatch("createPost", { threadId: id, postId, text: body });
    return id;
  },
  async updateThread({ commit, dispatch, getters }, { title, body, id }) {
    //console.log("updatedThread > id ", id);
    const thread = getters.threadById(id);
    //console.log("updatedThread > thread ", thread);
    const updatedThread = {
      ...thread,
      title,
    };

    //console.log("updatedThread > ", updatedThread);

    commit("setItem", { source: "threads", item: updatedThread });
    dispatch("updatePost", { id: updatedThread.posts[0], body });
    return thread;
  },
};
