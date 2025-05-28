import "@app/utils/globals.css";

import { Metadata } from "next";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";
import { getUser } from "@app/api/user/get";
import DashboardNav from "@components/navs/DashboardNav";
import User from "@components/User";
import { RouteSegments } from "@app/utils/routes";

export const metadata: Metadata = {
  title: "portfel.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await loginCheck())) redirect(`/${RouteSegments.Login}`);

  return (
    <html lang="pl" className="font-noto">
      <body>
        <div className="grid grid-cols-[300px_1fr] w-screen h-screen bg-surface-container">
          <div className="grid grid-rows-[110px_1fr]">
            <div className="justify-self-center self-center flex justify-center items-center font-bold text-primary text-[45px] tracking-tight w-[250px] h-[70px]">
              portfel.
            </div>
            <div className="flex flex-col justify-between items-center">
              <DashboardNav />
              <User name={(await getUser()).name} />
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
