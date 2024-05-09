import { runTransaction } from "firebase/firestore";

import firebase_app from "../config";

export default async function RunTransaction(
  doc1Ref: any,
  doc2Ref: any,
  data1: any,
  data2: any,
  db: any
) {
  //   const doc1Ref = doc(db, collection1);
  //   const doc2Ref = doc(db, collection2);
  try {
    await runTransaction(db, async (transaction) => {
      const doc = await transaction.get(doc1Ref);
      const doc2 = await transaction.get(doc2Ref);
      if (!doc.exists()) {
        throw "Document 1 does not exist!";
      }
      if (!doc2.exists()) {
        throw "Document 2 does not exist!";
      }

      transaction.update(doc1Ref, data1);
      transaction.update(doc2Ref, data2);

      console.log("Transaction successfully committed!");
    });
  } catch (e) {
    console.log("Transaction failed: ", e);
  }
}
