const pick = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export default function arrayRandomHelper() {
  return {
    pick,
  };
}
