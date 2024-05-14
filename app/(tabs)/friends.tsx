import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { getFirestore, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import {
  handleSearch,
  searchArrayForValue,
  findObjectByValue,
  initializeChatSender,
} from "@/helpers";
import {
  runTransaction,
  getFieldFromDocument,
  firebase_app,
  getData,
} from "@/firebase";

export default function TabThreeScreen() {
  const db = getFirestore(firebase_app);
  const auth = getAuth();

  const [loggedInUser, setUserId] = useState<string>("");
  const [loggedInUsername, setLoggedInUsername] = useState<string>("");
  const [friends, setFriends] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  async function grabUser(userId: string) {
    const data = await getData("Users", userId);
    if (data) {
      setLoggedInUsername(data.username);
      // setFriends(data.friends);

      grabFriends(data.friends);
      const falseArray = Array.from(
        { length: data.friends.length },
        () => false
      );
      setConfirmDelete(falseArray);
      // console.log(data.friends);
    }
  }

  function handleDelete(index: number, value: boolean) {
    const updatedConfirmDelete = [...confirmDelete];
    // console.log(updatedConfirmDelete)
    updatedConfirmDelete[index] = value;
    // console.log(updatedConfirmDelete)
    setConfirmDelete(updatedConfirmDelete);
  }

  async function search(query: string) {
    handleSearch(query, "users")
      .then((results) => {
        // console.log(results);
        setSearchResults(results);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async function addFriend(userId: string, userName: string) {
    console.log(userId, loggedInUser);
    setError("");
    if (userId === loggedInUser) {
      setError("You can't add yourself as a friend");
    } else {
      console.log("beginning");
      const senderRef = doc(db, "Users", loggedInUser);
      // console.log(senderRef)
      const receiverRef = doc(db, "Users", userId);
      //  const reciverData = await getData("Users", userId)
      //    console.log(receiverRef)
      console.log("grabbing refs");

      const senderFriendsArray = await getFieldFromDocument(
        senderRef,
        "friends",
        []
      );
      const receiverFriendsArray = await getFieldFromDocument(
        receiverRef,
        "friends",
        []
      );

      console.log("grabbed document fields");

      const senderFriendData = {
        senderId: loggedInUser,
        userName: userName,
        userId: userId,
        confirmed: false,
        chat: false,
        chatRoomId: "",
      };
      senderFriendsArray.push(senderFriendData);
      console.log(senderFriendData, "senderFriendData");

      const receiverFriendData = {
        senderId: loggedInUser,
        username: loggedInUsername,
        userId: loggedInUser,
        confirmed: false,
        chat: false,
        chatRoomId: "",
      };
      receiverFriendsArray.push(receiverFriendData);

      // console.log("pushed data to arrays");

      // console.log("starting transaction");
      // setFriends(...friends, senderFriendData);
      friends.push(senderFriendData);
      await runTransaction(
        senderRef,
        receiverRef,
        { friends: senderFriendsArray },
        { friends: receiverFriendsArray },
        db
      );
    }
    console.log("success");
  }

  function handleTest() {
    // console.log(searchArrayForValue(friends, "dbrown115"));
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setFriends([]);
        setUserId(user.uid);
        grabUser(user.uid);
        // search("");
      }
    });
  }, []);

  async function grabFriends(friends: any[]) {
    friends.forEach(async (friend) => {
      const data = await getData("Users", friend.userId);
      const friendData = {
        username: data?.username,
        userId: friend.userId,
        confirmed: friend.confirmed,
        profilePicture: data?.profilePicture,
        chatRoomId: friend.chatRoomId,
      };
      setFriends((prev) => [...prev, friendData]);
    });
  }

  async function confirmFriend(userId: string) {
    const senderRef = doc(db, "Users", loggedInUser);
    const receiverRef = doc(db, "Users", userId);

    const senderFriendsArray = await getFieldFromDocument(
      senderRef,
      "friends",
      []
    );
    const receiverFriendsArray = await getFieldFromDocument(
      receiverRef,
      "friends",
      []
    );

    const senderFriends = await senderFriendsArray.map((friend: any) => {
      if (friend.userId === userId) {
        friend.confirmed = true;
        return friend;
      }
    });

    const receiverFriends = await receiverFriendsArray.map((friend: any) => {
      if (friend.userId === loggedInUser) {
        friend.confirmed = true;
        return friend;
      }
    });

    setFriends(senderFriends);
    await runTransaction(
      senderRef,
      receiverRef,
      { friends: senderFriends },
      { friends: receiverFriends },
      db
    );
  }

  async function deleteFriend(userId: string, indexToRemove: number) {
    const senderRef = doc(db, "Users", loggedInUser);
    const receiverRef = doc(db, "Users", userId);

    const senderFriendsArray = await getFieldFromDocument(
      senderRef,
      "friends",
      []
    );
    const receiverFriendsArray = await getFieldFromDocument(
      receiverRef,
      "friends",
      []
    );

    const senderFriends = await senderFriendsArray.filter((friend: any) => {
      if (friend.userId !== userId) {
        return friend;
      }
    });

    const receiverFriends = await receiverFriendsArray.filter((friend: any) => {
      if (friend.userId !== loggedInUser) {
        return friend;
      }
    });

    setFriends(senderFriends);
    setConfirmDelete((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
    //setConfirmDelete(false);
    // console.log(senderFriend, receiverFriend);
    await runTransaction(
      senderRef,
      receiverRef,
      { friends: senderFriends },
      { friends: receiverFriends },
      db
    );
  }

  useEffect(() => {
    // console.log(friends);
  }, [friends]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Tab Three</Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TextInput
            style={{
              height: 40,
              width: 200,
              borderColor: "gray",
              borderWidth: 1,
              margin: 5,
            }}
            onChangeText={(text) => setQuery(text)}
            value={query}
          />
          <Pressable onPress={() => search(query)} style={styles.button}>
            <Text style={{ color: "white" }}>Search</Text>
          </Pressable>
        </View>
        <Text style={{ color: "red" }}>{error}</Text>
        <Pressable onPress={handleTest}>
          <Text style={styles.button}>Test</Text>
        </Pressable>
        <Text>Search Results:</Text>
        {searchResults.map((result) => {
          return (
            <View
              style={{
                display: "flex",
                width: "50%",
              }}
              key={result.objectID}
            >
              {result.objectID === loggedInUser ? null : (
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Image
                    source={{ uri: result.profilePicture }}
                    style={{ width: 50, height: 50 }}
                    alt="profilePicture.jpg"
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "40%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>Username: {result.username}</Text>

                    {searchArrayForValue(friends, result.userId) === true ? (
                      <View>
                        <Text>
                          Friend confirmed:{" "}
                          {findObjectByValue(
                            friends,
                            result.userId,
                          )
                            ? "Yes"
                            : "No"}
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() =>
                          addFriend(result.userId, result.username)
                        }
                        style={styles.button}
                      >
                        <Text style={{ color: "white" }}>Add Friend</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}
            </View>
          );
        })}
        <Text>Friends:</Text>
        {friends.map((friend, index) => {
          // console.log(friend);
          return (
            <View
              style={{
                display: "flex",
                width: "50%",
              }}
              key={friend.userId}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Image
                  source={{ uri: friend.profilePicture }}
                  style={{ width: 50, height: 50 }}
                  alt="profilePicture.jpg"
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "40%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Username: {friend.username}</Text>
                  <Text>
                    Friend confirmed: {friend.confirmed ? "Yes" : "No"}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "column" }}>
                  {friend.senderId !== loggedInUser &&
                  friend.confirmed === false ? (
                    <Pressable
                      onPress={() => confirmFriend(friend.userId)}
                      style={styles.button}
                    >
                      <Text style={{ color: "white" }}>Confirm Friend</Text>
                    </Pressable>
                  ) : null}
                  {confirmDelete[index] ? (
                    <View>
                      <Pressable
                        onPress={() => handleDelete(index, false)}
                        style={styles.button}
                      >
                        <Text style={{ color: "white" }}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => deleteFriend(friend.userId, index)}
                        style={styles.button}
                      >
                        <Text style={{ color: "white" }}>Confirm</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => handleDelete(index, true)}
                      style={styles.button}
                    >
                      <Text style={{ color: "white" }}>Delete Friend</Text>
                    </Pressable>
                  )}
                  {friend.chat ? (
                    <Pressable
                      onPress={() =>
                        initializeChatSender(loggedInUser, friend.userId)
                      }
                      style={styles.button}
                    >
                      <Text style={{ color: "white" }}>Start Chat</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        router.push(`/chat/${friend.chatRoomId}`);
                      }}
                      style={styles.button}
                    >
                      <Text style={{ color: "white" }}>Chat</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
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
