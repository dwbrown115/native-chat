import { useEffect, useState } from "react";
import { TextInput, Pressable, View, Text } from "react-native";
import { router } from "expo-router";

import { signUp } from "@/firebase";
import { isPasswordValid, useEnterKeyPress } from "@/helpers";

import AuthStyles from "./authStyles";

export default function SignUpScreen() {
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
          profilePicture:
            "https://firebasestorage.googleapis.com/v0/b/native-chat-faa01.appspot.com/o/6525a08f1df98a2e3a545fe2ace4be47.jpg?alt=media&token=6fb35fea-8e2e-44f7-9d4d-f9bb214d754c",
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

  // useEnterKeyPress(() => {
  //   // handleSignup();
  // });

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
    </View>
  );
}
