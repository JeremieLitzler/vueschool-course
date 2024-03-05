import useArraySearchHelper from "@/helpers/arraySearchHelper";

const { findById } = useArraySearchHelper();

export default function useAppendChildToParentMutationHelper() {
  const appendChildToParentMutation = ({ child }) => {
    return (state, { childId, parentId }) => {
      //console.log(`appendChildToParentMutation > state`, state);
      //console.log(`appendChildToParentMutation > with parent = ${parent} and child = ${child}`);
      //console.log(`appendChildToParentMutation > with parentId = ${parentId} and childId = ${childId}`);
      const resource = findById(state.items, parentId);
      //console.log(`appendChildToParentMutation > resource`, resource);
      resource[child] = resource[child] || [];
      if (!resource[child].includes(childId)) {
        resource[child].push(childId);
      }
    };
  };
  return { appendChildToParentMutation };
}
