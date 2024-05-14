export default function findObjectByValue(arr: any, query: any) {
  const foundObject = arr.find((obj: any) =>
    Object.values(obj).includes(query)
  );
  // console.log(foundObject.userName, "foundObject");
  return foundObject ? foundObject : null;
}
