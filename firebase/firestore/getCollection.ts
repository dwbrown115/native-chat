import { collection, getDocs, getFirestore } from "firebase/firestore";

import firebase_app from "../config";

export default async function getCollection(Collection: string) {
  const db = getFirestore(firebase_app);
  try {
    const querySnapshot = await getDocs(collection(db, Collection));
    if (querySnapshot) {
      return querySnapshot.docs.map((doc) => doc.data());
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (e) {
    console.error("Error getting documents:", e);
  }
}
