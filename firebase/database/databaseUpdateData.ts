import { getDatabase, ref, update } from "firebase/database";

import firebase_app from "../config";

export default async function updateData(collection: string, data: any) {
    const db = getDatabase(firebase_app);
    let result = null;

    try {
        result = await update(ref(db, collection), data);
        console.log("Data updated successfully");
    } catch (e) {
        console.log(e);
    }

    return result;
}