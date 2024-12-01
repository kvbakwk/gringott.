import React from "react";
import { createComponent } from "@lit/react";
import { MdCheckbox } from "@material/web/checkbox/checkbox";

export const Checkbox = createComponent({
  tagName: "md-checkbox",
  elementClass: MdCheckbox,
  react: React,
});