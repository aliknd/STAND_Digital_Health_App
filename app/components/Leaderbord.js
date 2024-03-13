import React from "react";
import {View, StyleSheet, Image, TouchableHighlight, Text, FlatList} from "react-native";
import { Data } from '../../config/Database';
import LeaderboardListItem from "./LeaderbordListItem";
import colors from "../config/colors";
import ListItem from "./ListItem";
import Icon from "./Icon";

function Leaderboard() {
  const sortedData = Data.sort((a, b) => b.score - a.score);

  return (
      <FlatList
          data={sortedData}
          keyExtractor={(menuItem) => menuItem.id}
          renderItem={({ item }) => (
              <LeaderboardListItem
                  name={item.name}
                  image={item.image}
                  score={item.score}
              />
          )}
      />
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

export default Leaderboard;
