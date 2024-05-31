import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageInput({ exportImages, allowMultiple }: any ) {
  // const [images, setImages] = useState<any>([]);

  useEffect(() => {
    // setImages([]);
    console.log(allowMultiple, "allowMultiple")
  }, []);

  // useEffect(() => {
  //   console.log("Image Input:", images);
  // }, [images]);

  async function handleImageInput() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.All,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: allowMultiple,
      });

      if (!result.canceled) {
        // Extract URIs from the result.assets array
        const ImageArray: any = [];
        result.assets.map((asset) => ImageArray.push(asset.uri));
        exportImages(ImageArray);
        // setImages((prevImages: any) => [...prevImages, ...image]);
        // return image;
        // exportImages(image);
      }
    } catch (error) {
      console.error(error);
    }
    // exportImageArray();
  }

  async function exportImageArray() {
    // console.log("Exporting Images:", images);
    // const ima
    // exportImages(images);
  }

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
