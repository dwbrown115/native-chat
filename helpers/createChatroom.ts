import { router } from "expo-router";
import { addData } from "@/firebase";
import { makeId } from "@/helpers";

export default async function createChatroom(
  senderID: string,
  receiverID: string
) {
  const chatRoomId = makeId(20);
  const data = {
    chatRoomId: chatRoomId,
    members: [senderID, receiverID],
    // keys: [{ keyId: , keyNumber: 1 }],
    // senderPublicKey: keyPair.publicKey,
    initialized: false,
    initializationSteps: [
      { step: 1, doneBy: senderID, completed: false },
      { step: 2, doneBy: receiverID, completed: false },
      { step: 3, doneBy: senderID, completed: false },
    ],
  };
  await addData("ChatRooms", chatRoomId, data);
  console.log("Chat room created in firestore");
  router.push(`/chat/${chatRoomId}`);
}
