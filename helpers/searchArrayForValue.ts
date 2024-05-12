export default function searchArrayForValue(arr: any, value: string) {
  for (const obj of arr) {
    for (const prop in obj) {
      if (obj[prop] === value) {
        return true;
      }
    }
  }
  return false;
}
