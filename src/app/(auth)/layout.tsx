import "@app/utils/globals.css";

import { Metadata } from "next";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";
import AuthMainNav from "@components/navs/AuthMainNav";
import AuthOtherNav from "@components/navs/AuthOtherNav";

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
  if ((await loginCheck())) redirect("/logowanie");

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
          <div className="flex flex-col justify-center items-center text-on-surface-variant w-full h-full">
            <AuthOtherNav />
          </div>
        </div>
      </body>
    </html>
  );
}
