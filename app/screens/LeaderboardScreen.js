import React, { useEffect, useState } from "react";
import {FlatList, StyleSheet, Text} from "react-native";
import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import Leaderboard from "../components/Leaderboard";
import colors from "../config/colors";


function LeaderboardScreen() {

  useEffect(() => {
  }, []);

  return (
    <Screen>
      <Leaderboard/>
    </Screen>
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
export default LeaderboardScreen;
