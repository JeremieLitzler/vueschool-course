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
  orderBy,
  limit,
  startAfter,
  getDoc,
  getCountFromServer,
} from "firebase/firestore";
import useArrayChunckHelper from "@/helpers/arrayChunckHelper";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
  notifyAppIsReady({ commit }, caller) {
    console.log("notifyAppIsReady by", caller);
    //console.log("fetching is", state.fetching);
    commit("setAppIsReady", { ready: true });
    //console.log("fetching became", state.fetching);
  },
  resetAppIsReady({ commit }) {
    commit("setAppIsReady", { ready: false });
  },
  notifyUiElementLoading({ commit }, uiElement) {
    //console.log("calling notifyUiElementLoading");
    commit("setAsyncUiPart", { uiElement, ready: false });
  },
  notifyUiElementReady({ commit }, uiElement) {
    //console.log("calling notifyUiElementReady");
    commit("setAsyncUiPart", { uiElement, ready: true });
  },
  resetUiPartsLoading({ commit }) {
    //console.log("calling resetUiPartsLoading");
    commit("emptyUiPartsLoading");
  },
  async runAndResetFirestoreUnsubs({ state, commit }) {
    state.firestoreUnsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("resetFirestoreUnsubs");
  },
  fetchItem(
    { state, commit },
    { source, id, handleUnsubscribe = null, once = false }
  ) {
    //console.log("global > actions > fetchItem > source", source);
    const item = findById(state[source], id);
    if (item) {
      //console.log(`🍍 found item in store (source: ${source}, id: ${id}) 🍍`);
      return new Promise((resolve) => {
        resolve(item);
      });
    }

    return new Promise((resolve) => {
      //console.log(`🚨 fetching a item (source: ${source}, id: ${id}) on firebase 🚨`);
      //console.log(`🚨 fetching a item on firebase 🚨`);
      const unsubscribe = onSnapshot(doc(db, source, id), (responseDoc) => {
        //console.log("from firestore > responseDoc: ", responseDoc);
        //console.log("from firestore > responseDoc.data: ", responseDoc.data());
        //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
        if (once) {
          unsubscribe();
          console.log("actions>fetchItem>once called");
        }
        if (!responseDoc.exists()) {
          resolve(null);
        }
        const item = { ...responseDoc.data(), id: responseDoc.id };
        ////console.log(`got from firestore > in ${source}:`, item);
        ////console.log(`got item from firestore`);
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
  fetchItemsByChunk({ dispatch }, { source, ids, chunckIndex, chunckSize }) {
    //console.log("actions < fetchItemsByChunk > source", source);
    //console.log("actions < fetchItemsByChunk > ids", ids);
    //console.log("actions < fetchItemsByChunk > chunckIndex", chunckIndex);
    const chuncks = useArrayChunckHelper().chunckIt(chunckSize)(ids);

    //console.log("actions < fetchItemsByChunk > chuncks", chuncks);
    //console.log("actions < fetchItemsByChunk > chunck", chuncks[chunckIndex]);
    return dispatch("fetchItems", { source, ids: chuncks[chunckIndex] });
  },
  async fetchItemsByProp(
    { state, commit },
    {
      collectionName,
      whereProp,
      whereValue,
      orderByProp,
      orderByDirection,
      maxElements = null,
      startAt = null,
    }
  ) {
    maxElements = maxElements ?? state.maxItemsPerFetch;
    console.log("fetchItemsByProp > maxElements", maxElements);
    const commonQueryParts = [
      collection(db, collectionName),
      where(whereProp, "==", whereValue),
      orderBy(orderByProp, orderByDirection),
      limit(maxElements),
    ];
    let queryObj = query(...commonQueryParts);
    if (startAt) {
      const postRef = doc(db, collectionName, startAt.id);
      const lastPost = await getDoc(postRef);
      queryObj = query(...commonQueryParts, startAfter(lastPost));
    }
    const items = await getDocs(queryObj);
    //console.log("fetchItemsByProp > items.length", items.docs);
    const itemsFetched = [];
    items.docs.forEach((itemDoc) => {
      const item = { ...itemDoc.data(), id: itemDoc.id };
      commit("setItem", {
        source: collectionName,
        item: itemDoc,
      });
      itemsFetched.push(item);
    });
    return { items: itemsFetched, amountFetched: items.docs?.length ?? 0 };
  },
  /**
   * Get the count of documents in a collection
   *
   * @see https://stackoverflow.com/questions/46554091/cloud-firestore-collection-count
   * @param {Object} Context The context
   * @param {String} collectionName The name of the collection to query
   * @returns Number
   */
  async entriesCount(context, collectionName) {
    console.log("actions > entriesCount > collectionName", collectionName);
    const dbEntries = collection(db, collectionName);
    const snapshot = await getCountFromServer(dbEntries);
    return snapshot.data().count;
  },
  //users

  //categories

  //forums

  //threads

  //posts
};
