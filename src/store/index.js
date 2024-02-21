import { createStore } from "vuex";
import sourceData from "@/data.json";
import useUUID from "@/composables/useUUID";
import useDateHelper from "@/composables/useDateHelper";
const { createId } = useUUID();
const { nowTimeStamp } = useDateHelper();

export default createStore({
  state: { ...sourceData, authId: "7uVPJS9GHoftN58Z2MXCYDqmNAh2" },
  getters: {
    //users
    authUser: (state) => state.users.find((user) => user.id === state.authId),
    getUser: (state) => (userId) =>
      state.users.find((user) => user.id === userId),
    //forums
    getForumById: (state) => (forumId) =>
      state.forums.find((forum) => forum.id === forumId),
    //posts
    getPostById: (state) => (id) => state.posts.find((post) => post.id === id),
    postsByUserId: (state) => (userId) =>
      state.posts.filter((post) => post.userId === userId),
    getThreadFirstPostBody: (state) => (thread) => {
      const match = state.posts.find((post) => post.id === thread.posts[0]);
      return match;
    },
    //threads
    threadById: (state) => (id) =>
      state.threads.find((thread) => thread.id === id),
    threadsByUserId: (state) => (userId) =>
      state.threads.filter((thread) => thread.userId === userId),
  },
  actions: {
    //users
    updateUser({ commit }, user) {
      commit("setUser", { updatedUser: user });
    },
    //posts
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
    updatePost({ commit, getters }, { id, body }) {
      console.log("updatePost > id ", id);

      const post = getters.getPostById(id);
      console.log("updatePost > post ", post);
      const updatedPost = { ...post, text: body };
      console.log("updatePost > updatedPost ", updatedPost);
      commit("setPost", { post: updatedPost });
    },
    //threads
    createThread({ commit, dispatch, getters }, { title, body, forumId }) {
      const id = createId();
      const postId = createId();

      console.log("threadId", id);
      const thread = {
        forumId: forumId,
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
    //users
    setUser(state, { updatedUser }) {
      const userIndex = state.users.findIndex(
        (user) => user.id === updatedUser.id
      );
      state.users[userIndex] = updatedUser;
    },
    appendThreadToUser(state, { threadId, userId }) {
      const user = state.users.find((user) => user.id === userId);
      user.threads = user.threads || [];
      user.threads.push(threadId);
    },

    //forums
    appendThreadToForum(state, { threadId, forumId }) {
      const forum = state.forums.find((forum) => forum.id === forumId);
      forum.threads = forum.threads || [];
      forum.threads.push(threadId);
    },

    //posts
    setPost(state, { post }) {
      const index = state.posts.findIndex((element) => element.id === post.id);
      if (post.id && index !== -1) {
        state.posts[index] = post;
      } else {
        state.posts.push(post);
      }
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts = thread.posts || [];
      thread.posts.push(postId);
    },

    //threads
    setThread(state, { thread }) {
      const index = state.threads.findIndex(
        (element) => element.id === thread.id
      );
      if (thread.id && index !== -1) {
        state.threads[index] = thread;
      } else {
        state.threads.push(thread);
      }
    },
  },
});
