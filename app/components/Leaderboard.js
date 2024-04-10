import React, {useEffect, useState} from "react";
import {View, StyleSheet, FlatList} from "react-native";
import LeaderboardListItem from "./LeaderbordListItem";
import TopLeaderboardListItem from "./TopLeaderboardListItem";
import colors from "../config/colors";
import endpointURL from "../api/serverPoint";

function Leaderboard() {
  const [data, setData] = useState([]);
  const [gotRes, setGotRes] = useState(false)
  const getUsers = async () => {
    try {
      const response = await fetch(endpointURL + "/users");
      const json = await response.json();
      setData(json);
      setGotRes(true);
    } catch (error) {
      console.error(error);
    }
  };
  const sortedData = data.sort((a, b) => b.highScore - a.highScore);
  const top3 = sortedData.slice(0,3);
  const notTop3 = sortedData.slice(3, sortedData.length);

  useEffect(() => {
      getUsers();
  }, []);

  if (gotRes) {
      return (
          <View>
              <View style={styles.container}>
                  <TopLeaderboardListItem
                      name={top3[1].name}
                      image={top3[1].catdog.toLowerCase() === 'dog' ? require("..//assets/doguser.png") : require("..//assets/catuser.png")}
                      score={top3[1].highScore}
                      medal={require("..//assets/2ndplace.png")}
                      bgdcolor={"#b5c0c0"}
                      size={80}
                  />
                  <TopLeaderboardListItem
                      name={top3[0].name}
                      image={top3[0].catdog.toLowerCase() === 'dog' ? require("..//assets/doguser.png") : require("..//assets/catuser.png")}
                      score={top3[0].highScore}
                      medal={require("..//assets/1stplace.png")}
                      bgdcolor={"#f3c515"}
                      size={90}
                  />
                  <TopLeaderboardListItem
                      name={top3[2].name}
                      image={top3[2].catdog.toLowerCase() === 'dog' ? require("..//assets/doguser.png") : require("..//assets/catuser.png")}
                      score={top3[2].highScore}
                      medal={require("..//assets/3rdplace.png")}
                      bgdcolor={"#e77e23"}
                      size={70}
                  />
              </View>

              <FlatList
                  data={notTop3}
                  renderItem={({ item, index }) => (
                      <LeaderboardListItem
                          name={item.name}
                          image={item.catdog.toLowerCase() === 'dog' ? require("..//assets/doguser.png") : require("..//assets/catuser.png")}
                          score={item.highScore}
                          rank={index + 4}
                      />
                  )}
              />
          </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Display items in a row horizontally
    justifyContent: 'space-around',
    alignItems: 'center', // Center items vertically
    backgroundColor: colors.bglight,
  },
    place1: {
        size: 40,
    }

});

export default Leaderboard;
