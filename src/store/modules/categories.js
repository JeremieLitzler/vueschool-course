import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
  namespaced: true,
  state: { items: [], calledFetchAllCategories: false },
  getters: { getCategories: (state) => state.items },
  actions: {
    fetchCategory({ dispatch }, { id }) {
      return dispatch(
        "fetchItem",
        { source: "categories", id },
        { root: true }
      );
    },
    fetchAllCategories({ state, commit }) {
      if (state.items.length > 0 && state.calledFetchAllCategories) {
        console.log(`🍍 found categories in store 🍍`);
        return new Promise((resolve) => {
          resolve(state.items);
        });
      }
      //console.log(`🚨 fetching categories from firestore 🚨`);
      return new Promise((resolve) => {
        const collectionName = "categories";
        getDocs(collection(db, collectionName)).then((querySnapshot) => {
          //console.log("from firestore > querySnapshot: ", querySnapshot);
          // console.log("from firestore > querySnapshot.docs: ", querySnapshot.docs);
          const categories = querySnapshot.docs.map((doc) => {
            //console.log("from firestore > doc: ", doc.id, doc.data());
            const category = { id: doc.id, ...doc.data() };
            //console.log("category created: ", category);
            commit(
              "setItem",
              { source: "categories", item: category },
              { root: true }
            );
            return category;
          });
          //console.log(`got from firestore > in ${collectionName}:`, categories);

          commit("setCalledFetchAllCategories");
          resolve(categories);
        });
      });
    },
  },
  mutations: {
    setCalledFetchAllCategories(state) {
      state.calledFetchAllCategories = true;
    },
  },
};
