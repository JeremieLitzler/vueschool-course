const setResource = (resources, resource) => {
  //console.log(`resources: ${resources} > ressource`, resource);
  const items = resources.items ?? resources;
  const index = items.findIndex((element) => element.id === resource.id);
  //console.log("resource", resource);
  if (resource.id && index !== -1) {
    items[index] = resource;
  } else {
    //console.log("arrayUpdateHelper > setResource > resource", resource);
    items.push(resource);
  }
};

export default function useArrayUpdateHelper() {
  return {
    setResource,
  };
}
