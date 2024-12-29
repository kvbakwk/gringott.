import React from "react";
import { createComponent } from "@lit/react";
import { MdOutlinedSelect } from "@material/web/select/outlined-select";
import { MdSelectOption} from "@material/web/select/select-option";

export const SelectOutlined = createComponent({
  tagName: "md-outlined-select",
  elementClass: MdOutlinedSelect,
  react: React,
});
export const SelectOption = createComponent({
  tagName: "md-select-option",
  elementClass: MdSelectOption,
  react: React,
});