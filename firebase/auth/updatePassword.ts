import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { firebase_app } from "@/firebase";

export default async function firebaseUpdatePassword(
  email: string,
  password: string,
  newPassword: string
) {
  const auth = getAuth(firebase_app);
  let result = null,
    error = null;
  try {
    const credential = EmailAuthProvider.credential(email, password);
    if (!auth.currentUser) {
      error = "No user found";
      return { result, error };
    }
    await reauthenticateWithCredential(auth.currentUser, credential);
    result = await updatePassword(auth.currentUser, newPassword);
  } catch (e) {
    console.log(e, "update password error");
    error = e;
  }
  return { result, error };
}
