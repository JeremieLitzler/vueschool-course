import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById, findManyByProp } = useArraySearchHelper();

export default {
  isAppIsReady: (state) => state.appIsReady,
  //users
  getUser: (state, getters) => (userId) => {
    const user = findById(state.users, userId);
    //console.log("getUser > id", userId, user);
    return getters.hydrateUser(user);
  },
  authUser: (state, getters) => {
    return getters.getUser(state.authId);
  },
  hydrateUser: () => (user) => {
    const hydratedUser = {
      ...user,
      get postsCount() {
        return user.postsCount || 0;
      },
      get threadsCount() {
        return user.threads?.length || 0;
      },
    };
    // console.log("fetchUser > hydratedUser ", hydratedUser);
    return hydratedUser;
  },
  //categories
  getCategories: (state) => state.categories,
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
};
