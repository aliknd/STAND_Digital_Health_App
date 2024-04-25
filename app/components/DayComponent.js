import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function DayComponent({day, checked}) {
  return (
      <View style={styles.container}>
          <Text style={styles.day}>{day}</Text>
          <View style={styles.starsContainer}>
              {checked ? <Image style={styles.image} source={require("../assets/green_check.png")}/> : <Image style={styles.image} source={require("../assets/blank_circle.png")}/>}
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: colors.bglight,
        borderRadius: 30,
        padding: 10,
    },
    day: {
        fontSize: 13,
        color: colors.brown,
        fontWeight: "bold",
        paddingTop: 7
    },
    numStars: {
        fontSize: 22,
        color: colors.white,
        paddingRight: 10,
    },
    image: {
        height: 20,
        width: 20,
    },
    starsContainer: {
        padding: 20,
        alignItems: 'flex-stretch', // Center items vertically
        flexDirection: 'row', // Display items in a row horizontally
    }
});

export default DayComponent;
