const setResource = (resources, resource) => {
  const index = resources.findIndex((element) => element.id === resource.id);
  console.log("resource", resource);
  if (resource.id && index !== -1) {
    resources[index] = resource;
  } else {
    resources.push(resource);
  }
};

export default function useArrayUpdateHelper() {
  return {
    setResource,
  };
}
