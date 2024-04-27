import { getDatabase, ref, set } from "firebase/database";

import firebase_app from "../config";

export default async function addData(collection: string, data: Array<any>) {
    const db = getDatabase(firebase_app);
    let result = null;

    try {
        result = await set(ref(db, collection), data);
        // console.log("Data added successfully");
    } catch (e) {
        console.log(e);
    }

    return result;
}
