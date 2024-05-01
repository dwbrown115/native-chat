import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";

import addData from "../firestore/addData";
import firebase_app from "../config";

export default async function signUp(
  email: string,
  password: string,
  data: any
) {
  const auth = getAuth(firebase_app);
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password).then(
      async () => {
        if (auth.currentUser) {
          await sendEmailVerification(auth.currentUser);
          try {
            const collection = `Users`;
            const id = auth.currentUser.uid;
            const Data = { ...data, userId: id };
            await addData(collection, id, Data);
            // navigate("/user/authentication");
          } catch (e) {
            console.log(e, "after signup");
            error = e;
          }
        }
      }
    );
  } catch (e) {
    console.log(e, "signup error");
    error = e;
  }
  return { result, error };
}
