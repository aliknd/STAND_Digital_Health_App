import React from "react";
import { useFormikContext } from "formik";

import AppTextInput from "../AppTextInput";
import CustomErrorMessage from "./CustomErrorMessage";

function AppFormField({ name, ...otherProps }) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      <CustomErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormField;
