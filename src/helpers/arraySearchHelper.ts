import WithId from '@/types/WithId';

const findById = <T extends WithId>(resources: T[], id: string) => {
  //console.log(resources);
  const match = resources.find((element) => element.id === id);
  //console.log(match);
  return match;
};

const findManyById = <T extends WithId>(resources: T[], id: string) => {
  return resources.filter((element) => element.id === id);
};

export default function arraySearchHelper() {
  return {
    findById,
    findManyById,
  };
}
