import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function chatroom() {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log("Enter key pressed globally!");
        // Your custom logic here
      }
    };
    
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  return (
    <View>
      <Text>chatroom {id}</Text>
    </View>
  );
}
