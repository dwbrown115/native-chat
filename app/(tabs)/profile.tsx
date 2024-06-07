import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { firebase_app, updateData, uploadImages } from "@/firebase";
import { ImageInput } from "@/components";
import { set } from "firebase/database";

export default function four() {
  const auth = getAuth(firebase_app);
  const db = getFirestore(firebase_app);

  const [user, setUser] = useState<any>({ username: "", email: "" });
  const [password, setPassword] = useState<any>({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [imageUri, setImageUri] = useState<string>("");

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
  }, []);

  // useEffect(() => {
  //   console.log("User:", user.profilePicture);
  // }, [user]);

  async function handleExportImages(images: any) {
    // images.forEach(async (image: any) => {
    //   // const base64 = await ecdh_aesgcm.convertImageToBase64(image);
    //   // console.log("Base64:", base64);
    //   try {
    //     // setImageArray([...imageArray, decryptedImage]);
    //   } catch (error) {
    //     console.log("Error:", error);
    //   }
    // });
    setImageUri(images[0]);
    // console.log("Images:", images[0]);
  }

  function handleChangeUser(text: string, field: string) {
    setUser({ ...user, [field]: text });
  }

  function handleChangePassword(text: string, field: string) {
    setPassword({ ...password, [field]: text });
  }

  function handleUpdatePassword() {
    if (password.newPassword === password.confirmPassword) {
    }
  }

  useEffect(() => {
    // console.log("User:", user);
  });

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Text>Username: {user?.username}</Text>
      <TextInput
        value={user?.username}
        onChangeText={(text) => handleChangeUser(text, "username")}
      />
      <Text>Email: {user?.email}</Text>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <Text>Profile Image:</Text>
        <Image
          source={{ uri: user?.profilePicture }}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View style={{ width: "20%" }}>
        <Text>Change Profile Picture </Text>
        <View style={{ width: "40%", marginHorizontal: "auto" }}>
          <Text>Preview Image:</Text>
          {imageUri !== "" && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 100, height: 100, marginHorizontal: "auto" }}
            />
          )}
          <ImageInput
            // onExportImages={handleExportImages}
            exportImages={handleExportImages}
            allowMultiple={false}
            aspect={[1, 1]}
            allowsEditing={true}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    margin: 5,
    backgroundColor: "#2196f3",
    color: "white",
    alignItems: "center",
    padding: 8,
    fontFamily: "sans-serif",
    fontWeight: "600",
    borderRadius: 2,
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 0.4,
  },
});
