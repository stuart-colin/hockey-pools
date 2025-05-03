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

export const sumArrayIndex = (array, teamIndex, pointIndex) => {
  let hash = {};
  for (let i of array) {
    if (!hash[i[teamIndex]]) hash[i[teamIndex]] = 0;
    hash[i[teamIndex]] = hash[i[teamIndex]] + i[pointIndex];
  }
  const hashToArray = Object.entries(hash);
  const sortedArray = hashToArray.sort((a, b) => a[0] > b[0] ? 1 : -1);
  return sortedArray;
}

export const sumNestedArray = (array, index) => {
  let sum = 0;
  for (let i of array) {
    sum = i[index] + sum;
  }
  return sum;
}

// Example of a non-mutating customSort in src/utils/stats.js
export const customSort = (array, key) => {
  // Basic validation
  if (!Array.isArray(array)) {
    console.error("customSort expects an array.");
    return [];
  }
  if (!array.length) {
    return []; // Return empty if array is empty
  }
  // Check if key exists on the first element (basic check)
  // You might want more robust checking depending on your data
  if (key && typeof array[0][key] === 'undefined') {
    console.warn(`customSort: Key "${key}" not found on array elements.`);
    // Decide how to handle: return original, empty, or sort differently
    return [...array]; // Return a copy of the original for now
  }


  // Create a shallow copy using spread syntax BEFORE sorting
  return [...array].sort((a, b) => {
    const valA = key ? a[key] : a; // Handle sorting array of primitives if key is null/undefined
    const valB = key ? b[key] : b;

    // Basic descending sort for numbers, adjust as needed for strings etc.
    if (typeof valA === 'number' && typeof valB === 'number') {
      return valB - valA; // Descending for numbers
    }
    // Add logic here for string comparison if needed
    if (String(valA) < String(valB)) {
      return -1; // Ascending for strings
    }
    if (String(valA) > String(valB)) {
      return 1;
    }

    return 0;
  });
};