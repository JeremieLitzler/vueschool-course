import { createStore } from "vuex";
import sourceData from "@/data.json";

export default createStore({
  state: { ...sourceData, authId: "38St7Q8Zi2N1SPa5ahzssq9kbyp1" },
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
    createPost({ commit }, post) {
      post.id = "gggg" + Math.random();
      commit("setPost", { post });
      commit("appendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      });
    },
    updateUser({ commit }, user) {
      commit("setUser", { updatedUser: user });
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
  },
});
