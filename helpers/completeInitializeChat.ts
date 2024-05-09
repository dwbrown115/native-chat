import { getData, updateData, deleteData } from "@/firebase";
import { fetchDataDB, storeDataDB, deleteDataDB } from "@/localStorage";
import { ECDH_AESGCM, detectPlatform } from "@/helpers";

export default async function completeInitializeChat(
  chatRoomId: string,
  userId: string
) {
  const ecdh_aesgcm = new ECDH_AESGCM();

  // Grabing private key
  const privateKeyArray: any = [];

  console.log("Fetching Private Key from Local Storage");
  await fetchDataDB("localStorage", "chatRooms", "chatRoomId", chatRoomId)
    .then((data: any) => {
      //   console.log("Private Key Fetched from Local Storage", data["privateKey"]);
      //   return data["senderPublicKey"];
      privateKeyArray.push(data["privateKey"]);
    })
    .catch((error) => {
      console.error("Error Fetching Private Key from Local Storage", error);
    });

  const privateKey = privateKeyArray[0];
  console.log("Private Key Fetched from Local Storage", privateKey);

  // Grabing receiver's public key
  const chatRoom = await getData("ChatRooms", chatRoomId);
  let receiverPublicKey = chatRoom ? chatRoom["receiverPublicKey"] : undefined;
  console.log("Receiver Public Key Fetched", receiverPublicKey);

  //   Generate shared secret
  const sharedSecret = await ecdh_aesgcm.derivedSharedSecret(
    privateKey,
    receiverPublicKey
  );

  console.log("Shared Secret Generated", sharedSecret);

  //   Delete the Private Key from the local storage
  deleteDataDB("localStorage", "chatRooms", "chatRoomId", chatRoomId);
  console.log("Private Key Deleted from Local Storage");

  //   Store the shared secret in the local storage
  const platform = await detectPlatform();
  console.log("Platform Detected", platform);

  if (platform === "web") {
    console.log("Storing shared secret in web local storage");
    const data = [
      {
        sharedSecret: sharedSecret,
        chatRoomId: chatRoomId,
      },
    ];
    await storeDataDB("localStorage", "chatRooms", "chatRoomId", data);
    console.log("Shared Secret Successfully Stored in Local Storage");
  } else if (platform === "mobile") {
    console.log("Storing shared secret in mobile local storage");
  }

  // Update the chat room by deleting public keys and setting initialized to true
  const data = {
    senderPublicKey: null,
    receiverPublicKey: null,
    initialized: true,
  };
  await updateData("ChatRooms", chatRoomId, data);
  console.log("Chat Room Updated Successfully");
}
