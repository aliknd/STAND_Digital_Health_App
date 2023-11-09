import React from "react";
import { Image, StyleSheet, Linking } from "react-native";
import AppButton from "../components/AppButton";

import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";

function DownloadScreen(props) {
  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/uhmlogo.jpg")} />
      <AppText style={styles.explanation}>
        There is no right or wrong way to feel during unprecedented times. Allow
        yourself to experience the emotions, but remind yourself that this is
        not forever. University of Hawai'i at Manoa has prepared a comprehensive
        guideline to help the patients dealing with mental issues. You can now
        download it from the link bellow!
      </AppText>
      <AppButton
        title="Download"
        onPress={() =>
          Linking.openURL(
            "https://research.hawaii.edu/orc/wp-content/uploads/sites/7/2021/12/mental-health-and-suicide-crisis.pdf"
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: "100%",
    height: 130,
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
  },
  explanation: {
    backgroundColor: colors.secondary,
    color: colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    textAlign: "justify",
  },
});

export default DownloadScreen;
