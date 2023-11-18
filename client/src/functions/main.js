export function countJsonKeys(jsonIn) {
  let count = 0;
  for (let prop in jsonIn) {
    if (jsonIn.hasOwnProperty(prop)) {
      ++count;
    }
  }
  return count;
}
