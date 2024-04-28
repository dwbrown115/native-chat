import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageInput({ exportImages }: any) {
  const [images, setImages] = useState<any>([]);

  async function handleImageInput() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.All,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        // Extract URIs from the result.assets array
        const image = result.assets.map((asset) => asset.uri);
        setImages((prevImages: any) => [...prevImages, ...image]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  exportImages(images);

  return (
    <View>
      <Pressable onPress={() => handleImageInput()}>
        <Text style={styles.button}>Select Image</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 5,
    backgroundColor: "#2196f3",
    color: "white",
    alignItems: "center",
    padding: 8,
    fontFamily: "sans-serif",
    fontWeight: "600",
    borderRadius: 2,
    textTransform: "uppercase",
    fontSize: 14,
    letterSpacing: 0.4,
  },
});
