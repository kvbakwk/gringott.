import React from "react";
import { createComponent } from "@lit/react";
import { MdIconButton } from "@material/web/iconbutton/icon-button";
import { MdFilledIconButton } from "@material/web/iconbutton/filled-icon-button";
import { MdOutlinedIconButton } from "@material/web/iconbutton/outlined-icon-button";

export const IconButton = createComponent({
  tagName: "md-icon-button",
  elementClass: MdIconButton,
  react: React,
});

export const FilledIconButton = createComponent({
  tagName: "md-filled-icon-button",
  elementClass: MdFilledIconButton,
  react: React,
});

export const OutlinedIconButton = createComponent({
  tagName: "md-outlined-icon-button",
  elementClass: MdOutlinedIconButton,
  react: React,
});