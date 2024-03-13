import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import RecordScreen from "../screens/RecordScreen";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MessageDetailsScreen from "../screens/MessageDetailsScreen";
import DownloadScreen from "../screens/DownloadScreen";
import GameScreen1 from '../screens/StroopScreen';
import LeaderboardScreen from "../screens/LeaderboardScreen";

const Stack = createStackNavigator();

const RecordNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Records" component={RecordScreen} />
    <Stack.Screen name="Downloads" component={DownloadScreen} />
    <Stack.Screen name="Stroop" component={GameScreen1} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Stack.Screen
      name="My Questionnaire"
      component={QuestionnaireScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="My Messages" component={MessagesScreen} />
    <Stack.Screen name="Message Details" component={MessageDetailsScreen} />
  </Stack.Navigator>
);

export default RecordNavigator;
