export default function findObjectByValue(arr: any, query: string ,value: string, ) {
  const foundObject = arr.find((obj: any) => Object.values(obj).includes(query));
      return foundObject ? foundObject.value : null;
}