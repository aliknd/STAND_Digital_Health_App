import React, { useEffect, useState } from "react";
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import Screen from "../components/Screen";
import Leaderboard from "../components/Leaderboard";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import endpointURL from "../api/serverPoint";

function StarsScreen() {
    const header = "How to Get Stars:";
    const bodyText = 'You receive one star each time you play a game! \nYou also can get an increasing amount of stars for consecutive days of login!';
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [gotRes, setGotRes] = useState(false)
    // const [fetchedUser, setFetchedUser] = useState({});
    const fetchedUser = data.find(obj => obj.id === user.userId);

    const getUsers = async () => {
        try {
            const response = await fetch(endpointURL + "/users");
            const json = await response.json();
            setData(json);
            setGotRes(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    if(gotRes) {
        return (
            <Screen>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        {header}
                    </Text>
                    <Text style={styles.baseText}>
                        {bodyText}
                    </Text>
                </View>

                <View style={styles.starContainer}>
                    <Image style={styles.image} source={require("../assets/golden_star.png")}/>
                    <Text style={styles.goldText}>
                        {fetchedUser.badge.toString()}
                    </Text>
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
    },
    baseText: {
        fontSize: 15,
        fontFamily: "Verdana",
        color: colors.lightGray,
        padding: 10
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
        padding: 10,
    }
});
export default StarsScreen;
