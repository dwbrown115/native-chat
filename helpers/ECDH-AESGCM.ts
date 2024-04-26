import * as forge from "node-forge";

export default class ECDH_AESGCM {
  async generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );

    // Export the public key (JWK format)
    const publicKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );
    // Export the private key (JWK format)
    const privateKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );

    return { publicKey, privateKey };
  }

  async derivedSharedSecret(yourPrivateKey: any, otherUserPublicKey: any) {
    const yourPrivateKeyObj = await window.crypto.subtle.importKey(
      "jwk",
      yourPrivateKey,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      ["deriveKey"]
    );

    const otherUserPublicKeyObj = await window.crypto.subtle.importKey(
      "jwk",
      otherUserPublicKey,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      []
    );

    const sharedSecret = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: otherUserPublicKeyObj,
      },
      yourPrivateKeyObj,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    // const exportedKey = await window.crypto.subtle.exportKey("jwk", sharedSecret);

    return sharedSecret;
  }

  async encryptMessage(sharedSecret: any, plaintext: string) {
    // Generate a random IV (12 bytes)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the plaintext
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      sharedSecret,
      new TextEncoder().encode(plaintext)
    );

    // Combine the IV and encrypted data
    const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
    combinedData.set(iv);
    combinedData.set(new Uint8Array(encryptedData), iv.length);

    // Convert the combined data to hexadecimal
    const hexCiphertext = Array.from(combinedData)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hexCiphertext;
  }

  async decryptMessage(sharedSecret: any, hexCiphertext: any) {
    // Convert the hex ciphertext back to bytes
    const combinedData = new Uint8Array(
      hexCiphertext.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16))
    );

    // Extract the IV from the combined data (first 12 bytes)
    const iv = combinedData.slice(0, 12);
    const encryptedData = combinedData.slice(12);

    // Decrypt the remaining encrypted data
    const plaintext = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      sharedSecret,
      encryptedData
    );

    return new TextDecoder().decode(plaintext);
  }
}

// generateRandomPrime(bits: number) {
//   const num = generateRandom(bits);

//   // Find the nearest prime to the random number
//   const prime = findNearestPrime(num);

//   return prime;

//   // Generate a random BigInteger
//   function generateRandom(bits: any) {
//     const randomNum = forge.util.bytesToHex(
//       forge.random.getBytesSync(bits / 8)
//     );
//     return new forge.jsbn.BigInteger(randomNum, 16);
//   }

//   // Find the nearest prime to the given number
//   function findNearestPrime(num: any) {
//     const THIRTY = new forge.jsbn.BigInteger("30", 10);
//     const ONE = new forge.jsbn.BigInteger("1", 10);

//     // Align the number on a 30k+1 boundary
//     let alignedNum = num.add(THIRTY).subtract(num.mod(THIRTY));

//     // Run a primality test (slow part)
//     while (!alignedNum.isProbablePrime()) {
//       alignedNum = alignedNum.add(ONE);
//     }

//     return alignedNum;
//   }
// }

// async generateModulo() {
//   const randomPrime = await this.generateRandomPrime(224);
//   return randomPrime;
// }

// async generateSecret() {
//   const randomPrime = await this.generateRandomPrime(1024);
//   return randomPrime;
// }

// async generatePublicKey(prime: any, modulo: any, secret: any) {
//   const publicKey = await modulo.modPow(secret, prime);
//   return publicKey;
// }

// async generateSharedSecret(prime: any, secret: any, publicKey: any) {
//   const sharedSecret = await publicKey.modPow(secret, prime);
//   return sharedSecret;
// }
