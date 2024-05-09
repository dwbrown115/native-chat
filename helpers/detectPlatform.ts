import { Platform } from "react-native";

export default function detectPlatform() {
  let platform = null as string | null;

  if (Platform.OS === "web") {
    platform = "web";
  } else if (Platform.OS === "android" || Platform.OS === "ios") {
    platform = "mobile";
  }

  return platform;
}
