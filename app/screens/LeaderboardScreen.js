import React, { useEffect, useState } from "react";
import {FlatList, StyleSheet, Text} from "react-native";
import Screen from "../components/Screen";
import Leaderboard from "../components/Leaderboard";
import colors from "../config/colors";


function LeaderboardScreen() {

  // useEffect(() => {
  // }, []);

  return (
    <Screen>
      <Leaderboard/>
    </Screen>
  );
}

const styles = StyleSheet.create({

});
export default LeaderboardScreen;
