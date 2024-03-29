import React, {useEffect, useState} from "react";
import {View, StyleSheet, Image, TouchableHighlight, Text, FlatList} from "react-native";
import LeaderboardListItem from "./LeaderbordListItem";
import colors from "../config/colors";
import ListItem from "./ListItem";
import Icon from "./Icon";
import endpointURL from "../api/serverPoint";
import useAuth from "../auth/useAuth";

function Leaderboard() {
  const [data, setData] = useState([]);
  const getUsers = async () => {
    try {
      const response = await fetch(endpointURL + "/users");
      const json = await response.json();
      setData(json);
      console.log("fetched users");
    } catch (error) {
      console.error(error);
    }
  };
  const sortedData = data.sort((a, b) => b.highScore - a.highScore);

  useEffect(() => {
    getUsers();
  }, []);

  return (
      <FlatList
          data={sortedData}
          keyExtractor={(menuItem) => menuItem.id}
          renderItem={({ item, index }) => (
              <LeaderboardListItem
                  name={item.name}
                  image={item.catdog.toLowerCase() === 'dog' ? require("..//assets/doguser.png") : require("..//assets/catuser.png")}
                  score={item.highScore}
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
