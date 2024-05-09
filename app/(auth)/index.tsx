import { useEffect, useState } from "react";
import { router } from "expo-router";
import { TextInput, Pressable, View, Text } from "react-native";
import { getAuth } from "firebase/auth";

import { signIn } from "@/firebase";
import AuthStyles from "./authStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  async function handleLogin() {
    // console.log("Login");
    try {
      const result = await signIn(email, password);
      // console.log(result);
      // router.push("/one");
      router.push("/one");
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      // setError(error);
      console.log(error);
    }
  }
  function handleSignup() {
    // console.log("Signup");
    router.push("/signup");
    // console.log(AuthStyles);
  }

  function handleSecureTextEntry() {
    setSecureTextEntry(!secureTextEntry);
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/one");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={AuthStyles.container}>
      <Text style={AuthStyles.title}>Login</Text>
      <TextInput
        style={AuthStyles.input}
        placeholder="Email:"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <View style={AuthStyles.wrapper}>
        <TextInput
          secureTextEntry={secureTextEntry}
          style={AuthStyles.input}
          placeholder="Password:"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
        <Pressable style={AuthStyles.show} onPress={handleSecureTextEntry}>
          <Text selectable={false}>Show</Text>
        </Pressable>
      </View>
      <View style={AuthStyles.wrapper}>
        <Pressable onPress={handleLogin} style={AuthStyles.button}>
          <Text style={{ color: "white" }}>Login</Text>
        </Pressable>
        <Pressable onPress={handleSignup} style={AuthStyles.button}>
          <Text style={{ color: "white" }}>Signup</Text>
        </Pressable>
      </View>
      <Text style={AuthStyles.error}>{error}</Text>
    </View>
  );
}
