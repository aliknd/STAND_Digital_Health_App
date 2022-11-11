import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";

import * as Yup from "yup";
import colors from "../config/colors";
import Screen from "../components/Screen";

import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AppPicker from "../components/AppPicker";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Given Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const genCategories = [
  { label: "Male", value: 1 },
  { label: "Female", value: 2 },
  { label: "Non-binary", value: 3 },
  { label: "Prefer Not to State", value: 4 },
];

const ageCategories = [
  { label: "12", value: 12 },
  { label: "13", value: 13 },
  { label: "14", value: 14 },
  { label: "15", value: 15 },
  { label: "16", value: 16 },
  { label: "17", value: 17 },
  { label: "18", value: 18 },
];

const raceCategories = [
  { label: "Asian", value: 1 },
  { label: "Black", value: 2 },
  { label: "White", value: 3 },
  { label: "Prefer Not to State", value: 4 },
];

function LoginScreen(props) {
  const [genCategory, setGenCategory] = useState();
  const [ageCategory, setAgeCategory] = useState();
  const [raceCategory, setRaceCategory] = useState();

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />

      <AppForm
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        <AppFormField
          autoCapitalize
          autoCorrect={false}
          icon="account-circle"
          placeholder="Given Name"
          textContentType="givenName"
          name="name"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          placeholder="Email"
          textContentType="emailAddress"
          name="email"
        />
        <AppPicker
          selectedItem={genCategory}
          onSelectItem={(item) => setGenCategory(item)}
          items={genCategories}
          placeholder="Gender"
          icon="account-group"
        />
        <AppPicker
          selectedItem={ageCategory}
          onSelectItem={(item) => setAgeCategory(item)}
          items={ageCategories}
          placeholder="Age"
          icon="account-child"
        />
        <AppPicker
          selectedItem={raceCategory}
          onSelectItem={(item) => setRaceCategory(item)}
          items={raceCategories}
          placeholder="Race"
          icon="account-child"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          placeholder="Password"
          secureTextEntry={true}
          textContentType="password"
          name="password"
        />
        <SubmitButton title="Register" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 100,
    height: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  error: {
    color: colors.error,
  },
});

export default LoginScreen;
