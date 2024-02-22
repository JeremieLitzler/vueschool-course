import { createStore } from "vuex";
// import sourceData from "@/data.json";
import useUUID from "@/helpers/uniqueIdHelper";
import useDateHelper from "@/helpers/dateHelper";
import useArraySearchHelper from "@/helpers/arraySearchHelper";
import useArrayUpdateHelper from "@/helpers/arrayUpdateHelper";

const { createId } = useUUID();
const { nowTimeStamp } = useDateHelper();
const { findById, findManyByProp } = useArraySearchHelper();
const { setResource } = useArrayUpdateHelper();

// const fetchResource =
//   (id) =>
//   ({ collection, mutation }) => {
//     return ({ commit, dispatch }) => {
//       dispatch("fetchSomething");
//       console.log(`🚨fetching a thread (ID: ${id}) on firebase 🚨`);
//       return onSnapshot(doc(db, collection, id), (responseDoc) => {
//         //console.log("from firestore > responseDoc: ", responseDoc);
//         //console.log("from firestore > responseDoc.data: ", responseDoc.data());
//         //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
//         const data = { ...responseDoc.data(), id: responseDoc.id };
//         //console.log("from firestore > thread:", thread);
//         commit(mutation, { data });
//         dispatch("fetchSomething");
//         return data;
//       });
//     };
//   };

const appendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);
    resource[child] = resource[child] || [];
    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
};

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default createStore({
  state: {
    users: [],
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    authId: "7uVPJS9GHoftN58Z2MXCYDqmNAh2",
    fetching: false,
  },
  getters: {
    isFetching: (state) => state.fetching,
    //users
    getUser: (state, getters) => (userId) => {
      return getters.hydrateUser(findById(state.users, userId));
    },
    authUser: (state, getters) => {
      return getters.getUser(state.authId);
    },
    hydrateUser: (state, getters) => (user) => {
      const hydrated = {
        ...user,
        get postsCount() {
          return getters.postsByUserId(user?.id).length;
        },
        get threadsCount() {
          return getters.threadsByUserId(user?.id).length;
        },
      };
      //console.log(hydrated);
      return hydrated;
    },

    //forums
    getForumById: (state) => (forumId) => findById(state.forums, forumId),
    getThreadsByForumId: (state, getters) => (forumId) => {
      return findManyByProp(state.threads, "forumId", forumId).map((thread) =>
        getters.hydrateThread(thread, getters)
      );
    },
    //posts
    getPostById: (state) => (id) => findById(state.posts, id),
    postsByUserId: (state) => (userId) =>
      findManyByProp(state.posts, "userId", userId),
    getThreadFirstPostBody: (state) => (thread) =>
      findById(state.posts, thread.posts[0]),
    //threads
    threadById: (state, getters) => (id) => {
      const thread = findById(state.threads, id);
      return getters.hydrateThread(thread, getters);
    },
    threadsByUserId: (state) => (userId) =>
      findManyByProp(state.threads, "userId", userId),
    hydrateThread: () => (thread, getters) => {
      return {
        ...thread,
        get author() {
          return getters.getUser(thread?.userId)?.name;
        },
        get repliesCount() {
          return thread?.posts.length - 1; //the first post isn't counted hence the '-1'
        },
        get contributorsCount() {
          return [...new Set(thread?.contributors)].length;
        },
      };
    },
  },
  actions: {
    fetchSomething({ commit }) {
      commit("setFetching");
    },
    //users
    fetchUser({ commit, dispatch }, { id }) {
      dispatch("fetchSomething");
      console.log(`🚨fetching a user (ID: ${id}) on firebase 🚨`);
      return new Promise((resolve) => {
        onSnapshot(doc(db, "users", id), (responseDoc) => {
          //console.log("from firestore > responseDoc: ", responseDoc);
          //console.log("from firestore > responseDoc.data: ", responseDoc.data());
          //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
          const user = { ...responseDoc.data(), id: responseDoc.id };
          console.log("from firestore > user:", user);
          commit("setUser", { user });
          dispatch("fetchSomething");
          resolve(user);
        });
      });
    },
    updateUser({ commit }, user) {
      commit("setUser", { user });
    },
    //posts
    fetchPost({ commit, dispatch }, { id }) {
      dispatch("fetchSomething");
      console.log(`🚨fetching a post (ID: ${id}) on firebase 🚨`);
      return new Promise((resolve) => {
        onSnapshot(doc(db, "posts", id), (responseDoc) => {
          //console.log("from firestore > responseDoc: ", responseDoc);
          //console.log("from firestore > responseDoc.data: ", responseDoc.data());
          //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
          const post = { ...responseDoc.data(), id: responseDoc.id };
          console.log("from firestore > post:", post);
          commit("setPost", { post });
          dispatch("fetchSomething");
          resolve(post);
        });
      });
    },
    createPost({ commit, getters }, post) {
      post.id = post.id ?? createId();
      post.publishedAt = nowTimeStamp;
      post.userId = getters.authUser.id;
      commit("setPost", { post });
      commit("appendPostToThread", {
        childId: post.id,
        parentId: post.threadId,
      });
      commit("appendContributorToThread", {
        childId: getters.authUser.id,
        parentId: post.threadId,
      });

      return post;
    },
    updatePost({ commit, getters }, { id, body }) {
      //console.log("updatePost > id ", id);

      const post = getters.getPostById(id);
      //console.log("updatePost > post ", post);
      const updatedPost = { ...post, text: body };
      //console.log("updatePost > updatedPost ", updatedPost);
      commit("setPost", { post: updatedPost });
    },
    //threads
    fetchThread({ commit, dispatch }, { id }) {
      dispatch("fetchSomething");
      console.log(`🚨fetching a thread (ID: ${id}) on firebase 🚨`);
      return new Promise((resolve) => {
        onSnapshot(doc(db, "threads", id), (responseDoc) => {
          //console.log("from firestore > responseDoc: ", responseDoc);
          //console.log("from firestore > responseDoc.data: ", responseDoc.data());
          //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
          const thread = { ...responseDoc.data(), id: responseDoc.id };
          console.log("from firestore > thread:", thread);
          commit("setThread", { thread });
          dispatch("fetchSomething");
          resolve(thread);
        });
      });
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
      commit("setThread", { thread });
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

      commit("setThread", { thread: updatedThread });
      dispatch("updatePost", { id: updatedThread.posts[0], body });
      return thread;
    },
  },
  mutations: {
    setFetching(state) {
      state.fetching = !state.fetching;
    },
    //users
    setUser(state, { user }) {
      setResource(state.users, user);
    },
    appendThreadToUser: appendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),

    //forums
    appendThreadToForum: appendChildToParentMutation({
      parent: "forums",
      child: "threads",
    }),

    //posts
    setPost(state, { post }) {
      setResource(state.posts, post);
    },
    appendPostToThread: appendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),

    //threads
    setThread(state, { thread }) {
      setResource(state.threads, thread);
    },
    appendContributorToThread: appendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),
  },
});
