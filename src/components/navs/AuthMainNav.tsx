"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "../material/Icon";

export default function AuthMainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const loginEl = useRef<HTMLDivElement>(null);
  const registerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname === "/logowanie") {
      loginEl.current.classList.add("bg-surface", "shadow-md");
      registerEl.current.classList.remove("bg-surface", "shadow-md");
    } else {
      registerEl.current.classList.add("bg-surface", "shadow-md");
      loginEl.current.classList.remove("bg-surface", "shadow-md");
    }
  }, [pathname]);

  return (
    <div className="flex flex-col gap-[10px] text-primary w-[270px] h-fit p-[10px]">
      <div
        className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] rounded-[16px] transition-all hover:bg-surface hover:cursor-pointer"
        ref={loginEl}
        onClick={() => router.push("/logowanie")}
      >
        <Icon className="fill">account_circle</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          logowanie
        </div>
      </div>
      <div
        className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] rounded-[16px] transition-all hover:bg-surface hover:cursor-pointer"
        ref={registerEl}
        onClick={() => router.push("/rejestracja")}
      >
        <Icon className="fill">person_add</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          rejestracja
        </div>
      </div>
    </div>
  );
}
