import { createStore } from "vuex";
import sourceData from "@/data.json";
import useUUID from "@/helpers/uniqueIdHelper";
import useDateHelper from "@/helpers/dateHelper";
import useArraySearchHelper from "@/helpers/arraySearchHelper";
import useArrayUpdateHelper from "@/helpers/arrayUpdateHelper";

const { createId } = useUUID();
const { nowTimeStamp } = useDateHelper();
const { findById, findManyById, findManyByProp } = useArraySearchHelper();
const { setResource } = useArrayUpdateHelper();

const appendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);
    resource[child] = resource[child] || [];
    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
};

export default createStore({
  state: { ...sourceData, authId: "7uVPJS9GHoftN58Z2MXCYDqmNAh2" },
  getters: {
    //users
    authUser: (state) => findById(state.users, state.authId),
    getUser: (state) => (userId) => findById(state.users, userId),
    //forums
    getForumById: (state) => (forumId) => findById(state.forums, forumId),
    getThreadsByForumId: (state, getters) => (forumId) => {
      return findManyByProp(state.threads, "forumId", forumId).map((thread) =>
        getters.hydrateThread(thread, getters)
      );
    },
    //posts
    getPostById: (state) => (id) => findById(state.posts, id),
    postsByUserId: (state) => (userId) => findManyById(state.posts, userId),
    getThreadFirstPostBody: (state) => (thread) =>
      findById(state.posts, thread.posts[0]),
    //threads
    threadById: (state, getters) => (id) => {
      const thread = findById(state.threads, id);
      return getters.hydrateThread(thread, getters);
    },
    threadsByUserId: (state) => (userId) => findManyById(state.threads, userId),
    hydrateThread: () => (thread, getters) => {
      return {
        ...thread,
        get author() {
          return getters.getUser(thread.userId).name;
        },
        get repliesCount() {
          return thread.posts.length - 1; //the first post isn't counted hence the '-1'
        },
        get contributorsCount() {
          return [...new Set(thread.contributors)].length;
        },
      };
    },
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
    //users
    setUser(state, { updatedUser }) {
      const userIndex = state.users.findIndex(
        (user) => user.id === updatedUser.id
      );
      state.users[userIndex] = updatedUser;
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
