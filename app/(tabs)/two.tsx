import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { getFirestore, doc } from "firebase/firestore";

import { ImageInput, MobileTextInput } from "@/components";
import {
  ECDH_AESGCM,
  makeId,
  initializeChatSender,
  initializeChatReciver,
  completeInitializeChat,
} from "@/helpers";
import { firebase_app, runTransaction, getFieldFromDocument } from "@/firebase";
import { storeDataDB, fetchDataDB, deleteDataDB } from "@/localStorage";

export default function TabTwoScreen() {
  // const db = getFirestore(firebase_app);
  const ecdh_aesgcm = new ECDH_AESGCM();

  const [inputText, setInputText] = useState<string>("");
  const [sharedSecret, setSharedSecret] = useState<any>(null);
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");
  const [imageArray, setImageArray] = useState<any>([]);

  async function generateKeys() {
    // const iv1 = await ecdh_aesgcm.generateIv();
    // const iv2 = await ecdh_aesgcm.generateIv();
    // const key1 = await ecdh_aesgcm.generateKey(sharedSecret1, iv1);
    // const key2 = await ecdh_aesgcm.generateKey(sharedSecret2, iv2);
    // console.log("Key 1:", key1);
    // console.log("Key 2:", key2);
    // const key = await ecdh_aesgcm.generateKey();
    // console.log("Key:", key);
    const keyPair1 = await ecdh_aesgcm.generateKeyPair();
    console.log("Private Key1:", keyPair1.privateKey);
    console.log("Public Key1:", keyPair1.publicKey);
    const keyPair2 = await ecdh_aesgcm.generateKeyPair();
    console.log("Private Key2:", keyPair2.privateKey);
    console.log("Public Key2:", keyPair2.publicKey);
    const sharedSecret = await ecdh_aesgcm.derivedSharedSecret(
      keyPair1.privateKey,
      keyPair2.publicKey
    );
    setSharedSecret(sharedSecret);
  }

  async function handleSubmit() {
    const ciphertext = await ecdh_aesgcm.encryptMessage(
      sharedSecret,
      inputText
    );
    setEncryptedText(ciphertext);
  }

  async function decrypt() {
    const decryptedText = await ecdh_aesgcm.decryptMessage(
      sharedSecret,
      encryptedText
    );
    setDecryptedText(decryptedText);
  }

  async function handleExportImages(images: any) {
    images.forEach(async (image: any) => {
      // const base64 = await ecdh_aesgcm.convertImageToBase64(image);
      // console.log("Base64:", base64);
      try {
        const encryptedImage = await ecdh_aesgcm.encryptMessage(
          sharedSecret,
          image
        );
        const decryptedImage = await ecdh_aesgcm.decryptMessage(
          sharedSecret,
          encryptedImage
        );
        setImageArray([...imageArray, decryptedImage]);
      } catch (error) {
        console.log("Error:", error);
      }
    });
  }

  async function handleRunTransaction() {
    const chatRoomId = makeId(20);

    // const senderRef = doc(db, `Users`, "PIGC4UTHEdOw5bS4RgJjBQjVTEo2");
    // const receiverRef = doc(db, `Users`, "s6GTjM8CV4YAR1AKpyEdiYCYaX52");
    // console.log("Sender Ref:", senderRef);
    // console.log("Receiver Ref:", receiverRef);
    // const senderChatRooms = await getFieldFromDocument(
    //   senderRef,
    //   "chatRooms",
    //   []
    // );
    // const receiverChatRooms = await getFieldFromDocument(
    //   receiverRef,
    //   "chatRooms",
    //   []
    // );
    // senderChatRooms.push(chatRoomId);
    // receiverChatRooms.push(chatRoomId);

    // console.log("Sender Chat Rooms:", senderChatRooms);
    // console.log("Receiver Chat Rooms:", receiverChatRooms);

    // runTransaction(
    //   senderRef,
    //   receiverRef,
    //   { chatRooms: senderChatRooms },
    //   { chatRooms: receiverChatRooms },
    //   db
    // );
  }

  function handleMobileTextInput(text: string) {
    console.log("Mobile Text Input:", text);
  }

  function handleWriteDBTest() {
    const peopleData = [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
      { name: "Charlie", age: 28 },
    ];

    // storeDataDB("myDatabase", "peopleStore", "name", peopleData);
    // deleteDataDB("myDatabase", "peopleStore", "name", "Charlie");

    fetchDataDB(
      "localStorage",
      "chatRooms",
      "chatRoomId",
      "9LidR9RVEzb7D2MzFzmh"
    )
      .then((data: any) => {
        console.log(
          "Private Key Fetched from Local Storage",
          // data["privateKey"]
          data
        );
        //   return data["senderPublicKey"];
        // privateKeyArray.push(data["privateKey"]);
      })
      .catch((error) => {
        console.error("Error Fetching Private Key from Local Storage", error);
      });

    // deleteDataDB(
    //   "localStorage",
    //   "chatRooms",
    //   "chatRoomId",
    //   "9LidR9RVEzb7D2MzFzmh"
    // );

    // fetchDataDB(
    //   "myDatabase",
    //   "peopleStore",
    //   "name",
    //   "Bob",
    //   (fetchedData: any) => {
    //     console.log("Fetched data:", fetchedData["name"]);
    //   }
    // );

    // console.log("Fetched Data:", data);
    // fetchDataDB("myDatabase", "peopleStore", "name", "Bob")
    //   .then((data) => {
    //     console.log("Fetched Data:", data);
    //   })
    //   .catch((error) => {
    //     console.log("Error:", error);
    //   });
  }

  function handleInitailizeChatSender() {
    initializeChatSender(
      "PIGC4UTHEdOw5bS4RgJjBQjVTEo2",
      "s6GTjM8CV4YAR1AKpyEdiYCYaX52"
    );
  }

  function handleInitializeChatReciver() {
    initializeChatReciver("9LidR9RVEzb7D2MzFzmh");
  }

  function handleCompleteInitializeChat() {
    completeInitializeChat(
      "9LidR9RVEzb7D2MzFzmh",
      "PIGC4UTHEdOw5bS4RgJjBQjVTEo2"
    );
  }

  useEffect(() => {
    // console.log("Image Array:", imageArray);
  }, [imageArray]);

  useEffect(() => {
    // generateKeys();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Pressable onPress={generateKeys}>
          <Text style={styles.button}>Generate Keys</Text>
        </Pressable>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            padding: 5,
            margin: 5,
          }}
          placeholder="Enter text to encrypt"
          onChangeText={(text) => setInputText(text)}
        />
        <Pressable onPress={handleSubmit}>
          <Text style={styles.button}>Encrypt</Text>
        </Pressable>
        <Text>Encrypted text: {encryptedText}</Text>
        <Pressable onPress={decrypt}>
          <Text style={styles.button}>Decrypt</Text>
        </Pressable>
        <Text>Decrypted text: {decryptedText}</Text>
        <ImageInput exportImages={handleExportImages} />
        {imageArray.map((image: any, index: number) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width: 200, height: 200 }}
          />
        ))}
        <Pressable onPress={handleRunTransaction}>
          <Text style={styles.button}>Run Transaction</Text>
        </Pressable>
        <MobileTextInput exportText={handleMobileTextInput} />
        <Pressable onPress={handleWriteDBTest}>
          <Text style={styles.button}>Write DB Test</Text>
        </Pressable>
        <Pressable onPress={handleInitailizeChatSender}>
          <Text style={styles.button}>Initialize Chat Sender</Text>
        </Pressable>
        <Pressable onPress={handleInitializeChatReciver}>
          <Text style={styles.button}>Initialize Chat Reciver</Text>
        </Pressable>
        <Pressable onPress={handleCompleteInitializeChat}>
          <Text style={styles.button}>Complete Initialize Chat</Text>
        </Pressable>
        {/* <Image
        source={{ uri: imageArray[0]?.uri }}
        style={{ width: 200, height: 200 }}
      /> */}
      </View>
    </ScrollView>
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

