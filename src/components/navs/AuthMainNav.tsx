"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "../material/Icon";

export default function AuthMainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const loginEl = useRef(null);
  const registerEl = useRef(null);

  useEffect(() => {
    if (pathname === "/logowanie") {
      loginEl.current.classList.add("bg-surface");
      loginEl.current.classList.add("shadow-md");
      loginEl.current.children[0].classList.add("fill");
      registerEl.current.classList.remove("bg-surface");
      registerEl.current.classList.remove("shadow-md");
      registerEl.current.classList.add("hover:bg-surface");
      // registerEl.current.classList.add('hover:shadow-sm')
      registerEl.current.children[0].classList.remove("fill");
    } else {
      loginEl.current.classList.remove("bg-surface");
      loginEl.current.classList.remove("shadow-md");
      loginEl.current.classList.add("hover:bg-surface");
      // loginEl.current.classList.add('hover:shadow-sm')
      loginEl.current.children[0].classList.remove("fill");
      registerEl.current.classList.add("bg-surface");
      registerEl.current.classList.add("shadow-md");
      registerEl.current.children[0].classList.add("fill");
    }
  }, [pathname]);

  return (
    <div className="text-primary flex flex-col gap-[10px] w-[270px] h-fit p-[10px]">
      <div
        className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] rounded-[16px] transition-all hover:cursor-pointer"
        ref={loginEl}
        onClick={() => router.push("/logowanie")}
      >
        <Icon>account_circle</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          logowanie
        </div>
      </div>
      <div
        className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] rounded-[16px] transition-all hover:cursor-pointer"
        ref={registerEl}
        onClick={() => router.push("/rejestracja")}
      >
        <Icon>person_add</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          rejestracja
        </div>
      </div>
    </div>
  );
}
