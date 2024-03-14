/**
 * @see https://stackoverflow.com/a/37826698
 */
const chunckIt =
  <T>(chunckSize: number) =>
  (inputArray: T[]) => {
    const initialValue: T[][] = [[]];
    if (inputArray.length === 0) {
      return initialValue;
    }
    return inputArray.reduce((resultArray, item) => {
      if (resultArray[resultArray.length - 1].length < chunckSize) {
        resultArray[resultArray.length - 1].push(item as T);
      } else {
        resultArray.push([item as T]);
      }

      return resultArray;
    }, initialValue);
  };

export default function useArrayChunckHelper() {
  return {
    chunckIt,
  };
}
