'use client'

import { usePathname, useRouter } from "next/navigation";

import { Icon } from "../material/Icon";

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center gap-[10px] text-primary w-full mt-[30px] px-[30px] py-[10px]">
      <DashboardNavItem icon="home" text="główna" path="/" />
      <DashboardNavItem icon="history" text="historia" path="/historia" />
      <DashboardNavItem icon="list" text="transakcje" path="/transakcje" />
      <DashboardNavSubitem icon="group" text="podmioty" path="/transakcje/podmioty" show={pathname.startsWith("/transakcje")} />
      <DashboardNavSubitem icon="category" text="kategorie" path="/transakcje/kategorie" show={pathname.startsWith("/transakcje")} />
      <DashboardNavSubitem icon="tactic" text="metody" path="/transakcje/metody" show={pathname.startsWith("/transakcje")} />
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

function DashboardNavSubitem({ icon, text, path, show }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div
    className={`items-center gap-[18px] font-extralight text-[20px] w-[80%] h-[60px] p-[18px] rounded-2xl cursor-pointer hover:bg-surface ${pathname === path && 'bg-surface shadow-sm'} ${show ? 'flex' : 'hidden'}`}
    onClick={() => router.push(path)}
  >
    <Icon className="fill">{icon}</Icon>
    <div className="text-on-surface-variant">{text}</div>
  </div>
  )
}