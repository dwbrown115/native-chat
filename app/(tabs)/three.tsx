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

import { handleSearch } from "@/helpers";

export default function TabThreeScreen() {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  async function search() {
    handleSearch("", "users")
      .then((results) => {
        // console.log(results);
        setSearchResults(results);
      })
      .catch((e) => {
        console.log(e);
      });
    //  console.log(results)
    //  setSearchResults([results])
    // await fetch(searchKey, )
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Tab Three</Text>
        <Pressable onPress={search} style={styles.button}>
          <Text style={{ color: "white" }}>Search</Text>
        </Pressable>
        {/* <Text style={{ margin: 5 }}>{JSON.stringify(searchResults)}</Text> */}
        {searchResults.map((result) => {
          return (
            <View
              style={{ display: "flex", flexDirection: "row" }}
              key={result.objectID}
            >
              <Image
                source={{ uri: result.profilePicture }}
                style={{ width: 50, height: 50 }}
                alt="profilePicture.jpg"
              />
              <View>
                <Text>Username: {result.username}</Text>
                <Text>UserID: {result.userId}</Text>
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
