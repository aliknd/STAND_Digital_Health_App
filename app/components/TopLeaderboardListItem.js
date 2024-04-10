import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function TopLeaderboardListItem({ name, score, image, medal, bgdcolor, size}) {
  return (
      <View style={styles.container}>
          <View  style={{backgroundColor:bgdcolor, padding: 5}}>
              <Image source={image} style={{ width: size, height: size, borderRadius: 35,}}/>
              <Image source={medal} style={styles.medal}/>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.score}>{score}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: colors.bglight,
        paddingTop: 20,
    },
    name: {
        fontSize: 20,
        color: colors.brown,
        fontWeight: "bold",
        paddingTop: 7
    },
    score: {
        fontSize: 22,
        color: colors.white,
        paddingRight: 10,
    },
    rank: {
        fontSize: 30,
        fontWeight: "bold",
        color: colors.brown,
        paddingRight: 15,
    },
    imageContainer: {
        // borderWidth: 1,
        // borderRadius: 10,
        // padding: 5,
        // borderColor: colors.lightGray
    },
    medal: {
        position: 'absolute',
        left: -10,
        width: 40,
        height: 40,
    }
});

export default TopLeaderboardListItem;
