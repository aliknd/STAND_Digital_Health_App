import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";

import colors from "../config/colors";

function WelcomeScreen(props) {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text>Stress and Anxiety Detection</Text>
      </View>

      <View style={styles.loginButton}>
        <Text style={styles.textStyle}>Login</Text>
      </View>
      <View style={styles.registerButton}>
        <Text style={styles.textStyle}>Register</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    height: 70,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  logo: {
    width: 200,
    height: 120,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  registerButton: {
    width: "100%",
    height: 70,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