// const [primeNumber, setPrimeNumber] = useState<any>(null);
// const [modulo, setModulo] = useState<any>(null);
// const [secret1, setSecret1] = useState<any>(null);
// const [secret2, setSecret2] = useState<any>(null);
// const [publicKey1, setPublicKey1] = useState<any>(null);
// const [publicKey2, setPublicKey2] = useState<any>(null);

// const [connection, setConnection] = useState<Boolean>(false);
// const [publicKeysGenerated, setPublicKeysGenerated] = useState<Boolean>(false);
// const [exchanged, setExchanged] = useState<Boolean>(false);

// async function sendPacket() {
//   const randomPrime = await ecdh_aesgcm.generateRandomPrime(3072);
//   setPrimeNumber(randomPrime);
//   const modulo = await ecdh_aesgcm.generateRandomPrime(224);
//   setModulo(modulo);
//   setConnection(true);
// }

// async function generateSecret() {
//   const secret1 = await ecdh_aesgcm.generateRandomPrime(1024);
//   // console.log("Secret 1:", secret1.toString(16));
//   setSecret1(secret1);
//   const secret2 = await ecdh_aesgcm.generateRandomPrime(1024);
//   // console.log("Secret 2:", secret2.toString(16));
//   setSecret2(secret2);
// }

