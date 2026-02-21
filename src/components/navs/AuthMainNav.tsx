"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Icon } from "../material/Icon";
import { RouteSegments } from "@app/utils/routes";

export default function AuthMainNav() {
  const pathname = usePathname();

  const isLogin = pathname === `/${RouteSegments.Login}`;
  const isRegister = pathname === `/${RouteSegments.Register}`;

  const linkBaseClass =
    "flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] rounded-[16px] transition-all hover:bg-surface hover:cursor-pointer";
  const activeClass = "bg-surface shadow-md";

  return (
    <div className="flex flex-col gap-[10px] text-primary w-[270px] h-fit p-[10px]">
      <Link
        href={`/${RouteSegments.Login}`}
        className={`${linkBaseClass} ${isLogin ? activeClass : ""}`}
      >
        <Icon className={isLogin ? "fill" : ""}>account_circle</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          logowanie
        </div>
      </Link>
      <Link
        href={`/${RouteSegments.Register}`}
        className={`${linkBaseClass} ${isRegister ? activeClass : ""}`}
      >
        <Icon className={isRegister ? "fill" : ""}>person_add</Icon>
        <div className="font-extralight text-on-surface-variant text-[22px]">
          rejestracja
        </div>
      </Link>
    </div>
  );
}
