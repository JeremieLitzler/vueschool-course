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
  query,
  where,
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
  initAuthentification({ state, commit, dispatch }) {
    if (state.authUserObserverUnsubscribe) {
      state.authUserObserverUnsubscribe();
      commit("setAuthUserObserverUnsubscribe", { unsubscribe: null });
    }
    return new Promise((resolve) => {
      const unsubscribe = firebaseService().auth.onAuthStateChanged(
        async (user) => {
          console.log(
            "actions > initAuthentification > onAuthStateChanged running"
          );
          dispatch("runUnsubscribeAuthUser");
          if (user) {
            await dispatch("fetchAuthUser");
          }
          dispatch("notifyAppIsReady");
          resolve(user);
        }
      );
      commit("setAuthUserObserverUnsubscribe", { unsubscribe });
    });
  },
  async runAndResetFirestoreUnsubs({ state, commit }) {
    state.firestoreUnsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("resetFirestoreUnsubs");
  },
  async runUnsubscribeAuthUser({ state, commit }) {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe();
      commit("setAuthUserUnsubscribe", null);
    }
  },
  fetchItem({ state, commit }, { source, id, handleUnsubscribe = null }) {
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
  //users
  async fetchAuthUser({ commit, dispatch }) {
    const userId = firebaseService().getAuthUserId();
    //console.log("fetchAuthUser > getAuthUserId returned ", userId);
    if (userId === undefined) {
      return new Promise((resolve) => resolve({}));
    }
    const user = await dispatch("fetchItem", {
      source: "users",
      id: userId,
      handleUnsubscribe: (unsubscribe) => {
        commit("setAuthUserUnsubscribe", unsubscribe);
      },
    });

    commit("setAuthId", { authId: userId });
    return user;
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
        source: "posts",
        item: { ...post.data(), id: post.id },
      });
    });
  },
  async fetchUser({ dispatch }, { id }) {
    console.log("fetchUser > id ", id);
    const user = await dispatch("fetchItem", { source: "users", id });
    console.log("fetchUser > user ", user);
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
  async loginWithGoogle({ dispatch, commit }) {
    const user = await firebaseService().signinWithGoogle();
    console.log("actions > loginWithGoogle > user", user);
    if (!user.exists) {
      dispatch("createUser", { ...user });
      commit("setAuthId", { authId: user.id });
    }
  },
  loginUserWithEmailAndPassword(context, { email, password }) {
    return firebaseService().loginUserWithEmailAndPassword({ email, password });
  },
  async logoutUser({ commit }) {
    firebaseService().signOut();
    console.log("Called firebaseService().signOut()");
    commit("setAuthId", { authId: null });
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
    // console.log("fetchThread > id", id);
    return dispatch("fetchItem", { source: "threads", id });
  },
  fetchThreads({ dispatch }, { ids }) {
    //console.log(`fetchItem > getting`, ids);
    return dispatch("fetchItems", { source: "threads", ids });
  },
  async createThread({ commit, dispatch, getters }, { title, body, forumId }) {
    //console.log("threadId", id);
    if (!getters.authUser.id) {
      return new Promise((reject) => reject("You're not logged in"));
    }
    const thread = {
      forumId: forumId,
      publishedAt: firebaseService().getServerTimeStamp(),
      title: title,
      userId: getters.authUser.id,
    };

    const threadRef = doc(collection(db, "threads"));
    const forumRef = doc(db, "forums", thread.forumId);
    const userRef = doc(db, "users", getters.authUser.id);
    const batch = writeBatch(db);
    batch.set(threadRef, thread);
    batch.update(forumRef, {
      threads: arrayUnion(threadRef.id),
    });
    batch.update(userRef, {
      threads: arrayUnion(threadRef.id),
    });
    await batch.commit();

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
