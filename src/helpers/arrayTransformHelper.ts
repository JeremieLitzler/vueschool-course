const makeDistinct = <T>(source: T[]) => {
  return [...new Set(source)];
};

export default function userArrayTransformHelper() {
  return {
    makeDistinct,
  };
}
