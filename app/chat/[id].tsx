import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";

import {
  useEnterKeyPress,
  initializeChatSender,
  initializeChatReciver,
  completeInitializeChat,
} from "@/helpers";
// import { getData, listenForChanges } from "@/firebase";
import { firebase_app } from "@/firebase";
import { set } from "firebase/database";

export default function chatroom() {
  const db = getFirestore(firebase_app);

  const { id } = useLocalSearchParams();

  const [chatroom, setChatroom] = useState<any>({});
  const [senderMessages, setSenderMessages] = useState([]);
  const [receiverMessages, setReceiverMessages] = useState([]);
  const [error, setError] = useState("");

  async function getChatroom() {
    if (id) {
      // const chatroom = await getData("ChatRooms", id.toString());
      // await listenForChanges("ChatRooms", id.toString())
      //   .then((changes: any) => {
      //     console.log("Changes: ", changes);
      //     setChatroom(changes);
      //   })
      //   .catch((error) => {
      //     console.log("Error: ", error);
      //   });
      // console.log("Changes: ", changes);
      // setChatroom(chatroom || {}); // Handle undefined case
      // checkInitialisation(chatroom);
    }
  }

  function checkInitialisation(object: any) {
    if (object.initialized === false) {
      setError("Chatroom not initialized");
      checkInitialisationSteps(object);
    } else {
      setError("Chatroom initialized");
    }
  }

  function checkInitialisationSteps(object: any) {
    const uid = getAuth().currentUser?.uid;

    const step1 = object.initializationSteps[0];
    const step2 = object.initializationSteps[1];
    const step3 = object.initializationSteps[2];

    const reciver = object.members;

    const index = reciver.indexOf(uid);
    if (index > -1) {
      reciver.splice(index, 1);
    }

    if (step1.completed === false) {
      console.log("Step 1 not completed");
      initializeChatSender(uid ?? "", reciver[0], true, object.chatRoomId);
    } else if (step2.completed === false) {
      const doneBy = step2.doneBy;
      if (doneBy !== uid) {
        setError("Waiting on receiver to complete step 2");
      } else if (doneBy === uid) {
        console.log("Step 2 being completed by receiver");
        initializeChatReciver(object.chatRoomId, reciver[0], uid ?? "");
      }
    } else if (step3.completed === false) {
      const doneBy = step3.doneBy;
      if (doneBy !== uid) {
        setError("Waiting on sender to complete step 3");
      } else if (doneBy === uid) {
        console.log("Step 3 being completed by sender");
        completeInitializeChat(object.chatRoomId, reciver[0], uid ?? "");
      }
    } else {
      console.log("Chatroom initialized");
    }
  }

  // useEnterKeyPress(() => {
  //   console.log("Enter key pressed");
  // });

  useEffect(() => {
    // getChatroom();
    // console.log("Chatroom: ", chatroom);
    // checkInitialisation(chatroom);
  }, [chatroom]);

  useEffect(() => {
    // getChatroom();

    const chatroomRef = doc(db, "ChatRooms", id?.toString() ?? "");
    const unsubscribe = onSnapshot(chatroomRef, (doc) => {
      const data = doc.data();
      if (data) {
        // setChatroom(data);
        console.log("Data found: ", data);
        checkInitialisation(data);
      } else {
        setError("No data found");
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <View>
      <Text>{error}</Text>
    </View>
  );
}
