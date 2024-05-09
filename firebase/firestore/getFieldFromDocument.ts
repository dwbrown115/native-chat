import { get } from "firebase/database";
import { getDoc } from "firebase/firestore";

export default async function getFieldFromDocument(
  docRef: any,
  fieldName: string,
  defaultValue: any
) {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data: any = docSnap.data();
    // return data[fieldName] ?? defaultValue;
    const fieldValue = data[fieldName];
    console.log("Field Value:", data);
    return fieldValue !== undefined ? fieldValue : defaultValue;
    // console.log("Document data:", data[fieldName]);
  } else {
    console.log("Document does not exist!");
  }
}
