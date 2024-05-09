import React, { useState } from "react";
import { TextInput, KeyboardAvoidingView } from "react-native";

export default function MobileTextInput({ exportText }: any) {
//   const [text, setText] = useState("");

  return (
    <KeyboardAvoidingView>
      <TextInput
        multiline
        placeholder="Type your message here..."
        // style={{
        //   height: 40,
        //   borderColor: "gray",
        //   borderWidth: 1,
        //   margin: 10,
        //   padding: 10,
        // }}
        style={{ height: 150, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => exportText(text)}
      />
    </KeyboardAvoidingView>
  );
}
