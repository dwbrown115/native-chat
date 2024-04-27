import { StyleSheet, TextInput, Pressable, View, Text } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          padding: 5,
          margin: 5,
        }}
        placeholder="Enter email"
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          padding: 5,
          margin: 5,
        }}
        placeholder="Enter password"
      />
      <Pressable style={styles.button}>
        <Text style={{ color: "white" }}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
});
