import React from "react";
import { useForm } from "react-hook-form";
import ReactDOM from "react-dom";

const PhotoPicker = () => {
  const { register } = useForm();
  const component = (
    <input type="file" {...register("profilePhoto")} hidden id="photo-picker" />
  );
  return ReactDOM.createPortal(
    component,
    document.getElementById("upload-profile-photo")
  );
};

export default PhotoPicker;
