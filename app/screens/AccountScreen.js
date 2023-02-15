import React from "react";
import { StyleSheet, View, FlatList } from "react-native";

import ListItem from "../components/ListItem";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeparator from "../components/ListItemSeparator";
import useAuth from "../auth/useAuth";

const menuItems = [
  {
    title: "My Questionnaire",
    icon: {
      name: "head-question-outline",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();

  if (user.catdog == "cat") {
    var imSource = require("../assets/catuser.png");
  } else {
    var imSource = require("../assets/doguser.png");
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem title={user.name} subTitle={user.email} image={imSource} />
        <ListItem
          title="Your Awarded Stars:"
          subTitle={user.badge.toString()}
          image={require("../assets/star.png")}
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
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.title)}
            />
          )}
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
          IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
          onPress={() => logOut()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.lightGreen,
  },
});

export default AccountScreen;
