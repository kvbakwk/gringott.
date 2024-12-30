"use client";

import { Icon } from "./material/Icon";
import { IconButton } from "./material/IconButton";

export default function User({ name }) {
  return (
    <div className="flex flex-col items-center gap-[10px] text-primary w-full mb-[30px] px-[24px] py-[10px]">
      <div className="flex justify-between items-center gap-[18px] font-light text-[22px] w-full h-[70px] pl-[32px] pr-[18px] rounded-2xl border-primary">
        <div className="text-on-surface-variant">{name}</div>
        <IconButton>
          <Icon className="fill">more_vert</Icon>
        </IconButton>
      </div>
    </div>
  );
}
