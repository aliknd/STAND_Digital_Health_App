import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";

function ListingDetailsScreen({ route }) {
  const listing = route.params;
  console.log(listing);
  return (
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
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  explanation: {
    backgroundColor: colors.lightGreen,
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  titleContainer: {
    backgroundColor: colors.darkGreen,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default ListingDetailsScreen;
