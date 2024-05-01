import { useState, useEffect } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { Pressable, View, Text, StyleSheet } from "react-native";

import { firebase_app } from "@/firebase";

export default function VerifyEmailBar() {
  const auth = getAuth(firebase_app);
  const user = auth.currentUser;

  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.emailVerified === true) {
        setEmailVerified(true);
      }
    });
  }, [auth.currentUser]);

  async function handleSendEmailVerification() {
    try {
      if (user) {
        await sendEmailVerification(auth.currentUser);
        setEmailSent("Email sent!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      {emailVerified ? (
        <Text />
      ) : (
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <Text style={styles.text1}>Please verify your email address</Text>
            <Text style={styles.text}>
              We have sent you an email that contains a link - you must click
              this link to verify your email address.
            </Text>
          </View>
          <View style={styles.wrapper2}>
            <Text style={styles.text1}>
              If you have not received an email, please check your spam folder,
              or{" "}
            </Text>
            <Pressable
              style={styles.button}
              onPress={handleSendEmailVerification}
            >
              <Text style={styles.text}>press here to resend</Text>
            </Pressable>
          </View>
          <Text>{emailSent}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgb(254 249 195)",
    padding: 10,
    // borderWidth: 1,
  },
  wrapper: {
    // flex: 1,
    // display: "flex",
    flexDirection: "column",
    // padding: 5,
    // marginTop: 5,
    // margin: 5,
    alignItems: "center",
    marginLeft: "5%",
  },
  wrapper2: {
    // flex: 1,
    // display: "flex",
    flexDirection: "row",
    // padding: 5,
    // marginTop: 5,
    // margin: 5,
    alignItems: "center",
    marginRight: "0%",
  },
  text1: {
    // fontSize: 20,
    fontWeight: "bold",
    color: "rgb(161 98 7)",
  },
  button: {
    // backgroundColor: "blue",
    // padding: 10,
    // borderRadius: 5,
  },
  text: {
    color: "rgb(161 98 7)",
  },
});
