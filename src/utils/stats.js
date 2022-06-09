export const max = (array) => array.length && array.reduce((a, b) => a > b ? a : b);

export const mean = (array) => array.length && array.reduce((a, b) => a + b) / (array.length);

export const min = (array) => array.length && array.reduce((a, b) => a < b ? a : b);

export const mode = (array) => array.length && array.sort((a, b) =>
  array.filter(v => v === a).length - array.filter(v => v === b).length).pop();

export const frequency = (array, index) => {
  let hash = {};
  for (let i of array) {
    if (!hash[i]) hash[i] = 0;
    hash[i]++;
  }
  const hashToArray = Object.entries(hash);
  const sortedArray = hashToArray.sort((a, b) => a[1] > b[1] ? -1 : 1);
  return sortedArray;
}