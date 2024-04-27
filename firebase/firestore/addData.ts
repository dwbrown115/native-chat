import firebase_app from "../config";
import { doc, setDoc, getFirestore } from "firebase/firestore";

export default async function addData(
  collection: string,
  id: string,
  data: any
) {
  const db = getFirestore(firebase_app);
  let result = null;

  try {
    result = await setDoc(doc(db, collection, id), data, { merge: true });
  } catch (e) {
    console.log(e);
  }

  return result;
}
