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
import { getFirestore, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import {
  handleSearch,
  searchArrayForValue,
  findObjectByValue,
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
  const [error, setError] = useState<string>("");

  async function grabUser(userId: string) {
    const data = await getData("Users", userId);
    if (data) {
      setLoggedInUsername(data.username);
      // setFriends(data.friends);

      grabFriends(data.friends);
      // console.log(data.friends);
    }
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

      const senderFriends = await getFieldFromDocument(
        senderRef,
        "friends",
        []
      );
      const receiverFriends = await getFieldFromDocument(
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
      };
      senderFriends.push(senderFriendData);

      const receiverFriendData = {
        senderId: loggedInUser,
        username: loggedInUsername,
        userId: loggedInUser,
        confirmed: false,
      };
      receiverFriends.push(receiverFriendData);

      console.log("pushed data to arrays");

      console.log("starting transaction");
      await runTransaction(
        senderRef,
        receiverRef,
        { friends: senderFriends },
        { friends: receiverFriends },
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
        search("");
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
      };
      setFriends((prev) => [...prev, friendData]);
    });
  }

  useEffect(() => {
    console.log(friends);
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
                            "confirmed"
                          )
                            ? "Yes"
                            : "No"}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Pressable
                          onPress={() =>
                            addFriend(result.userId, result.username)
                          }
                          style={styles.button}
                        >
                          <Text style={{ color: "white" }}>Add Friend</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          );
        })}
        <Text>Friends:</Text>
        {friends.map((friend) => {
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
