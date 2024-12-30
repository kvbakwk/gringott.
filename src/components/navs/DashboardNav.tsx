'use client'

import { usePathname, useRouter } from "next/navigation";

import { Icon } from "../material/Icon";

export default function DashboardNav() {

  return (
    <div className="flex flex-col items-center gap-[10px] text-primary w-full mt-[30px] px-[30px] py-[10px]">
      <DashboardNavItem icon="home" text="główna" path="/" />
      <DashboardNavItem icon="history" text="historia" path="/historia" />
      <DashboardNavItem icon="list" text="transakcje" path="/transakcje" />
      <DashboardNavItem icon="bar_chart" text="statystyki" path="/statystyki" />
      <DashboardNavItem icon="calculate" text="kalkulator" path="/kalkulator" />
    </div>
  );
}

function DashboardNavItem({ icon, text, path }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div
    className={`flex items-center gap-[18px] font-extralight text-[22px] w-full h-[70px] p-[18px] rounded-2xl cursor-pointer hover:bg-surface${pathname === path ? ' bg-surface shadow-sm' : ''}`}
    onClick={() => router.push(path)}
  >
    <Icon className="fill">{icon}</Icon>
    <div className="text-on-surface-variant">{text}</div>
  </div>
  )
}