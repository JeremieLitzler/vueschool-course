import { createStore } from "vuex";
import getters from "@/store/getters";
import actions from "@/store/actions";
import mutations from "@/store/mutations";

export default createStore({
  state: {
    users: [],
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    authId: "7uVPJS9GHoftN58Z2MXCYDqmNAh2",
    fetching: false,
    firestoreUnsubscribes: [],
  },
  getters,
  actions,
  mutations,
});
