import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function LeaderboardListItem({ name, score, image, rank }) {
  return (
      <View style={styles.container}>
        <Text style={styles.rank} numberOfLines={1}>
          {rank}
        </Text>
        <Image style={styles.image} source={image} />
        <View style={styles.detailsContainer}>
          <AppText style={styles.name} numberOfLines={1}>
            {name}
          </AppText>
        </View>
        <AppText style={styles.score} numberOfLines={1}>
          {score}
        </AppText>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.bglight,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    fontWeight: "500",
    color: colors.white,
  },
  score: {
    fontWeight: "600",
    color: colors.white,
    paddingRight: 10,
  },
    rank: {
        fontSize: "30",
        fontWeight: "bold",
        color: colors.brown,
        paddingRight: 15,
    },
});

export default LeaderboardListItem;
