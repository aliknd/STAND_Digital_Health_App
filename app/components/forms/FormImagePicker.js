import React from "react";
import ImageInputList from "../ImageInputList";
import CustomErrorMessage from "./CustomErrorMessage";

function FormImagePicker(props) {
  return (
    <>
      <ImageInputList imageUris={props} />
      <CustomErrorMessage />
    </>
  );
}

export default FormImagePicker;
