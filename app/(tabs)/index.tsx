import { useState } from "react";
import { StyleSheet, TextInput, Pressable, View, Text } from "react-native";

import { AESGCM } from "@/helpers";

export default function TabOneScreen() {
  const aesGcm = new AESGCM();

  const [inputText, setInputText] = useState<string>("");
  const [key, setKey] = useState<any>(null);
  const [iv, setIv] = useState<any>(null);
  const [decryptedText, setDecryptedText] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");

  async function generateKey() {
    const key = await aesGcm.generateKey();
    const extractedKey = await aesGcm.extractKey(key);
    console.log("extractedKey", extractedKey);
    // console.log("key", key);
    setKey(extractedKey);
  }

  async function handleSubmit() {
    const { ciphertext, iv } = await aesGcm.encrypt(inputText, key);

    setIv(iv);

    const hexCipherText = await aesGcm.arrayBufferToHex(ciphertext);

    setEncryptedText(hexCipherText);
  }

  async function decrypt() {
    const decryptedText = await aesGcm.decrypt(encryptedText, key, iv);

    setDecryptedText(decryptedText);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AES-GCM Encryption</Text>
      <View style={{ margin: 5 }}>
        <Pressable style={styles.button} onPress={generateKey}>
          <Text style={{ color: "white" }}>Generate Key</Text>
        </Pressable>
      </View>
      <Text style={{ margin: 5 }}>Key: {JSON.stringify(key)}</Text>
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
      <View style={{ margin: 5 }}>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={{ color: "white" }}>Encrypt</Text>
        </Pressable>
      </View>
      <Text>Encrypted text: {encryptedText}</Text>
      <View style={{ margin: 5 }}>
        <Pressable style={styles.button} onPress={decrypt}>
          <Text style={{ color: "white" }}>Decrypt</Text>
        </Pressable>
      </View>
      <Text>Decrypted text: {decryptedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 5,
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
