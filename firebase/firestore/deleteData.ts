import firebase_app from "../config";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";

export default async function deleteData(collection: string, id: string) {
  const db = getFirestore(firebase_app);
  let result = null;

  try {
    result = await deleteDoc(doc(db, collection, id));
  } catch (e) {
    console.log(e);
  }

  return result;
}
