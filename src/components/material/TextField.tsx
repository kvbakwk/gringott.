"use client";

import React from "react";
import { createComponent } from "@lit/react";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";
import { css } from "lit";

// Rozszerzamy klasę, aby wstrzyknąć style wewnątrz Shadow DOM
class CustomTextField extends MdOutlinedTextField {
  static override styles = [
    ...(Array.isArray(super.styles) ? super.styles : [super.styles]),
    css`
      input:-webkit-autofill,
      input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus, 
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 100px #fff8f3 inset !important;
        -webkit-text-fill-color: #79590c !important;
        caret-color: #79590c !important;
      }
    `,
  ];
}

// Rejestrujemy nowy element pod unikalną nazwą
const CUSTOM_TAG_NAME = "md-outlined-text-field-custom";
if (!customElements.get(CUSTOM_TAG_NAME)) {
  customElements.define(CUSTOM_TAG_NAME, CustomTextField);
}

export const TextFieldOutlined = createComponent({
  tagName: CUSTOM_TAG_NAME,
  elementClass: CustomTextField,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
  },
});