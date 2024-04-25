import React, {useEffect, useState} from "react";
import {createStackNavigator} from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import RecordScreen from "../screens/RecordScreen";
import QuestionnaireScreen from "../screens/QuestionnaireScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MessageDetailsScreen from "../screens/MessageDetailsScreen";
import DownloadScreen from "../screens/DownloadScreen";
import GameScreen1 from '../screens/StroopScreen';
import LeaderboardScreen from "../screens/LeaderboardScreen";
import AwardedStarsScreen from "../screens/AwardedStarsScreen";
import {createContext} from 'react';
import StarsScreen from "../screens/AwardedStarsScreen";
import GameScreen2 from '../screens/SequenceScreen';

const StarContext = createContext(false);
const Stack = createStackNavigator();
const RecordNavigator = () => {
    const [numTimesPlayed, setNumTimesPlayed] = useState(0);

    // Function to reset numTimesPlayed at the end of each day
    const resetAtEndOfDay = () => {
        // Get the current date and time
        const currentDate = new Date();

        // Get the time until the end of the day (in milliseconds)
        const millisecondsUntilEndOfDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1, // Go to the next day
            0, 0, 0 // Set time to midnight
        ) - currentDate;

        // Schedule the reset of the variable at the end of the day
        const resetTimeout = setTimeout(() => {
            // Reset the variable to 0
            setNumTimesPlayed(0);
        }, millisecondsUntilEndOfDay);

        // Clear the timeout when the component unmounts
        return () => clearTimeout(resetTimeout);
    };

    useEffect(() => {
        resetAtEndOfDay()
    }, [numTimesPlayed])

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Account"
                component={AccountScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen name="Records" component={RecordScreen}/>
            <Stack.Screen name="Downloads" component={DownloadScreen}/>
            <Stack.Screen name="Stroop">
                {props => <GameScreen1 {...props} numTimesPlayed={numTimesPlayed}
                                       setNumTimesPlayed={setNumTimesPlayed}/>}
            </Stack.Screen>
            <Stack.Screen name="Sequence" component={GameScreen2} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen}/>
            <Stack.Screen name="Awarded Stars">
                {props => <StarsScreen {...props} numTimesPlayed={numTimesPlayed}/>}
            </Stack.Screen>
            <Stack.Screen
                name="My Questionnaire"
                component={QuestionnaireScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen name="My Messages" component={MessagesScreen}/>
            <Stack.Screen name="Message Details" component={MessageDetailsScreen}/>
        </Stack.Navigator>);
};

export default RecordNavigator;
