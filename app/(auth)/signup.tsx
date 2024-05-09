import { useEffect, useState } from "react";
import { TextInput, Pressable, View, Text } from "react-native";
import { router } from "expo-router";

import { FIREBASE_API_KEY } from "../../config";
import { signUp } from "@/firebase";
import { isPasswordValid } from "@/helpers";

import AuthStyles from "./authStyles";
import { set } from "firebase/database";

export default function SignUpScreen() {
  const api_key = process.env.EXPO_FIREBASE_API_KEY;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);

  async function handleSignup() {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      if (isPasswordValid(password)) {
        const time = Date().toLocaleString();
        const user = {
          email,
          username,
          accountCreated: time,
          chatRooms: [],
        };
        const result = await signUp(email, password, user);
        router.push("/one");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setError("");
      } else {
        setError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and 1 special character."
        );
      }
    }
  }

  function handleLogin() {
    // console.log("Login");
    router.push("/");
    // console.log(AuthStyles);
  }

  function handleSecureTextEntry1() {
    setSecureTextEntry1(!secureTextEntry1);
  }

  function handleSecureTextEntry2() {
    setSecureTextEntry2(!secureTextEntry2);
  }

  async function handleTest() {
    console.log(FIREBASE_API_KEY);
    // console.log(process.env.EXPO_FIREBASE_API_KEY);
    // await fetch(api_key)
  }

  return (
    <View style={AuthStyles.container}>
      <Text style={AuthStyles.title}>Create Account</Text>
      <TextInput
        style={AuthStyles.input}
        placeholder="Email:"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <TextInput
        style={AuthStyles.input}
        placeholder="Username:"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
        }}
      />
      <View style={AuthStyles.wrapper}>
        <TextInput
          secureTextEntry={secureTextEntry1}
          style={AuthStyles.input}
          placeholder="Password:"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
        <Pressable style={AuthStyles.show} onPress={handleSecureTextEntry1}>
          <Text selectable={false}>Show</Text>
        </Pressable>
      </View>
      <View style={AuthStyles.wrapper}>
        <TextInput
          secureTextEntry={secureTextEntry2}
          style={AuthStyles.input}
          placeholder="Confirm password:"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
          }}
        />
        <Pressable style={AuthStyles.show} onPress={handleSecureTextEntry2}>
          <Text selectable={false}>Show</Text>
        </Pressable>
      </View>
      <View style={AuthStyles.wrapper}>
        <Pressable onPress={handleSignup} style={AuthStyles.button}>
          <Text style={{ color: "white" }}>Signup</Text>
        </Pressable>
        <Pressable onPress={handleLogin} style={AuthStyles.button}>
          <Text style={{ color: "white" }}>Login</Text>
        </Pressable>
      </View>
      <Text style={AuthStyles.error}>{error}</Text>
      <Pressable onPress={handleTest} style={AuthStyles.button}>
        <Text style={{ color: "white" }}>Test</Text>
      </Pressable>
    </View>
  );
}
