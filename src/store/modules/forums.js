import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById } = useArraySearchHelper();

export default {
  namespaced: true,
  state: { items: [] },
  getters: {
    getForumById: (state) => (forumId) => findById(state.items, forumId),
  },
  actions: {
    fetchForums({ dispatch }, { ids }) {
      return dispatch("fetchItems", { source: "forums", ids }, { root: true });
    },
    fetchForum({ dispatch }, { id }) {
      return dispatch("fetchItem", { source: "forums", id }, { root: true });
    },
  },
  mutations: {},
};
