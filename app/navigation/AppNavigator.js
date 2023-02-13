import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import AccountScreen from "../screens/AccountScreen";
import RecordNavigator from "./RecordNavigator";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import FeedNavigator from "./FeedNavigator";
import NewListingButton from "./NewListingButton";
import expoPushTokensApi from "../api/expoPushTokens";
import navigation from "./rootNavigation";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  useEffect(() => {
    registerForPushNotifications();
    Notifications.addPushTokenListener((notification) =>
      navigation.navigate("Questionnaire")
    );
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) return;
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      expoPushTokensApi.register(token);
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="My Account"
        component={RecordNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Questionnaires"
        component={FeedNavigator}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate("Questionnaires")}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Questionnaire"
        component={QuestionnaireScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="beaker-question"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;

// const screenOptions = {
//   tabBarStyle: {
//     backgroundColor: "#76d6cb",
//   },
// };
