import Identifier from '@/types/UniqueEntity';

const findById = (resources: Identifier[], id: string) => {
  //console.log(resources);
  const match = resources.find((element) => element.id === id);
  //console.log(match);
  return match;
};

const findManyById = (resources: Identifier[], id: string) => {
  return resources.filter((element) => element.id === id);
};

export default function useArraySearchHelper() {
  return {
    findById,
    findManyById,
  };
}
