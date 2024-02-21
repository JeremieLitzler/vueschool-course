import { createStore } from "vuex";
import sourceData from "@/data.json";
import useUUID from "@/helpers/uniqueIdHelper";
import useDateHelper from "@/helpers/dateHelper";
import useArraySearchHelper from "@/helpers/arraySearchHelper";
import useArrayUpdateHelper from "@/helpers/arrayUpdateHelper";

const { createId } = useUUID();
const { nowTimeStamp } = useDateHelper();
const { findById, findManyById } = useArraySearchHelper();
const { setResource } = useArrayUpdateHelper();

export default createStore({
  state: { ...sourceData, authId: "7uVPJS9GHoftN58Z2MXCYDqmNAh2" },
  getters: {
    //users
    authUser: (state) => findById(state.users, state.authId),
    getUser: (state) => (userId) => findById(state.users, userId),
    //forums
    getForumById: (state) => (forumId) => findById(state.forums, forumId),
    //posts
    getPostById: (state) => (id) => findById(state.posts, id),
    postsByUserId: (state) => (userId) => findManyById(state.posts, userId),
    getThreadFirstPostBody: (state) => (thread) =>
      findById(state.posts, thread.posts[0]),
    //threads
    threadById: (state) => (id) => findById(state.threads, id),
    threadsByUserId: (state) => (userId) => findManyById(state.threads, userId),
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
      setResource(state.posts, post);
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts = thread.posts || [];
      thread.posts.push(postId);
    },

    //threads
    setThread(state, { thread }) {
      setResource(state.threads, thread);
    },
  },
});
