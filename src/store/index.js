import { createStore } from "vuex";
import getters from "@/store/getters";
import actions from "@/store/actions";
import mutations from "@/store/mutations";

export default createStore({
  state: {
    users: [],
    categories: [],
    calledFetchAllCategories: false,
    forums: [],
    threads: [],
    posts: [],
    authId: null,
    appIsReady: false,
    firestoreUnsubscribes: [],
    authUserUnsubscribe: null,
    authUserObserverUnsubscribe: null,
  },
  getters,
  actions,
  mutations,
});
