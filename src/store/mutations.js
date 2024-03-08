import useAppendChildToParentMutationHelper from "@/helpers/appendChildToParentMutationHelper";
import useArrayUpdateHelper from "@/helpers/arrayUpdateHelper";
import useFirebaseHelper from "@/helpers/firebaseHelper";
const { setResource } = useArrayUpdateHelper();

const { appendChildToParentMutation } = useAppendChildToParentMutationHelper();

export default {
  setAppIsReady(state, { ready }) {
    state.appIsReady = ready;
  },
  setItem(state, { source, item }) {
    //console.log("setItem > source", source);
    //console.log("setItem > item", item);
    //console.log("state[source]", state[source]);
    setResource(state[source].items, useFirebaseHelper().docToResource(item));
    //console.log(`set item in ${source}`, item);
  },
  setAsyncUiPart(state, { uiElement, ready }) {
    state.asyncUiParts[uiElement] = ready;
  },
  emptyUiPartsLoading(state) {
    state.asyncUiParts = {};
  },
  //users
  appendThreadToUser: appendChildToParentMutation({
    parent: "users",
    child: "threads",
  }),

  //forums
  appendThreadToForum: appendChildToParentMutation({
    parent: "forums",
    child: "threads",
  }),

  //posts

  //threads

  //common
  appendUnsubscribe(state, { unsubscribe }) {
    //console.log("calling appendUnsubscribe");
    state.firestoreUnsubscribes.push(unsubscribe);
    //console.log("called appendUnsubscribe");
  },
  resetFirestoreUnsubs(state) {
    state.firestoreUnsubscribes.splice(0, state.firestoreUnsubscribes.length);
    //console.log("called resetFirestoreUnsubs");
  },
};
