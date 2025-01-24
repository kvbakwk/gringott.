"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@app/api/auth/login";
import { Icon } from "./material/Icon";
import { IconButton } from "./material/IconButton";

export default function User({ name }: { name: string }) {
  const router = useRouter();

  const moreButton = useRef(null);
  const moreEl = useRef(null);

  useEffect(() => {
    document.addEventListener("click", (e: PointerEvent) => {
      console.log(
        moreEl.current,
        moreButton.current,
        !moreEl.current.contains(e.target)
      );
      if (
        moreEl.current &&
        moreButton.current &&
        !moreEl.current.contains(e.target) &&
        !moreButton.current.contains(e.target)
      ) {
        moreEl.current.classList.add("hidden");
        moreEl.current.classList.remove("flex");
      }
    });
  }, []);

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center gap-[10px] text-primary w-full mb-[30px] px-[24px] py-[10px]">
      <div className="relative flex justify-between items-center gap-[18px] font-light text-[22px] w-full h-[70px] pl-[32px] pr-[18px] rounded-2xl border-primary">
        <div className="text-on-surface-variant">{name}</div>
        <IconButton
          ref={moreButton}
          onClick={() => {
            moreEl.current.classList.remove("hidden");
            moreEl.current.classList.add("flex");
          }}
        >
          <Icon className="fill">more_vert</Icon>
        </IconButton>
        <div
          className="absolute bottom-[100%] right-0 hidden flex-col gap-[1px] font-medium text-primary text-sm w-[180px] py-[8px] bg-surface shadow-sm rounded-xl"
          ref={moreEl}
        >
          <div
            className="flex justify-start items-center gap-[8px] w-full h-[36px] px-[16px] hover:bg-surface-container cursor-pointer"
            onClick={handleLogout}
          >
            <Icon className="text-on-surface-variant">move_item</Icon>
            wyloguj się
          </div>
        </div>
      </div>
    </div>
  );
}
