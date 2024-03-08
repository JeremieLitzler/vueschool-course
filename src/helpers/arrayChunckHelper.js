/**
 * @see https://stackoverflow.com/a/37826698
 */
const chunckIt = (chunckSize) => (inputArray) =>
  inputArray.reduce(
    (resultArray, item) => {
      if (resultArray[resultArray.length - 1].length < chunckSize) {
        resultArray[resultArray.length - 1].push(item);
      } else {
        resultArray.push([item]);
      }

      return resultArray;
    },
    [[]]
  );

export default function useArrayChunckHelper() {
  return {
    chunckIt,
  };
}
