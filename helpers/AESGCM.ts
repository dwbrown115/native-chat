// import * as crypto from "crypto";

export default class AESGCM {
  static ALGORITHM = "AES-GCM";
  static KEY_SIZE = 256;

  async generateSecretKey() {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    return key;
  }

  async generateKey() {
    console.log("generateKey");
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    // console.log("key", key);
    return key;
  }

  async extractKey(key: any) {
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    return this.keyArrayBufferToHex(exportedKey);
  }

  async importKey(key: any) {
    const importedKey = await crypto.subtle.importKey(
      "raw",
      this.hexToKeyArrayBuffer(key),
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
    return importedKey;
  }

  async encrypt(plaintext: string, Key: any) {
    const key = await this.importKey(Key);
    const encodedPlaintext = new TextEncoder().encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector (IV)

    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      encodedPlaintext
    );

    return { ciphertext, iv };
  }

  async decrypt(encryptedText: any, Key: any, iv: any) {
    const key = await this.importKey(Key);
    const ciphertext = this.hexToArrayBuffer(encryptedText);
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      ciphertext
    );
    const decryptedText = new TextDecoder().decode(decryptedArrayBuffer);
    return decryptedText;
  }

  arrayBufferToHex(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  hexToArrayBuffer(hex: string) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes.buffer;
  }

  keyArrayBufferToHex(key: any) {
    return Array.from(new Uint8Array(key))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  hexToKeyArrayBuffer(hex: string) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes.buffer;
  }
}
