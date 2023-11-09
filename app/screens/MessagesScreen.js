import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import ListItem from "../components/ListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";
import endpointURL from "../api/serverPoint";

function MessagesScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getRecords = async () => {
    try {
      const response = await fetch(endpointURL + "/gmessages");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  const { user } = useAuth();
  if (user.catdog == "Cat") {
    var imSource = require("../assets/catadmin.jpg");
  } else {
    var imSource = require("../assets/dogadmin.jpg");
  }

  return (
    <Screen>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(message) => message.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              subTitle={item.description}
              image={imSource}
              onPress={() => navigation.navigate(routes.MESSAGE_DETAILS, item)}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
        />
      )}
    </Screen>
  );
}

export default MessagesScreen;
