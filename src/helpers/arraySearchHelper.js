const findById = (resources, id) => {
  const items = resources.items ?? resources;
  //console.log("findById > items", items);
  if (!items) return null;
  return items.find((element) => element.id === id);
};

const findManyById = (resources, id) => {
  if (!resources) return null;
  return resources.filter((element) => element.id === id) || [];
};
const findManyByProp = (resources, prop, propValue) => {
  return resources.filter((element) => element[prop] === propValue) || [];
};
export default function useArraySearchHelper() {
  return {
    findById,
    findManyById,
    findManyByProp,
  };
}
