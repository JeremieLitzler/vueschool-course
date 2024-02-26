import useArraySearchHelper from "@/helpers/arraySearchHelper";
import useArrayUpdateHelper from "@/helpers/arrayUpdateHelper";

const { findById } = useArraySearchHelper();
const { setResource } = useArrayUpdateHelper();

const appendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    console.log(`appendChildToParentMutation > state`, state);
    console.log(
      `appendChildToParentMutation > with parent = ${parent} and child = ${child}`
    );
    console.log(
      `appendChildToParentMutation > with parentId = ${parentId} and childId = ${childId}`
    );
    const resource = findById(state[parent], parentId);
    console.log(`appendChildToParentMutation > resource`, resource);
    resource[child] = resource[child] || [];
    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
};
export default {
  setFetching(state) {
    state.fetching = !state.fetching;
  },
  setItem(state, { source, item }) {
    console.log("state + source", state, source);
    console.log("state[source]", state[source]);
    setResource(state[source], item);
    console.log(`set item in ${source}`, item);
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
  appendPostToThread: appendChildToParentMutation({
    parent: "threads",
    child: "posts",
  }),

  //threads
  appendContributorToThread: appendChildToParentMutation({
    parent: "threads",
    child: "contributors",
  }),
};
