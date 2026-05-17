"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import { logout } from "@services/auth/login";
import { Icon } from "./material/Icon";
import { IconButton } from "./material/IconButton";
import { RouteSegments } from "@utils/routes";
import { useSidebar } from "@context/SidebarContext";

export default function User({ name }: { name: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isCollapsed } = useSidebar();

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

  const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-[10px] text-primary w-full mb-[30px] py-[10px] transition-all duration-300",
        isCollapsed ? "px-[10px]" : "px-[24px]"
      )}
    >
      {isCollapsed ? (
        <div className="relative flex justify-center items-center w-full">
          <button
            ref={moreButtonEl}
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-center items-center w-[50px] h-[50px] rounded-full bg-surface shadow-sm text-on-surface-variant font-semibold text-[20px] cursor-pointer hover:bg-black/10 transition-colors border-0 outline-none select-none"
            title={name}
            type="button"
          >
            {firstLetter}
          </button>
          
          <div
            className={clsx(
              "absolute bottom-[calc(100%+10px)] left-0 flex flex-col px-[8px] py-[6px] font-medium text-on-surface text-[15px] min-w-[180px] bg-surface shadow-lg rounded-xl z-50 overflow-hidden transition-all duration-200 origin-bottom-left",
              isOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-2 pointer-events-none"
            )}
            ref={moreEl}
          >
            <div className="px-[12px] py-[6px] text-on-surface-variant/60 font-semibold border-b border-on-surface/5 mb-1 truncate max-w-[160px] select-none">
              {name}
            </div>
            <div
              className={clsx(
                "flex justify-start items-center gap-[12px] w-full h-[40px] px-[12px] rounded-lg transition-colors select-none",
                isLoggingOut
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-on-surface/8 cursor-pointer"
              )}
              onClick={handleLogout}
            >
              {isLoggingOut ? (
                <Icon className="text-on-surface-variant animate-spin">sync</Icon>
              ) : (
                <Icon className="text-on-surface-variant">logout</Icon>
              )}
              {isLoggingOut ? "wylogowywanie..." : "wyloguj się"}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex justify-between items-center gap-[18px] font-light text-[22px] w-full h-[70px] pl-[32px] pr-[18px] rounded-2xl border-primary bg-surface/20">
          <div className="text-on-surface-variant font-medium text-[20px] truncate max-w-[125px] select-none">
            {name}
          </div>
          <IconButton ref={moreButtonEl} onClick={() => setIsOpen(!isOpen)}>
            <Icon className="fill">more_vert</Icon>
          </IconButton>
          <div
            className={clsx(
              "absolute bottom-[calc(100%-10px)] right-[18px] flex flex-col px-[8px] py-[6px] font-medium text-on-surface text-[15px] min-w-[180px] bg-surface shadow-lg rounded-xl mb-[8px] z-50 overflow-hidden transition-all duration-200 origin-bottom-right",
              isOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-2 pointer-events-none"
            )}
            ref={moreEl}
          >
            <div
              className={clsx(
                "flex justify-start items-center gap-[12px] w-full h-[40px] px-[12px] rounded-lg transition-colors select-none",
                isLoggingOut
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-on-surface/8 cursor-pointer"
              )}
              onClick={handleLogout}
            >
              {isLoggingOut ? (
                <Icon className="text-on-surface-variant animate-spin">sync</Icon>
              ) : (
                <Icon className="text-on-surface-variant">logout</Icon>
              )}
              {isLoggingOut ? "wylogowywanie..." : "wyloguj się"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
