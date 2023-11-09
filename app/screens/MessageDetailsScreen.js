import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";

function ListingDetailsScreen({ route }) {
  const listing = route.params;
  console.log(listing);
  return (
    <Screen>
      <ScrollView>
        <View>
          <View style={styles.detailsContainer}>
            <View style={styles.titleContainer}>
              <AppText style={styles.title}>{listing.title}</AppText>
            </View>
            <AppText style={styles.explanation}>{listing.explanation}</AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  explanation: {
    backgroundColor: colors.secondary,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    color: colors.white,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },
  titleContainer: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default ListingDetailsScreen;
