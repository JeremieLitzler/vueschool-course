const makeFetchItemAction = ({ source }) => {
  //console.log(`calling makeFetchItemAction with ${source}`);
  return ({ dispatch }, payload) =>
    dispatch("fetchItem", { source, ...payload }, { root: true });
};

const makeFetchItemsAction = ({ source }) => {
  return ({ dispatch }, payload) =>
    dispatch("fetchItems", { source, ...payload }, { root: true });
};

/**
 * Provide a way to fecth an item or items and
 * have a generic 'payload' that can be extended
 * in the future thanks to the spread operator.
 *
 * @returns an object with the functions
 */
export default function useMakeFetchActions() {
  return {
    makeFetchItemAction,
    makeFetchItemsAction,
  };
}
