"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@app/api/auth/login";
import { Icon } from "./material/Icon";
import { IconButton } from "./material/IconButton";
import { RouteSegments } from "@app/utils/routes";

export default function User({ name }: { name: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const moreButtonEl = useRef<any>(null);
  const moreEl = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreEl.current &&
        moreButtonEl.current &&
        !moreEl.current.contains(e.target as Node) &&
        !moreButtonEl.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    router.push(`/${RouteSegments.Login}`);
  };

  return (
    <div className="flex flex-col items-center gap-[10px] text-primary w-full mb-[30px] px-[24px] py-[10px]">
      <div className="relative flex justify-between items-center gap-[18px] font-light text-[22px] w-full h-[70px] pl-[32px] pr-[18px] rounded-2xl border-primary">
        <div className="text-on-surface-variant font-medium text-[20px]">{name}</div>
        <IconButton
          ref={moreButtonEl}
          onClick={() => setIsOpen(!isOpen)}>
          <Icon className="fill">more_vert</Icon>
        </IconButton>
        <div
          className={`absolute bottom-[calc(100%-10px)] right-[18px] flex flex-col px-[8px] py-[6px] font-medium text-on-surface text-[15px] min-w-[180px] bg-surface shadow-lg rounded-xl mb-[8px] z-50 overflow-hidden transition-all duration-200 origin-bottom-right ${
            isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none"
          }`}
          ref={moreEl}>
          <div
            className={`flex justify-start items-center gap-[12px] w-full h-[40px] px-[12px] rounded-lg transition-colors ${
              isLoggingOut ? "opacity-50 pointer-events-none" : "hover:bg-on-surface/[0.08] cursor-pointer"
            }`}
            onClick={handleLogout}>
            {isLoggingOut ? (
              <Icon className="text-on-surface-variant animate-spin">sync</Icon>
            ) : (
              <Icon className="text-on-surface-variant">logout</Icon>
            )}
            {isLoggingOut ? "wylogowywanie..." : "wyloguj się"}
          </div>
        </div>
      </div>
    </div>
  );
}
