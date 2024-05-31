import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { firebase_app, updateData, uploadImages } from "@/firebase";
import { ImageInput } from "@/components"

export default function four() {
  const auth = getAuth(firebase_app);
  const db = getFirestore(firebase_app);

  const [user, setUser] = useState<any>({ username: "", email: ""});
  const [password, setPassword] = useState<any>({ password: "", newPassword: "", confirmPassword: ""})

  async function getUser() {
    const userId = auth.currentUser?.uid || "";
    const userRef = doc(db, "Users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUser(userSnap.data());
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUser();
      }
    });
  },[]);

  // useEffect(() => {
  //   console.log("User:", user.profilePicture);
  // }, [user]);

  async function handleExportImages(images: any) {
    images.forEach(async (image: any) => {
      // const base64 = await ecdh_aesgcm.convertImageToBase64(image);
      // console.log("Base64:", base64);
      try {
        // setImageArray([...imageArray, decryptedImage]);
      } catch (error) {
        console.log("Error:", error);
      }
    });
  }

  function handleChangeUser(text: string, field: string) {
    setUser({ ...user, [field]: text})
  }

  function handleChangePassword(text: string, field: string) {
    setPassword({...password, [field]: text})
  }

  function handleUpdatePassword() {
    if (password.newPassword === password.confirmPassword) 
  }

  useEffect(() => {
    console.log("User:", user)
  })

  return (
    <View>
      <Text>Profile</Text>
      <Text>Username: {user?.username}</Text>
      <TextInput value={user?.username} onChangeText={(text) => handleChangeUser(text, "username")} />
      <Text>Email: {user?.email}</Text>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <Text>Profile Image:</Text>
        <Image source={{ uri: user?.profilePicture }} style={{ width: 100, height: 100 }} />
      </View>
      <View style={{ width: "20%"}}>
        <Text>Change Profile Picture </Text>
        <ImageInput onExportImages={handleExportImages} allowMultiple={false} />
      </View>
    </View>
  );
}
