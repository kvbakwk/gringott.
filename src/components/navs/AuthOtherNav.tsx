'use client'

import { useRouter } from "next/navigation";

import { Icon } from "../material/Icon";

export default function AuthOtherNav() {
  const router = useRouter()

  return (
    <div className="text-primary flex flex-col gap-[10px] w-[270px] h-fit p-[10px]">
      <div className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] bg-surface rounded-[16px] shadow-md">
        <Icon className="fill">book_5</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          regulamin
        </div>
      </div>
    </div>
  );
}
