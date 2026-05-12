"use client";

import Link from "next/link";
import { Icon } from "../material/Icon";

export default function AuthOtherNav() {
  return (
    <div className="flex flex-col gap-[10px] text-primary w-[90px] xl:w-[270px] h-fit p-[10px]">
      <Link
        href="/regulamin"
        target="_blank"
        className="flex justify-center xl:justify-start items-center gap-[18px] h-[70px] px-[19px] py-[18px] bg-surface rounded-[16px] shadow-md cursor-pointer hover:bg-surface-container-high transition-colors"
      >
        <Icon className="fill">book_5</Icon>
        <div className="hidden xl:block font-extralight text-on-surface-variant text-[22px]">
          regulamin
        </div>
      </Link>
    </div>
  );
}
