import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById } = useArraySearchHelper();

import useMakeFetchActions from "@/helpers/makeFetchActionsHelper";
const { makeFetchItemAction, makeFetchItemsAction } = useMakeFetchActions();

export default {
  namespaced: true,
  state: { items: [] },
  getters: {
    getForumById: (state) => (forumId) => findById(state.items, forumId),
  },
  actions: {
    fetchForum: makeFetchItemAction({ source: "forums" }),
    fetchForums: makeFetchItemsAction({ source: "forums" }),
  },
  mutations: {},
};
