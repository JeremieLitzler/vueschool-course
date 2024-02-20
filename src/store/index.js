import { createStore } from "vuex";
import sourceData from "@/data.json";

export default createStore({
  state: { ...sourceData, authId: "7uVPJS9GHoftN58Z2MXCYDqmNAh2" },
  getters: {
    authUser: (state) => state.users.find((user) => user.id === state.authId),
    getUser: (state) => (userId) =>
      state.users.find((user) => user.id === userId),
    postsByUserId: (state) => (userId) =>
      state.posts.filter((post) => post.userId === userId),
    threadsByUserId: (state) => (userId) =>
      state.threads.filter((thread) => thread.userId === userId),
  },
  actions: {
    createPost({ commit, getters }, post) {
      post.id = "gggg" + Math.random();
      post.publishedAt = Math.floor(Date.now() / 1000);
      post.userId = getters.authUser.id;
      commit("setPost", { post });
      commit("appendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      });
    },
    updateUser({ commit }, user) {
      commit("setUser", { updatedUser: user });
    },
    createThred({ commit }, thread) {
      commit("setThread", thread);
    },
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts.push(postId);
    },
    setUser(state, { updatedUser }) {
      const userIndex = state.users.findIndex(
        (user) => user.id === updatedUser.id
      );
      state.users[userIndex] = updatedUser;
    },
    setThread(state, { thread }) {
      state.threads.push(thread);
    },
  },
});
