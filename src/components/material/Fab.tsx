import React from "react";
import { createComponent } from "@lit/react";
import { MdFab } from "@material/web/fab/fab";

export const Fab = createComponent({
  tagName: "md-fab",
  elementClass: MdFab,
  react: React,
});