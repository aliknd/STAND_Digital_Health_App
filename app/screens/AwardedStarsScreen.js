import React, { useEffect, useState } from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";
import DayComponent from "../components/DayComponent";

function StarsScreen() {
    const { user } = useAuth();
    const header = "Weekly Activity";
    const header2 = "Daily Bonus Star";
    const bodyText = ' If you play a game daily for an entire week consecutively you earn one star for the week!';
    const bodyText2 = `Every 4 times you play a game, you will receive a bonus star!`;
    const [data, setData] = useState([]);
    const [dayData1, setDayData1] = useState([]);
    const [dayData2, setDayData2] = useState([]);
    const [gotRes, setGotRes] = useState(false)
    let [dayData, setDayData] = useState(
        [
            { day: 'sunday', checked: false },
            { day: 'monday', checked: false  },
            { day: 'tuesday', checked: false  },
            { day: 'wednesday', checked: false },
            { day: 'thursday', checked: false  },
            { day: 'friday', checked: false },
            { day: 'saturday', checked: false },
        ]); 
    const [fetchedUserData, setFetchedUserData] = useState(null);

    const getStarsData = async () => {
        try {
            const response = await fetch(endpointURL + "/timesplayedupdate");
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        }
    };

    const updateDays = (userData) => {
        const updatedDayData = dayData = dayData.map(item => {
            if (userData[item.day] >= 1) {
                return { ...item, checked: true };
            }
            return item;
        });
        setDayData(updatedDayData);
    };

    useEffect(() => {
        getStarsData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const userData = data.find(obj => obj.id === user.userId);
            setFetchedUserData(userData);
            updateDays(userData);
            setGotRes(true);
        }
    }, [data]);

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
                        {fetchedUserData.totalStars.toString()}
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
                    {fetchedUserData.timesPlayed == 4 ? <View style={styles.container}>
                        <Text style={styles.obtainedStar}>
                            {'Obtained Daily Star! Play more to earn another!'}
                        </Text>
                    </View> : <View style={styles.container}>
                        <Text style={styles.obtainedStar}>
                            {'Play '+ (4 - fetchedUserData.timesPlayed) + ' more times to get a bonus star!'}
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