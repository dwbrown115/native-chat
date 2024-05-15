import { ECDH_AESGCM, detectPlatform } from "@/helpers";
import { getData, updateData } from "@/firebase";
import { storeDataDB } from "@/localStorage";

export default async function initializeChatReciver(
  chatRoomId: string,
  senderID: string,
  receiverID: string
) {
  const ecdh_aesgcm = new ECDH_AESGCM();

  // grabbing sender's public key
  const chatRoom = await getData("ChatRooms", chatRoomId);

  let senderPublicKey = chatRoom ? chatRoom["senderPublicKey"] : undefined;

  // Generate a key pair for the chat room
  const keyPair = await ecdh_aesgcm.generateKeyPair();
  console.log("Key Pair Generated");

  // update the chat room with the receiver's public key
  const data = {
    receiverPublicKey: keyPair.publicKey,
    initializationSteps: [
      { step: 1, doneBy: senderID, completed: true },
      { step: 2, doneBy: receiverID, completed: true },
      { step: 3, doneBy: senderID, completed: false },
    ],
  };
   await updateData("ChatRooms", chatRoomId, data);
  console.log("Receiver Public Key Updated in Chat Room");

  // Generate shared secret
  const sharedSecret = await ecdh_aesgcm.derivedSharedSecret(
    keyPair.privateKey,
    senderPublicKey
  );
  console.log("Shared Secret Generated");

  // store the shared secret in the local storage
  const platform = await detectPlatform();
  console.log("Platform Detected", platform);

  if (platform === "web") {
    console.log("Storing private key in web local storage");
    const data = [
      {
        sharedSecret: sharedSecret,
        chatRoomId: chatRoomId,
      },
    ];
    await storeDataDB("localStorage", "chatRooms", "chatRoomId", data);
    console.log("Shared Secret Successfully Stored in Local Storage");
  } else if (platform === "mobile") {
    console.log("Storing private key in mobile local storage");
  }
}
