import useArraySearchHelper from "@/helpers/arraySearchHelper";
const { findById } = useArraySearchHelper();

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
  notifyAppIsReady({ commit }) {
    //console.log("fetching is", state.fetching);
    commit("setAppIsReady", { ready: true });
    //console.log("fetching became", state.fetching);
  },
  resetAppIsReady({ commit }) {
    commit("setAppIsReady", { ready: false });
  },

  async runAndResetFirestoreUnsubs({ state, commit }) {
    state.firestoreUnsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("resetFirestoreUnsubs");
  },
  fetchItem({ state, commit }, { source, id, handleUnsubscribe = null }) {
    console.log("global > actions > fetchItem > source", source);
    const item = findById(state[source], id);
    if (item) {
      console.log(`🍍 found item in store (source: ${source}, id: ${id}) 🍍`);
      return new Promise((resolve) => {
        resolve(item);
      });
    }

    return new Promise((resolve) => {
      console.log(
        `🚨 fetching a item (source: ${source}, id: ${id}) on firebase 🚨`
      );
      // console.log(`🚨 fetching a item on firebase 🚨`);
      const unsubscribe = onSnapshot(doc(db, source, id), (responseDoc) => {
        //console.log("from firestore > responseDoc: ", responseDoc);
        //console.log("from firestore > responseDoc.data: ", responseDoc.data());
        //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
        if (responseDoc.data() === undefined) {
          resolve(null);
        }
        const item = { ...responseDoc.data(), id: responseDoc.id };
        // console.log(`got from firestore > in ${source}:`, item);
        // console.log(`got item from firestore`);
        commit("setItem", { source, item });
        resolve(item);
      });
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe);
      } else {
        commit("appendUnsubscribe", { unsubscribe });
      }
    });
  },
  fetchItems({ dispatch }, { source, ids }) {
    const fetchs = ids.map((id) => dispatch("fetchItem", { source, id }));
    return Promise.all(fetchs);
  },
  async fetchItemsByProp(
    { commit },
    { collectionName, whereProp, whereValue }
  ) {
    const queryObj = query(
      collection(db, collectionName),
      where(whereProp, "==", whereValue)
    );
    const posts = await getDocs(queryObj);
    posts.forEach((post) => {
      commit("setItem", {
        source: collectionName,
        item: { ...post.data(), id: post.id },
      });
    });
  },

  //users

  //categories

  //forums

  //threads

  //posts
};
