import { initializeApp, getApps } from "firebase/app";
import {
  EXPO_FIREBASE_API_KEY,
  EXPO_FIREBASE_AUTH_DOMAIN,
  EXPO_FIREBASE_APP_ID,
  EXPO_FIREBASE_PROJECT_ID,
  EXPO_FIREBASE_STORAGE_BUCKET,
  EXPO_FIREBASE_MEASUREMENT_ID,
  EXPO_FIREBASE_MESSAGING_SENDER_ID,
} from "@env";

const firebaseConfig = {
  apiKey: EXPO_FIREBASE_API_KEY,
  authDomain: EXPO_FIREBASE_AUTH_DOMAIN,
  projectId: EXPO_FIREBASE_PROJECT_ID,
  storageBucket: EXPO_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_FIREBASE_MESSAGING_SENDER_ID,
  appId: EXPO_FIREBASE_APP_ID,
  measurementId: EXPO_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
