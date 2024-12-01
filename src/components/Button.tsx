import React from "react";
import { createComponent } from "@lit/react";
import { MdFilledButton } from "@material/web/button/filled-button";

export const Button = createComponent({
  tagName: "md-filled-button",
  elementClass: MdFilledButton,
  react: React,
});