const findById = (resources, id) => {
  if (!resources) return null;
  return resources.find((element) => element.id === id);
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
