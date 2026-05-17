"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "@context/SidebarContext";
import DashboardNav from "@components/navs/DashboardNav";
import { Icon } from "@components/material/Icon";
import { DataProvider } from "@context/DataContext";
import { clsx } from "clsx";

export default function DashboardShell({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardShellContent user={user}>{children}</DashboardShellContent>
    </SidebarProvider>
  );
}

function DashboardShellContent({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  const { isCollapsed, isMobileOpen, setIsMobileOpen, toggleSidebar } =
    useSidebar();

  return (
    <div className="flex flex-col w-screen h-screen bg-linear-to-r from-[#79590C33] to-[#0183ff33] overflow-hidden pt-16">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 flex items-center gap-2 h-16 p-2 z-40 select-none backdrop-blur-md">
        <button
          onClick={toggleSidebar}
          className="flex justify-center items-center mx-1 p-3 hover:bg-black/10 rounded-full cursor-pointer transition-colors border-0 outline-none"
          type="button"
          aria-label="Toggle Navigation Sidebar"
        >
          <Icon
            className="text-primary"
            style={{ "--md-icon-size": "24px" } as React.CSSProperties}
          >
            menu
          </Icon>
        </button>
        <div className="justify-self-center self-center flex justify-center items-center font-bold text-primary text-4xl tracking-tight w-fit h-full">
          portfel.
        </div>
      </div>

      <div className="flex flex-row w-full flex-1 relative">
        {/* Sidebar Container */}
        <aside
          className={clsx(
            "flex flex-col justify-start items-center transition-all duration-300 ease-in-out overflow-x-hidden",
            // Mobile Sidebar shifting styles (fixed off-canvas below header)
            "max-md:fixed max-md:top-16 max-md:bottom-0 max-md:left-[-280px] max-md:w-[280px] max-md:z-30",
            isMobileOpen
              ? "max-md:translate-x-[280px]"
              : "max-md:translate-x-0",
            // Desktop styles (sticky sidebar pinned below header)
            "md:sticky md:top-16 md:h-[calc(100vh-64px)] md:self-start",
            isCollapsed ? "md:w-[88px]" : "md:w-[280px]",
          )}
        >
          <div className="w-[280px] md:w-full flex flex-col h-full justify-start items-center shrink-0">
            <div className="flex flex-col w-full items-center flex-1 overflow-y-auto scroll-none">
              <DashboardNav />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={clsx(
            "flex-1 min-w-0 transition-transform duration-300 ease-in-out h-full",
            // Mobile shifting styles (locks width to full screen and slides)
            "max-md:w-screen max-md:shrink-0",
            isMobileOpen
              ? "max-md:translate-x-[280px]"
              : "max-md:translate-x-0",
          )}
        >
          <DataProvider user={user}>{children}</DataProvider>
        </main>
      </div>
    </div>
  );
}