// async function generateBothPublicKeys() {
//   const publicKey2 = await ecdh_aesgcm.generatePublicKey(
//     primeNumber,
//     modulo,
//     secret2
//   );
//   setPublicKey2(publicKey2);
//   const publicKey1 = await ecdh_aesgcm.generatePublicKey(
//     primeNumber,
//     modulo,
//     secret1
//   );
//   setPublicKey1(publicKey1);
//   setPublicKeysGenerated(true);
// }

// async function generateBothSharedSecrets() {
//   const sharedSecret1 = await ecdh_aesgcm.generateSharedSecret(
//     primeNumber,
//     secret1,
//     publicKey2
//   );
//   setSharedSecret1(sharedSecret1);
//   const sharedSecret2 = await ecdh_aesgcm.generateSharedSecret(
//     primeNumber,
//     secret2,
//     publicKey1
//   );
//   setSharedSecret2(sharedSecret2);
//   setExchanged(true);
//   if (sharedSecret1.equals(sharedSecret2)) {
//     console.log("Shared secrets match");
//   }
// }

// function initializeConnection() {
//   sendPacket();
//   generateSecret();
// }

// return images;
// setImageArray(images);
// console.log("Images:", images);
// console.log("Images:", images);
// setImageArray(images);
// const ImageArray: any[] = [];
// images.forEach(async (image: any) => {
//   console.log("Image:", image);
// const base64 = await ecdh_aesgcm.convertImageToBase64(image.uri);
// console.log("Base64:", base64);
// try {
//   const encryptedImage = await ecdh_aesgcm.encryptMessage(
//     sharedSecret,
//     image
//   );
//   // console.log("Encrypted Image:", encryptedImage);
//   const decryptedImage = await ecdh_aesgcm.decryptMessage(
//     sharedSecret,
//     encryptedImage
//   );
//   console.log("Decrypted Image:", decryptedImage);
//   ImageArray.push(decryptedImage);
//   // setImageArray(ImageArray);
// } catch (error) {
//   console.log("Error:", error);
// }
// ImageArray.push(image);
// setImageArray([...imageArray, image]);
// });
// for (let i = 0; i < images.length; i++) {
//   const image = images[i];
//   // console.log(images.length, i, image)
//   ImageArray.push(image);

//   // console.log("Image:", image);
//   // const base64 = await ecdh_aesgcm.convertImageToBase64(image.uri);
//   // console.log("Base64:", base64);
//   // try {
//   //   const encryptedImage = await ecdh_aesgcm.encryptMessage(
//   //     sharedSecret,
//   //     image
//   //   );
//   //   // console.log("Encrypted Image:", encryptedImage);
//   //   const decryptedImage = await ecdh_aesgcm.decryptMessage(
//   //     sharedSecret,
//   //     encryptedImage
//   //   );
//   //   // ImageArray.push(decryptedImage);
//   //   // console.log("Decrypted Image Array:", ImageArray);
//   //   //  setImageArray([...imageArray, decryptedImage]);
//   // } catch (error) {
//   //   console.log("Error:", error);
//   // }
// }
// console.log("Image Array:", ImageArray);
// setImageArray(ImageArray);
