import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import {
  getFirestore,
  doc,
  onSnapshot,
  getDoc,
  //   getDocs,
  collection,
  writeBatch,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default function firebaseService() {
  const auth = getAuth(firebaseApp);
  const getServerTimeStamp = () => {
    const value = serverTimestamp();
    //console.log("getServerTimeStamp", value);
    return value;
  };
  const fetchItem = ({ source, id, commit }) => {
    return new Promise((resolve) => {
      //console.log(`🚨 fetching a item (source: ${source}, id: ${id}) on firebase 🚨`);
      console.log(`🚨 fetching a item on firebase 🚨`);
      onSnapshot(doc(db, source, id), (responseDoc) => {
        //console.log("from firestore > responseDoc: ", responseDoc);
        //console.log("from firestore > responseDoc.data: ", responseDoc.data());
        //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
        const item = { ...responseDoc.data(), id: responseDoc.id };
        //console.log(`got from firestore > in ${source}:`, item);
        console.log(`got item from firestore`);
        commit("setItem", { source, item });
        resolve(item);
      });
    });
  };

  const addThread = async ({ thread }) => {
    const threadRef = doc(collection(db, "threads"));
    //console.log("addThread > forumId", thread.forumId);
    const forumRef = doc(db, "forums", thread.forumId);
    //console.log("addThread > forumRef", forumRef);
    await writeBatch(db)
      .set(threadRef, thread)
      .update(forumRef, {
        threads: arrayUnion(threadRef.id),
      })
      .commit();

    const newThread = await getDoc(threadRef);
    //console.log("addThread > newThread", newThread);
    return { id: threadRef.id, newThread: newThread.data() };
  };

  const addPost = async ({ post, userAuthId }) => {
    const postRef = doc(collection(db, "posts"));
    //console.log("addPost > threadId", post.threadId);
    const threadRef = doc(db, "threads", post.threadId);
    //console.log("addPost > threadRef", threadRef);

    await writeBatch(db)
      .set(postRef, post)
      .update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(userAuthId),
      })
      .commit();

    const newPost = await getDoc(postRef);
    //console.log("addPost > newPost", newPost);
    return { id: postRef.id, newPost: newPost.data() };
  };

  const updatedPost = async ({ id, post }) => {
    const postRef = doc(db, "posts", id);
    await writeBatch(db)
      .update(postRef, {
        ...post,
      })
      .commit();
  };

  const registerUser = async (user) => {
    try {
      const registerResult = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      console.log("User registered!", registerResult);
      return registerResult;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  const loginUserWithEmailAndPassword = ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((user) => user)
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);
    const user = response.user;
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    return {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      username: user.email,
      avatar: user.photoURL,
      exists: userDoc.exists(),
    };
  };
  const signOut = async () => {
    await auth.signOut();
    console.log("UserStore > signOut", auth.currentUser);
  };

  const getAuthUserId = () => {
    return auth.currentUser?.uid;
  };

  const getStorageBucket = (url) => {
    return ref(getStorage(firebaseApp), url);
  };
  const uploadToStorageBucket = async (bucketRef, imageBlob) => {
    return await uploadBytes(bucketRef, imageBlob);
  };
  const getImageURL = async (snapshotRef) => {
    const url = await getDownloadURL(snapshotRef);
    //console.log("firebaseService>getImageURL", url);
    return url;
  };

  return {
    auth,
    getServerTimeStamp,
    fetchItem,
    addThread,
    addPost,
    updatedPost,
    registerUser,
    loginUserWithEmailAndPassword,
    signinWithGoogle,
    signOut,
    getAuthUserId,
    getStorageBucket,
    uploadToStorageBucket,
    getImageURL,
  };
}
