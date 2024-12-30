import React from "react";
import { createComponent } from "@lit/react";
import { MdIconButton } from "@material/web/iconbutton/icon-button";

export const IconButton = createComponent({
  tagName: "md-icon-button",
  elementClass: MdIconButton,
  react: React,
});