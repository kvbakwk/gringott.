import React from "react";
import { createComponent } from "@lit/react";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";

export const TextFieldOutlined = createComponent({
  tagName: "md-outlined-text-field",
  elementClass: MdOutlinedTextField,
  react: React,
});