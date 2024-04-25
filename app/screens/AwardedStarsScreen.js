import React, { useEffect, useState } from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import DayComponent from "../components/DayComponent";

function StarsScreen( {numTimesPlayed }  ) {
    const { user } = useAuth();
    const header = "Weekly Activity";
    const header2 = "Daily Bonus Star";
    const bodyText = ' If you play a game daily for an entire week consecutively you earn one star for the week!';
    const bodyText2 = `Every 4 times you play a game, you will receive a bonus star!`;
    const [data, setData] = useState([]);
    const [gotRes, setGotRes] = useState(false)
    const fetchedUser = data.find(obj => obj.id === user.userId);
    const [dayData, setDayData] = useState(
        [
            { day: 'Sunday', checked: false },
            { day: 'Monday', checked: false  },
            { day: 'Tuesday', checked: false  },
            { day: 'Wednesday', checked: false },
            { day: 'Thursday', checked: false  },
            { day: 'Friday', checked: false },
            { day: 'Saturday', checked: false },
        ]
    )
    // const updateStarsApi = useApi(starsApi.updateStars);
    //
    // // const updateStars = async (id, stars) => {
    // //     await updateStarsApi.request(id, stars);
    // // }

    const getStarsData = async () => {
        try {
            const response = await fetch(endpointURL + "/timesplayedupdate");
            const json = await response.json();
            setData(json);
            setGotRes(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStarsData();
        const currentDate = new Date();
        if (numTimesPlayed >= 1) {
            const updatedDayData = [...dayData]; // Create a copy of the dayData array
            updatedDayData[currentDate.getDay()].checked = true; // Update the copy
            setDayData(updatedDayData);
        }
    }, [numTimesPlayed]);


    if(gotRes) {
        const dayData1 = dayData.slice(0,4);
        const dayData2 = dayData.slice(4,7);
        return (
            <Screen>
                <View style={styles.starContainer}>
                    <Text style={styles.goldText}>
                        {"Your Stars: "}
                    </Text>
                    <Image style={styles.image} source={require("../assets/golden_star.png")}/>
                    <Text style={styles.goldText}>
                        {fetchedUser.totalStars.toString()}
                    </Text>
                </View>

                <View style={styles.container}>
                    <Text style={styles.header}>
                        {header}
                    </Text>
                    <Text style={styles.baseText}>
                        {bodyText}
                    </Text>
                </View>

                <View style={styles.dailyContainer}>
                    {dayData1.map(item => (
                    <DayComponent key={item.day} day={item.day} checked={item.checked}/>))}
                </View>
                <View style={styles.dailyContainer}>
                    {dayData2.map(item => (
                        <DayComponent key={item.day} day={item.day} checked={item.checked}/>))}
                </View>

                <View style={styles.container}>
                    <Text style={styles.header}>
                        {header2}
                    </Text>
                    <Text style={styles.baseText}>
                        {bodyText2}
                    </Text>

                    {fetchedUser.timesPlayed == 4 ? <View style={styles.container}>
                        <Text style={styles.obtainedStar}>
                            {'Obtained Daily Star! Play more to earn another!'}
                        </Text>
                    </View> : <View style={styles.container}>
                        <Text style={styles.obtainedStar}>
                            {'Play '+ (4 - fetchedUser.timesPlayed) + ' more times to get a bonus star!'}
                        </Text>
                    </View>}
                </View>
            </Screen>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        alignItems: 'center', // Center items vertically
        backgroundColor: colors.secondary,
        padding: 10,
    },
    baseText: {
        fontSize: 15,
        fontFamily: "Verdana",
        color: colors.lightGray,
        padding: 10,
        textAlign: 'center',
    },
    header: {
        fontSize: 20,
        fontFamily: "Helvetica",
        color: colors.lightGray,
        paddingTop: 10
    },
    image: {
        height: 30,
        width: 30,
    },
    goldText: {
        color: colors.gold,
        paddingLeft: 10,
        fontWeight: "bold",
        fontSize: 25,
    },
    starContainer: {
        justifyContent: 'center',
        alignItems: 'flex-stretch', // Center items vertically
        flexDirection: 'row', // Display items in a row horizontally
        padding: 20,
    },
    dailyContainer: {
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'flex-stretch', // Center items vertically
        flexDirection: 'row', // Display items in a row horizontally
        padding: 10,
    },
    obtainedStar: {
        fontSize: 20,
        color: colors.brown,
        padding: 15,
        backgroundColor: colors.bglight,
        flexDirection: 'row', // Display items in a row horizontally
        textAlign: 'center',
    },
});
export default StarsScreen;
