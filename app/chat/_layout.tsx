import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useLocalSearchParams, router } from "expo-router";
import { Pressable, Text, Image } from "react-native";
import { getAuth } from "firebase/auth";

import { findObjectByValue } from "@/helpers";
import { getData } from "@/firebase";
import { set } from "firebase/database";

function AuthBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function ChatLayout() {
  const auth = getAuth();

  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState("");

  async function grabUser(id: string) {
    const user = await getData("Users", id);
    return user;
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await grabUser(user.uid);
        const friend = await findObjectByValue(data?.friends, id);
        // console.log(friend);

        setTitle(friend.username);
      }
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: "none",
        },
      }}
    >
      <Tabs.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: `${title}`,
          headerLeft: () => (
            <Pressable
              style={{ marginHorizontal: 15, marginVertical: 3 }}
              onPress={() => router.push("/friends")}
            >
              {/* <Text style={{ color: "blue", marginLeft: 10 }}>Back</Text> */}
              <Image
                style={{ height: 24, width: 24 }}
                source={require("../../assets/images/back.png")}
              />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
