import useArraySearchHelper from "@/helpers/arraySearchHelper";
import useFirebaseHelper from "@/helpers/firebaseHelper";

const { findById } = useArraySearchHelper();

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import {
  getFirestore,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  collection,
  writeBatch,
  arrayUnion,
  increment,
} from "firebase/firestore";

import firebaseService from "@/services/firebaseService";
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
  fetchItem({ state, commit }, { source, id }) {
    const item = findById(state[source], id);
    if (item) {
      // console.log(`🍍 found item in store (source: ${source}, id: ${id}) 🍍`);
      return new Promise((resolve) => {
        resolve(item);
      });
    }

    return new Promise((resolve) => {
      //console.log(`🚨 fetching a item (source: ${source}, id: ${id}) on firebase 🚨`);
      // console.log(`🚨 fetching a item on firebase 🚨`);
      const unsubscribe = onSnapshot(doc(db, source, id), (responseDoc) => {
        //console.log("from firestore > responseDoc: ", responseDoc);
        //console.log("from firestore > responseDoc.data: ", responseDoc.data());
        //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
        const item = { ...responseDoc.data(), id: responseDoc.id };
        //console.log(`got from firestore > in ${source}:`, item);
        // console.log(`got item from firestore`);
        commit("setItem", { source, item });
        resolve(item);
      });
      commit("appendUnsubscribe", { unsubscribe });
    });
  },
  fetchItems({ dispatch }, { source, ids }) {
    const fetchs = ids.map((id) => dispatch("fetchItem", { source, id }));
    return Promise.all(fetchs);
  },
  //users
  async fetchAuthUser({ commit, dispatch }) {
    const userId = firebaseService().getAuthUserId();
    if (userId === undefined) {
      return new Promise((resolve) => resolve({}));
    }
    const user = await dispatch("fetchUser", { id: userId });
    commit("setAuthId", { authId: userId });
    return user;
  },
  async fetchUser({ dispatch }, { id }) {
    const user = await dispatch("fetchItem", { source: "users", id });
    //console.log("fetchUser > id ", user, id);
    return user;
  },
  fetchUsers({ dispatch }, { ids }) {
    return dispatch("fetchItems", { source: "users", ids });
  },
  async registerUserWithEmailAndPassword(
    { dispatch },
    { name, username, email, password, avatar }
  ) {
    email = email.toLowerCase();
    const registerResult = await firebaseService().registerUser({
      email,
      password,
    });
    console.log("actions > registerUserWithEmailAndPassword", registerResult);
    const user = await dispatch("createUser", {
      name,
      username,
      email,
      avatar,
      id: registerResult.user.uid,
    });
    // dispatch("fetchAuthUser");
    return user;
  },
  async createUser({ commit }, { id, name, username, email, avatar }) {
    const newUser = {
      id,
      name,
      username,
      email,
      avatar,
      bio: "",
      postsCount: 0,
      registeredAt: firebaseService().getServerTimeStamp(),
      threads: [],
      usernameLower: username.toLowerCase(),
    };

    console.log("actions > createUser > id", id);
    const userRef = doc(db, "users", id);
    await writeBatch(db)
      .set(userRef, { ...newUser })
      .commit();

    const newUserDoc = useFirebaseHelper().docToResource(await getDoc(userRef));

    commit("setItem", { source: "users", item: newUserDoc });
    return newUserDoc;
  },
  updateUser({ commit }, user) {
    commit("setItem", { source: "users", item: user });
  },
  //categories
  fetchCategory({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "categories", id });
  },
  fetchAllCategories({ state, commit }) {
    if (state.categories.length > 0 && state.calledFetchAllCategories) {
      console.log(`🍍 found categories in store 🍍`);
      return new Promise((resolve) => {
        resolve(state.categories);
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
          commit("setItem", { source: "categories", item: category });
          return category;
        });
        //console.log(`got from firestore > in ${collectionName}:`, categories);

        commit("setCalledFetchAllCategories");
        resolve(categories);
      });
    });
  },
  //forums
  fetchForums({ dispatch }, { ids }) {
    return dispatch("fetchItems", { source: "forums", ids });
  },
  fetchForum({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "forums", id });
  },
  //threads
  fetchThread({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "threads", id });
  },
  fetchThreads({ dispatch }, { ids }) {
    //console.log(`fetchItem > getting`, ids);
    return dispatch("fetchItems", { source: "threads", ids });
  },
  async createThread({ commit, dispatch, getters }, { title, body, forumId }) {
    //console.log("threadId", id);
    const thread = {
      forumId: forumId,
      publishedAt: firebaseService().getServerTimeStamp(),
      title: title,
      userId: getters.authUser.id,
    };

    const threadRef = doc(collection(db, "threads"));
    const forumRef = doc(db, "forums", thread.forumId);
    const userRef = doc(db, "users", getters.authUser.id);
    await writeBatch(db)
      .set(threadRef, thread)
      .update(forumRef, {
        threads: arrayUnion(threadRef.id),
      })
      .update(userRef, {
        threads: arrayUnion(threadRef.id),
      })
      .commit();

    const newThread = await getDoc(threadRef);

    commit("setItem", {
      source: "threads",
      item: { ...newThread.data(), id: threadRef.id },
    });
    commit("appendThreadToForum", { childId: threadRef.id, parentId: forumId });
    commit("appendThreadToUser", {
      childId: threadRef.id,
      parentId: getters.authUser.id,
    });
    await dispatch("createPost", { threadId: threadRef.id, text: body });
    return threadRef.id;
  },
  async updateThread({ commit, getters }, { title, body, id }) {
    //console.log("updatedThread > id ", id);
    const thread = getters.threadById(id);
    //console.log("updateThread > thread", thread);
    const threadRef = doc(db, "threads", thread.id);
    const postRef = doc(db, "posts", thread.posts[0]);
    await writeBatch(db)
      .set(threadRef, thread)
      .update(threadRef, {
        title,
      })
      .update(postRef, {
        text: body,
      })
      .commit();

    const newThread = useFirebaseHelper().docToResource(
      await getDoc(threadRef)
    );
    const newPost = useFirebaseHelper().docToResource(await getDoc(postRef));

    commit("setItem", {
      source: "threads",
      item: newThread,
    });
    commit("setItem", {
      source: "posts",
      item: newPost,
    });

    return newThread;
  },
  //posts
  fetchPost({ dispatch }, { id }) {
    return dispatch("fetchItem", { source: "posts", id });
  },
  fetchPosts({ dispatch }, { ids }) {
    return dispatch("fetchItems", { source: "posts", ids });
  },
  async createPost({ state, commit, getters }, post) {
    //console.log("'createPost > post", post);
    post.publishedAt = firebaseService().getServerTimeStamp();
    //console.log("createPost > post.publishedAt", post.publishedAt);
    post.userId = getters.authUser.id;

    const postRef = doc(collection(db, "posts"));
    const threadRef = doc(db, "threads", post.threadId);
    const userRef = doc(db, "users", post.userId);
    await writeBatch(db)
      .set(postRef, post)
      .update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(state.authId),
      })
      .update(userRef, {
        postsCount: increment(1),
      })
      .commit();

    const newPost = await getDoc(postRef);
    commit("setItem", {
      source: "posts",
      item: { ...newPost.data(), id: postRef.id },
    });
    commit("appendPostToThread", {
      childId: postRef.id,
      parentId: post.threadId,
    });
    commit("appendContributorToThread", {
      childId: state.authId,
      parentId: post.threadId,
    });

    return post;
  },
  async updatePost({ commit }, { id, text }) {
    const postRef = doc(db, "posts", id);
    await writeBatch(db)
      .update(postRef, {
        text,
      })
      .commit();

    const updatedPost = useFirebaseHelper().docToResource(
      await getDoc(postRef)
    );
    //console.log("updatePost > updatedPost ", updatedPost);
    commit("setItem", { source: "posts", item: updatedPost });
  },
};
