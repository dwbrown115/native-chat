import { getFirestore, doc } from "firebase/firestore";

import { ECDH_AESGCM, makeId, detectPlatform } from "@/helpers";
import {
  firebase_app,
  runTransaction,
  getFieldFromDocument,
  addData,
  updateData,
} from "@/firebase";
import { storeDataDB } from "@/localStorage";

export default async function initializeChatSender(
  senderID: string,
  receiverID: string,
  created: boolean,
  chatRoomId: string,
) {
  const db = getFirestore(firebase_app);
  const ecdh_aesgcm = new ECDH_AESGCM();

  // Generate a key pair for the chat room
  const keyPair = await ecdh_aesgcm.generateKeyPair();
  const keyId = makeId(20);
  console.log("Key Pair Generated and Chat Room ID Created");

  // run a transaction to add the chat room id to the sender and receiver chatroom arrays
  const senderRef = doc(db, "Users", senderID);
  const receiverRef = doc(db, "Users", receiverID);

  const senderChatRooms = await getFieldFromDocument(
    senderRef,
    "chatRooms",
    []
  );
  const senderFriendsArray = await getFieldFromDocument(
    senderRef,
    "friends",
    []
  );

  const receiverChatRooms = await getFieldFromDocument(
    receiverRef,
    "chatRooms",
    []
  );
  const receiverFriendsArray = await getFieldFromDocument(
    receiverRef,
    "friends",
    []
  );

  const senderChatRoomData = {
    chatRoomId: chatRoomId,
    initiator: senderID,
    receiver: receiverID,
    // initialized: false,
  };
  senderChatRooms.push(senderChatRoomData);

  const senderFriends = senderFriendsArray.map((friend: any) => {
    if (friend.userId === receiverID) {
      friend.chat = true;
      friend.chatRoomId = chatRoomId;
      return friend;
    }
  });

  const receiverChatRoomData = {
    chatRoomId: chatRoomId,
    initiator: senderID,
    receiver: receiverID,
    // initialized: false,
  };
  receiverChatRooms.push(receiverChatRoomData);

  const receiverFriends = receiverFriendsArray.map((friend: any) => {
    if (friend.userId === senderID) {
      friend.chat = true;
      friend.chatRoomId = chatRoomId;
      return friend;
    }
  });

  await runTransaction(
    senderRef,
    receiverRef,
    { chatRooms: senderChatRooms },
    { chatRooms: receiverChatRooms },
    db
  );

  await runTransaction(
    senderRef,
    receiverRef,
    { friends: senderFriends },
    { friends: receiverFriends },
    db
  );
  console.log("Both Transactions Ran Successfully");
  if (created === false) {
    // create chatroom in firestore
    const data = {
      chatRoomId: chatRoomId,
      members: [senderID, receiverID],
      keys: [{ keyId: keyId, keyNumber: 1 }],
      senderPublicKey: keyPair.publicKey,
      initialized: false,
      initializationSteps: [
        { step: 1, doneBy: senderID, completed: true },
        { step: 2, doneBy: receiverID, completed: false },
        { step: 3, doneBy: senderID, completed: false },
      ],
    };
    await addData("ChatRooms", chatRoomId, data);
    console.log("Chat room created in firestore");
  } else if (created === true) {
    const data = {
      senderPublicKey: keyPair.publicKey,
      initialized: false,
      initializationSteps: [
        { step: 1, doneBy: senderID, completed: true },
        { step: 2, doneBy: receiverID, completed: false },
        { step: 3, doneBy: senderID, completed: false },
      ],
    };
    await updateData("ChatRooms", chatRoomId, data);
    console.log("Chatroom being reinitalized");
  }

  // store the private key in local storage
  const platform = await detectPlatform();

  if (platform === "web") {
    const data = [
      {
        privateKey: keyPair.privateKey,
        chatRoomId: chatRoomId,
        keyId: keyId,
        keyNumber: 1,
      },
    ];
    await storeDataDB("localStorage", "chatRooms", "chatRoomId", data);
    console.log("Storing private key in web local storage");
  } else if (platform === "mobile") {
    console.log("Storing private key in mobile local storage");
  }
}
