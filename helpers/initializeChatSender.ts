import { getFirestore, doc } from "firebase/firestore";

import { ECDH_AESGCM, makeId, detectPlatform } from "@/helpers";
import {
  firebase_app,
  runTransaction,
  getFieldFromDocument,
  addData,
} from "@/firebase";
import { storeDataDB } from "@/localStorage";

export default async function initializeChatSender(
  senderID: string,
  reciciverID: string
) {
  const db = getFirestore(firebase_app);
  const ecdh_aesgcm = new ECDH_AESGCM();

  // Generate a key pair for the chat room
  const keyPair = await ecdh_aesgcm.generateKeyPair();
  const chatRoomId = makeId(20);
  console.log("Key Pair Generated and Chat Room ID Created");

  // run a transaction to add the chat room id to the sender and receiver chatroom arrays
  const senderRef = doc(db, "Users", senderID);
  const receiverRef = doc(db, "Users", reciciverID);

  const senderChatRooms = await getFieldFromDocument(
    senderRef,
    "chatRooms",
    []
  );
  const receiverChatRooms = await getFieldFromDocument(
    receiverRef,
    "chatRooms",
    []
  );

  const senderChatRoomData = {
    chatRoomId: chatRoomId,
    initiator: senderID,
    receiver: reciciverID,
    // initialized: false,
  };
  senderChatRooms.push(senderChatRoomData);

  const receiverChatRoomData = {
    chatRoomId: chatRoomId,
    initiator: senderID,
    receiver: reciciverID,
    // initialized: false,
  };
  receiverChatRooms.push(receiverChatRoomData);

  await runTransaction(
    senderRef,
    receiverRef,
    { chatRooms: senderChatRooms },
    { chatRooms: receiverChatRooms },
    db
  );
  console.log("Transaction Ran Successfully");

  // create chatroom in firestore
  const data = {
    chatRoomId: chatRoomId,
    members: [
      { memberId: senderID, role: "sender" },
      { reciciverID: reciciverID, role: "receiver" },
    ],
    senderPublicKey: keyPair.publicKey,
    initialized: false,
  };
  await addData("ChatRooms", chatRoomId, data);
  console.log("Chat room created in firestore");

  // store the private key in local storage
  const platform = await detectPlatform();

  if (platform === "web") {
    const data = [
      {
        privateKey: keyPair.privateKey,
        chatRoomId: chatRoomId,
      },
    ];
    await storeDataDB("localStorage", "chatRooms", "chatRoomId", data);
    console.log("Storing private key in web local storage");
  } else if (platform === "mobile") {
    console.log("Storing private key in mobile local storage");
  }
}
