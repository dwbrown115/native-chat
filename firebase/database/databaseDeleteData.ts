import { getDatabase, remove, ref } from "firebase/database";

import firebase_app from "../config";

export default async function deleteData(collection: string) {
  const db = getDatabase(firebase_app);
  let result = null;

  try {
    result = await remove(ref(db, collection));
    console.log("Data deleted successfully");
  } catch (e) {
    console.log(e);
  }

  return result;
}
