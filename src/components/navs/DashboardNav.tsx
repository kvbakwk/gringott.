'use client'

import { usePathname, useRouter } from "next/navigation";

import { Icon } from "../material/Icon";

import { RouteSegments } from "@app/utils/routes";

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center gap-[10px] text-primary w-full mt-[30px] px-[30px] py-[10px]">
      <DashboardNavItem icon="home" text="główna" path={`/${RouteSegments.HomePage}`}  />
      <DashboardNavItem icon="history" text="historia" path={`/${RouteSegments.HistoryPage}`} />
      <DashboardNavItem icon="list" text="transakcje" path={`/${RouteSegments.Transactions}`} />
      <DashboardNavSubitem icon="swap_vert" text="wymiany" path={`/${RouteSegments.Transactions}/${RouteSegments.Trades}`} show={pathname.startsWith(`/${RouteSegments.Transactions}`)} />
      <DashboardNavSubitem icon="swap_horiz" text="transfery" path={`/${RouteSegments.Transactions}/${RouteSegments.Transfers}`} show={pathname.startsWith(`/${RouteSegments.Transactions}`)} />
      <DashboardNavSubitem icon="group" text="podmioty" path={`/${RouteSegments.Transactions}/${RouteSegments.Subjects}`} show={pathname.startsWith(`/${RouteSegments.Transactions}`)} />
      <DashboardNavSubitem icon="category" text="kategorie" path={`/${RouteSegments.Transactions}/${RouteSegments.Categories}`} show={pathname.startsWith(`/${RouteSegments.Transactions}`)} />
      <DashboardNavSubitem icon="tactic" text="metody" path={`/${RouteSegments.Transactions}/${RouteSegments.Methods}`} show={pathname.startsWith(`/${RouteSegments.Transactions}`)} />
      <DashboardNavItem icon="bar_chart" text="statystyki" path={`/${RouteSegments.Statistics}`} />
      <DashboardNavItem icon="calculate" text="kalkulator" path={`/${RouteSegments.Calculator}`} />
    </div>
  );
}

function DashboardNavItem({ icon, text, path }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div
    className={`flex items-center gap-[18px] font-extralight text-[20px] w-full h-[50px] p-[18px] rounded-2xl cursor-pointer hover:bg-surface${pathname === path ? ' bg-surface shadow-sm' : ''}`}
    onClick={() => router.push(path)}
  >
    <Icon className="fill">{icon}</Icon>
    <div className="text-on-surface-variant">{text}</div>
  </div>
  )
}

function DashboardNavSubitem({ icon, text, path, show }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div
    className={`items-center gap-[18px] font-extralight text-[18px] w-[80%] h-[40px] p-[18px] rounded-2xl cursor-pointer hover:bg-surface ${pathname === path && 'bg-surface shadow-sm'} ${show ? 'flex' : 'hidden'}`}
    onClick={() => router.push(path)}
  >
    <Icon className="fill">{icon}</Icon>
    <div className="text-on-surface-variant">{text}</div>
  </div>
  )
}