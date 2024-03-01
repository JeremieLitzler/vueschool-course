export default function objectHelper() {
  const instanceOf = <T>(object: any, prop: string): object is T => {
    return prop in object;
  };

  return {
    instanceOf,
  };
}
