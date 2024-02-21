const findById = (resources, id) => {
  return resources.find((element) => element.id === id);
};

const findManyById = (resources, id) => {
  return resources.filter((element) => element.id === id);
};
export default function useArraySearchHelper() {
  return {
    findById,
    findManyById,
  };
}
