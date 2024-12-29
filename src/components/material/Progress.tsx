import React from "react";
import { createComponent } from "@lit/react";
import { MdCircularProgress } from "@material/web/progress/circular-progress";
import { MdLinearProgress } from "@material/web/progress/linear-progress";

export const CircularProgress = createComponent({
  tagName: "md-circular-progress",
  elementClass: MdCircularProgress,
  react: React,
});

export const LinearProgress = createComponent({
  tagName: "md-linear-progress",
  elementClass: MdLinearProgress,
  react: React,
});