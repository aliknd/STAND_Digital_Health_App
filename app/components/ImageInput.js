import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";

function ImageInput({ imageUri, onChangeImage }) {
  const requestPermissions = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert("You need to enable permissions for using the camera!");
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const handlePress = () => {
    if (!imageUri)
      // Alert.alert("Selecting Photo", "How to you want to upload the photo?", [
      //   { text: "From Camera", onPress: () => selectImageCamera() },
      //   { text: "From Library", onPress: () => selectImageLibrary() },
      // ]);
      selectImageCamera();
    else
      Alert.alert("Delete", "Do you want to delete this image?", [
        { text: "Yes", onPress: () => onChangeImage(null) },
        { text: "No" },
      ]);
  };

  // const selectImageLibrary = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       quality: 0.5,
  //     });
  //     if (!result.cancelled) onChangeImage(result.uri);
  //   } catch (error) {
  //     console.log("Error occured while reading the image!", error);
  //   }
  // };

  const selectImageCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
        base64: true,
        quality: 1,
      });
      if (!result.cancelled) onChangeImage(result.uri);
    } catch (error) {
      console.log("Error occured while reading the image!", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!imageUri && (
          <MaterialCommunityIcons
            color={colors.medium}
            name="camera"
            size={40}
          />
        )}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    height: 100,
    justifyContent: "center",
    overflow: "hidden",
    width: 100,
    marginVertical: 7,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageInput;
