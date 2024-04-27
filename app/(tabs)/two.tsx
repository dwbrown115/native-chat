import { useState, useEffect } from "react";
import { StyleSheet, TextInput, Pressable, View, Text } from "react-native";

// import { }


import { ECDH_AESGCM } from "@/helpers";

export default function TabTwoScreen() {
  const ecdh_aesgcm = new ECDH_AESGCM();

  const [inputText, setInputText] = useState<string>("");
  const [sharedSecret, setSharedSecret] = useState<any>(null);
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");

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

  return (
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
