export default function objectHelper() {
  const propExistsInObject = <T>(object: any, prop: string): object is T => {
    return prop in object;
  };

  return {
    propExistsInObject,
  };
}
