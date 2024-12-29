import "@app/utils/globals.css";

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";

import Loading from "@components/Loading";
import AuthOtherNav from "@components/navs/AuthOtherNav";
import AuthMainNav from "@components/navs/AuthMainNav";

export const metadata = {
  title: "gringott",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await loginCheck()) redirect("/");

  return (
    <html lang="pl" className="font-noto">
      <body>
        <div className="w-screen h-screen grid grid-cols-[1fr_500px_1fr] bg-surface-container">
          <div className="flex flex-col gap-[150px] justify-center items-center w-full h-full">
            <div className="font-bold text-primary text-[57px] text-center w-[250px] h-[70px]">
              gringott.
            </div>
            <AuthMainNav />
          </div>
          <div className="flex flex-col justify-center items-center w-full h-full">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
          <div className="text-on-surface-variant flex flex-col justify-center items-center w-full h-full">
            <AuthOtherNav />
          </div>
        </div>
      </body>
    </html>
  );
}
