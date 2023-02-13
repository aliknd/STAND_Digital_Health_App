import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";

import * as Yup from "yup";
import colors from "../config/colors";
import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";

import {
  CustomErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from "../components/forms";
import AppFormPicker from "../components/forms/AppFormPicker";
import useApi from "../hooks/useApi";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Given Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().label("Password"),
  genCategory: Yup.object().required().nullable().label("Gender"),
  ageCategory: Yup.object().required().nullable().label("Age"),
  raceCategory: Yup.object().required().nullable().label("Race"),
  catDog: Yup.object().required().nullable().label("Cat/Dog"),
});

const genCategories = [
  { label: "Male", value: 1 },
  { label: "Female", value: 2 },
  { label: "Non-binary", value: 3 },
  { label: "Prefer Not to State", value: 4 },
];

const ageCategories = [
  { label: "18", value: 18 },
  { label: "19", value: 19 },
  { label: "20", value: 20 },
  { label: "21", value: 21 },
  { label: "22", value: 22 },
  { label: "23", value: 23 },
  { label: "24", value: 24 },
  { label: "25", value: 25 },
  { label: "26", value: 26 },
  { label: "27", value: 27 },
  { label: "28", value: 28 },
  { label: "29", value: 29 },
  { label: "30", value: 30 },
];

const raceCategories = [
  { label: "Asian", value: 1 },
  { label: "Black", value: 2 },
  { label: "White", value: 3 },
  { label: "Prefer Not to State", value: 4 },
];

const catDog = [
  { label: "cat", value: 1 },
  { label: "dog", value: 2 },
];

function RegisterScreen(props) {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async (userInfo) => {
    const result = await registerApi.request(userInfo);

    if (!result.ok) {
      if (result.data) setError(result.data.error);
      else {
        setError("An unxpected error occured.");
        console.log(result);
      }
      return;
    }

    const { data: authToken } = await loginApi.request(
      userInfo.email,
      userInfo.password
    );
    console.log(authToken);
    auth.logIn(authToken);
  };

  return (
    <>
      <AppActivityIndicator visible={registerApi.loading || loginApi.loading} />
      <Screen style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />

        <AppForm
          initialValues={{
            name: "",
            email: "",
            genCategory: "",
            ageCategory: "",
            raceCategory: "",
            catDog: "",
            password: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <CustomErrorMessage error={error} visible={error} />
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
          <AppFormPicker
            items={genCategories}
            placeholder="Gender"
            icon="account-group"
            name="genCategory"
          />
          <AppFormPicker
            items={ageCategories}
            placeholder="Age"
            icon="account-child"
            name="ageCategory"
          />
          <AppFormPicker
            items={raceCategories}
            placeholder="Race"
            icon="account-child"
            name="raceCategory"
          />
          <AppFormPicker
            items={catDog}
            placeholder="Dog Person or Cat Person?"
            icon="paw"
            name="catDog"
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
    </>
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

export default RegisterScreen;
