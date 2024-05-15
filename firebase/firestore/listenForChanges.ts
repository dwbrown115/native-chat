import { doc, onSnapshot, getFirestore } from "firebase/firestore";

import { firebase_app } from "@/firebase";

export default function listenForChanges(
  collection: string,
  id: string
): Promise<object> {
  return new Promise((resolve, reject) => {
    const db = getFirestore(firebase_app);
    const docRef = doc(db, collection, id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      //   console.log("Current data: ", doc.data());
      //   return doc.data();
      const data = doc.data();
      if (data) {
        // console.log("Data found: ", data);
        resolve(data);
      } else {
        reject("No data found");
      }
    });

    return unsubscribe;
  });
  //   return unsubscribe;
}
