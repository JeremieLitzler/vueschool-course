import Identifier from '@/types/UniqueEntity';

const setResource = <T>(resources: Identifier[], resourceGeneric: T) => {
  const resource = resourceGeneric as Identifier;
  const index = resources.findIndex((element) => element.id === resource.id);
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
