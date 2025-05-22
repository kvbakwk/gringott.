import "@app/utils/globals.css";

import { Metadata } from "next";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";
import AuthMainNav from "@components/navs/AuthMainNav";
import AuthOtherNav from "@components/navs/AuthOtherNav";
import { RouteSegments } from "@app/utils/routes";

export const metadata: Metadata = {
  title: "gringott",
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
  if (await loginCheck()) redirect(`/${RouteSegments.Login}`);

  return (
    <html lang="pl" className="font-noto">
      <body>
        <div className="grid grid-cols-[1fr_500px_1fr] w-screen h-screen bg-surface-container">
          <div className="flex flex-col gap-[150px] justify-center items-center w-full h-full">
            <div className="font-bold text-primary text-[57px] text-center w-[250px] h-[70px]">
              gringott.
            </div>
            <AuthMainNav />
          </div>
          <div className="flex justify-center items-center w-full h-full">
            {children}
          </div>
          <div className="grid grid-rows-[1fr_100px] w-full h-full">
            <div className="flex flex-col justify-center items-center w-full h-full">
              <AuthOtherNav />
            </div>
            <div className="flex justify-center items-center gap-[10px] text-primary w-full h-[70px] mb-[30px] py-[10px] select-none">
              <span className="font-semibold">proste.</span>
              <span className="font-light">@</span>
              <span className="font-semibold">2025</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
