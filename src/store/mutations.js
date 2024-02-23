import useArraySearchHelper from "@/helpers/arraySearchHelper";
import useArrayUpdateHelper from "@/helpers/arrayUpdateHelper";

const { findById } = useArraySearchHelper();
const { setResource } = useArrayUpdateHelper();

const appendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);
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
    setResource(state[source], item);
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
