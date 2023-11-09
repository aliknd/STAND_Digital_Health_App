import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Guidance" component={ListingsScreen} />
    <Stack.Screen
      name="Guidance Details"
      component={ListingDetailsScreen}
      options={{ presentation: "modal" }}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
