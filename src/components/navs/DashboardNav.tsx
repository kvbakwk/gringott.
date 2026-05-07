"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

import { Icon } from "../material/Icon";

import { RouteSegments } from "@utils/routes";

const activeColorClasses: Record<string, string> = {
  investments: "bg-investments/20 text-investments font-normal shadow-sm",
  savings: "bg-savings/20 text-savings font-normal shadow-sm",
  piggybanks: "bg-piggybanks/20 text-piggybanks font-normal shadow-sm",
  goals: "bg-goals/20 text-goals font-normal shadow-sm",
  loans: "bg-loans/20 text-loans font-normal shadow-sm",
};

const hoverColorClasses: Record<string, string> = {
  investments: "hover:bg-investments/10 hover:text-investments text-on-surface-variant",
  savings: "hover:bg-savings/10 hover:text-savings text-on-surface-variant",
  piggybanks: "hover:bg-piggybanks/10 hover:text-piggybanks text-on-surface-variant",
  goals: "hover:bg-goals/10 hover:text-goals text-on-surface-variant",
  loans: "hover:bg-loans/10 hover:text-loans text-on-surface-variant",
};

type NavItemConfig = {
  icon: string;
  text: string;
  path: string;
};

type NavSubItemConfig = NavItemConfig & {
  color?: string;
};

type NavGroupConfig = {
  main: NavItemConfig;
  subItems?: NavSubItemConfig[];
  showSubItems?: (pathname: string) => boolean;
};

const navConfig: NavGroupConfig[] = [
  {
    main: { icon: "home", text: "główna", path: `/${RouteSegments.HomePage}` },
    subItems: [
      { icon: "wallet", text: "portfele", path: `/${RouteSegments.Wallets}/${RouteSegments.Accounts}` },
      { color: "investments", icon: "finance_mode", text: "inwestycje", path: `/${RouteSegments.Wallets}/${RouteSegments.Investments}` },
      { color: "savings", icon: "nest_eco_leaf", text: "oszczędności", path: `/${RouteSegments.Wallets}/${RouteSegments.Savings}` },
      { color: "piggybanks", icon: "savings", text: "skarbonki", path: `/${RouteSegments.Wallets}/${RouteSegments.Piggybanks}` },
      { color: "goals", icon: "target", text: "cele", path: `/${RouteSegments.Wallets}/${RouteSegments.Goals}` },
      { color: "loans", icon: "person_shield", text: "należności", path: `/${RouteSegments.Wallets}/${RouteSegments.Loans}` },
    ],
    showSubItems: (pathname) => pathname === `/${RouteSegments.HomePage}` || pathname.startsWith(`/${RouteSegments.Wallets}`)
  },
  {
    main: { icon: "history", text: "historia", path: `/${RouteSegments.HistoryPage}` },
  },
  {
    main: { icon: "list", text: "transakcje", path: `/${RouteSegments.Transactions}` },
    subItems: [
      { icon: "swap_vert", text: "wymiany", path: `/${RouteSegments.Transactions}/${RouteSegments.Trades}` },
      { icon: "swap_horiz", text: "transfery", path: `/${RouteSegments.Transactions}/${RouteSegments.Transfers}` },
      { icon: "payments", text: "spłaty", path: `/${RouteSegments.Transactions}/${RouteSegments.Lending}` },
      { icon: "group", text: "podmioty", path: `/${RouteSegments.Transactions}/${RouteSegments.Subjects}` },
      { icon: "category", text: "kategorie", path: `/${RouteSegments.Transactions}/${RouteSegments.Categories}` },
      { icon: "tactic", text: "metody", path: `/${RouteSegments.Transactions}/${RouteSegments.Methods}` },
    ],
    showSubItems: (pathname) => pathname.startsWith(`/${RouteSegments.Transactions}`)
  },
  {
    main: { icon: "bar_chart", text: "statystyki", path: `/${RouteSegments.Statistics}` },
  },
  {
    main: { icon: "calculate", text: "kalkulator", path: `/${RouteSegments.Calculator}` },
  }
];

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center gap-[10px] text-primary w-full mt-[30px] px-[30px] py-[10px]">
      {navConfig.map((group, groupIdx) => (
        <React.Fragment key={groupIdx}>
          <DashboardNavItem {...group.main} />
          {group.subItems && group.subItems.map((sub, subIdx) => (
            <DashboardNavSubitem 
              key={`${groupIdx}-${subIdx}`} 
              {...sub} 
              show={group.showSubItems ? group.showSubItems(pathname) : false} 
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

function DashboardNavItem({ icon, text, path }: any) {
  const pathname = usePathname()
  const isActive = pathname === path;

  return (
    <Link
      href={path}
      className={clsx(
        "flex items-center gap-[18px] font-extralight text-[20px] w-full h-[50px] p-[18px] rounded-2xl cursor-pointer transition-all",
        isActive ? "bg-surface shadow-sm text-on-surface-variant font-normal" : "text-on-surface-variant hover:bg-surface"
      )}
    >
      <Icon className="fill">{icon}</Icon>
      <div>{text}</div>
    </Link>
  )
}

function DashboardNavSubitem({ icon, text, path, show, color }: any) {
  const pathname = usePathname()
  const isActive = pathname === path;

  return (
    <Link
      href={path}
      className={clsx(
        "items-center gap-[18px] font-extralight text-[18px] w-[80%] h-[40px] p-[18px] rounded-2xl cursor-pointer transition-all",
        isActive 
          ? (color ? activeColorClasses[color] : "bg-surface shadow-sm text-on-surface-variant font-normal")
          : (color ? hoverColorClasses[color] : "text-on-surface-variant hover:bg-surface"),
        show ? "flex" : "hidden"
      )}
    >
      <Icon className="fill">{icon}</Icon>
      <div>{text}</div>
    </Link>
  )
}