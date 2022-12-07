import React, { useState } from "react";
import * as Yup from "yup";

import { AppFormText, AppForm, SubmitButton } from "../components/forms";
import AppFormPicker from "../components/forms/AppFormPicker";
import AppFormImagePicker from "../components/forms/AppFormImagePicker";
import { ScrollView, StyleSheet, Alert, Image } from "react-native";
import listingsApi from "../api/listings";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  images: Yup.array().min(1, "Please select at least one image."),
  category: Yup.object().required().nullable().label("Category"),
});

const tiredCategories = [
  { label: "Even my tiredness is tired!", value: 1 },
  { label: "A little bit!", value: 2 },
  { label: "Nah, I’m A-Okayyy!", value: 3 },
];

function QuestionnaireScreen({ navigation }) {
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
            category: null,
            images: [],
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormText>Hey, feel burned out today?</AppFormText>
          <Image
            style={{ position: "relative", width: 360, height: 300 }}
            source={require("../assets/animations/giphy.gif")}
          />
          <AppFormPicker
            items={tiredCategories}
            placeholder="Category"
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
  },
});
