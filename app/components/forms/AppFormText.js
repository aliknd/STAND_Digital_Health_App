import React from "react";
import { Text, StyleSheet, View } from "react-native";
import colors from "../../config/colors";

function AppFormText({ children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 15,
  },
  text: {
    marginLeft: 10,
    fontSize: 20,
    color: colors.white,
  },
});

export default AppFormText;
