import React from "react";
import { createComponent } from "@lit/react";
import { MdFilledButton } from "@material/web/button/filled-button";
import { MdOutlinedButton } from "@material/web/button/outlined-button";
import { MdTextButton } from "@material/web/button/text-button";

export const FilledButton = createComponent({
  tagName: "md-filled-button",
  elementClass: MdFilledButton,
  react: React,
});

export const OutlinedButton = createComponent({
  tagName: "md-outlined-button",
  elementClass: MdOutlinedButton,
  react: React,
});

export const TextButton = createComponent({
  tagName: "md-text-button",
  elementClass: MdTextButton,
  react: React,
});