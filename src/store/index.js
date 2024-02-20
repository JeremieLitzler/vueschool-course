import { createStore } from "vuex";
import sourceData from "@/data.json";
import useUUID from "@/composables/useUUID";
import useDateHelper from "@/composables/useDateHelper";
const { createId } = useUUID();
const { nowTimeStamp } = useDateHelper();

export default createStore({
  state: { ...sourceData, authId: "7uVPJS9GHoftN58Z2MXCYDqmNAh2" },
  getters: {
    authUser: (state) => state.users.find((user) => user.id === state.authId),
    getUser: (state) => (userId) =>
      state.users.find((user) => user.id === userId),
    getForumById: (state) => (forumId) =>
      state.forums.find((forum) => forum.id === forumId),
    postsByUserId: (state) => (userId) =>
      state.posts.filter((post) => post.userId === userId),
    threadsByUserId: (state) => (userId) =>
      state.threads.filter((thread) => thread.userId === userId),
  },
  actions: {
    createPost({ commit, getters }, post) {
      post.id = post.id ?? createId();
      post.publishedAt = nowTimeStamp;
      post.userId = getters.authUser.id;
      commit("setPost", { post });
      commit("appendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      });
      return post;
    },
    createThread({ commit, dispatch, getters }, { title, body, forumId }) {
      const id = createId();
      const postId = createId();

      console.log("threadId", id);
      const thread = {
        forumId: forumId,
        posts: [postId],
        publishedAt: nowTimeStamp,
        title: title,
        userId: getters.authUser.id,
        id,
      };
      commit("setThread", { thread });
      commit("appendThreadToForum", { threadId: id, forumId });
      commit("appendThreadToUser", {
        threadId: id,
        userId: getters.authUser.id,
      });
      dispatch("createPost", { threadId: id, postId, text: body });
      return id;
    },
    updateUser({ commit }, user) {
      commit("setUser", { updatedUser: user });
    },
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
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
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts = thread.posts || [];
      thread.posts.push(postId);
    },
    appendThreadToForum(state, { threadId, forumId }) {
      const forum = state.forums.find((forum) => forum.id === forumId);
      forum.threads = forum.threads || [];
      forum.threads.push(threadId);
    },
    appendThreadToUser(state, { threadId, userId }) {
      const user = state.users.find((user) => user.id === userId);
      user.threads = user.threads || [];
      user.threads.push(threadId);
    },
  },
});
