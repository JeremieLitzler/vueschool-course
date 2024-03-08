import { createStore } from "vuex";
import getters from "@/store/getters";
import actions from "@/store/actions";
import mutations from "@/store/mutations";

import categories from "@/store/modules/categories";
import forums from "@/store/modules/forums";
import threads from "@/store/modules/threads";
import posts from "@/store/modules/posts";
import users from "@/store/modules/users";
import auth from "@/store/modules/auth";

export default createStore({
  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth,
  },
  state: {
    appIsReady: false,
    asyncUiParts: {},
    firestoreUnsubscribes: [],
    maxItemsPerFetch: 5,
  },
  getters,
  actions,
  mutations,
});
