import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import ListItem from "../components/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import useAuth from "../auth/useAuth";

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();

  if (user.catdog == "Cat") {
    var imSource = require("../assets/catuser.png");
  } else {
    var imSource = require("../assets/doguser.png");
  }

  return (
    <Screen>
        <ScrollView>
            <View style={styles.container}>
                <ListItem title={user.name} subTitle={user.email} image={imSource} />
                <ListItem
                    title="Your Awarded Stars"
                    image={require("../assets/star.png")}
                    onPress={() => navigation.navigate("Awarded Stars")}
                />
                <ListItem
                    title="Leaderboard"
                    image={require("../assets/leaderboard.png")}
                    onPress={() => navigation.navigate("Leaderboard")}
                />
            </View>
            <View style={styles.container}>
                <ListItem
                    title="My Registered Questionnaires"
                    IconComponent={
                        <Icon
                            name="format-list-bulleted"
                            backgroundColor={colors.darkGreen}
                        />
                    }
                    onPress={() => navigation.navigate("Records")}
                />
                <ListItem
                    title="Stroop Game"
                    IconComponent={
                        <Icon name="download-box" backgroundColor={colors.primary} />
                    }
                    onPress={() => navigation.navigate("Stroop")}
                />
            </View>
            <View style={styles.container}>
                <ListItem
                    title="My Questionnaire"
                    IconComponent={
                        <Icon
                            name="head-question-outline"
                            backgroundColor={colors.primary}
                        />
                    }
                    onPress={() => navigation.navigate("My Questionnaire")}
                />
                <ListItem
                    title="My Messages"
                    IconComponent={
                        <Icon name="email" backgroundColor={colors.secondary} />
                    }
                    onPress={() => navigation.navigate("My Messages")}
                />
            </View>
            <ListItem
                title="Downloads"
                IconComponent={
                    <Icon name="download-box" backgroundColor={colors.primary} />
                }
                onPress={() => navigation.navigate("Downloads")}
            />
            <View style={styles.container}>
                <ListItem
                    title="Log Out"
                    IconComponent={<Icon name="logout" backgroundColor="#ffe66d"/>}
                    onPress={() => logOut()}
                />
            </View>
        </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
});

export default AccountScreen;
