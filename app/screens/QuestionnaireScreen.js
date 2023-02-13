import React, { useState, useEffect } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import AppFormPicker from "../components/forms/AppFormPicker";
import AppFormImagePicker from "../components/forms/AppFormImagePicker";
import { ScrollView, StyleSheet, Alert, Image, Text, View } from "react-native";
import listingsApi from "../api/listings";
import questionsApi from "../api/questions";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import AppActivityIndicator from "../components/AppActivityIndicator";
import { Field } from "formik";
import { TextInput } from "react-native-gesture-handler";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";
import endpointURL from "../api/serverPoint";

const validationSchema = Yup.object().shape({
  images: Yup.array().min(1, "Please select at least one image."),
  category: Yup.object().required().nullable().label("Category"),
});

const intensityLevels = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
];

function QuestionnaireScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getQuestions = async () => {
    try {
      const response = await fetch(endpointURL + "/questions");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const { user } = useAuth();
  var hours = new Date().getHours();
  if (hours > 10 && hours <= 12) {
    var finalId = 0;
    if (user.catdog == "cat") {
      var imSource = require("../assets/animations/cat/cattired.gif");
    } else {
      var imSource = require("../assets/animations/dog/dogtired.gif");
    }
  } else if (hours > 12 && hours <= 15) {
    var finalId = 1;
    if (user.catdog == "cat") {
      var imSource = require("../assets/animations/cat/catfocus.gif");
    } else {
      var imSource = require("../assets/animations/dog/dogfocus.gif");
    }
  } else if (hours > 15 && hours <= 18) {
    var finalId = 2;
    if (user.catdog == "cat") {
      var imSource = require("../assets/animations/cat/catsleep.gif");
    } else {
      var imSource = require("../assets/animations/dog/dogsleep.gif");
    }
  } else if (hours > 18 && hours <= 21) {
    var finalId = 3;
    if (user.catdog == "cat") {
      var imSource = require("../assets/animations/cat/catpain.gif");
    } else {
      var imSource = require("../assets/animations/dog/dogpain.gif");
    }
  } else {
    var finalId = 4;
    if (user.catdog == "cat") {
      var imSource = require("../assets/animations/cat/catstress.gif");
    } else {
      var imSource = require("../assets/animations/dog/dogstress.gif");
    }
  }

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const navPage = () => {
    navigation.navigate("Questionnaires");
  };
  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing({ ...listing }, (progress) =>
      setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      return Alert.alert("Could not save the listing");
    }
    navPage();
    resetForm();
  };

  return (
    <ScrollView>
      <Screen style={styles.container}>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <AppForm
          initialValues={{
            cquestion: isLoading ? 404 : data[finalId].id,
            category: null,
            images: [],
            cuser: user.userId,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <AppFormText name="hcquestion">{data[finalId].quest}</AppFormText>
          )}

          <Image
            style={{
              width: "100%",
              height: 300,
              borderRadius: 30,
              overlayColor: colors.lightGreen,
              overflow: "hidden",
              marginVertical: 25,
            }}
            source={imSource}
          />

          <AppFormPicker
            items={intensityLevels}
            placeholder="Answer"
            icon="paw"
            name="category"
          />
          <AppFormImagePicker name="images" />
          <SubmitButton title="Post" />
        </AppForm>
      </Screen>
    </ScrollView>
  );
}
export default QuestionnaireScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.lightGreen,
  },
});
