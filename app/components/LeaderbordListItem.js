import React from "react";
import { View, StyleSheet, Image } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function LeaderboardListItem({ name, score, image }) {
  return (
      <View style={styles.container}>
        <Image style={styles.image} source={image} />
        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={1}>
            {name}
          </AppText>
        </View>
        <AppText style={styles.title} numberOfLines={1}>
          {score}
        </AppText>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.bglight,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontWeight: "500",
    color: colors.white,
  },
  subTitle: {
    color: colors.white,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
});

export default LeaderboardListItem;
