import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById, findManyByProp } = useArraySearchHelper();

export default {
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
