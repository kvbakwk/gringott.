import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";
import Link from "next/link";
import AuthNav from "@components/AuthNav";

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
            <div className="font-bold text-primary text-lg text-center w-[250px] h-[70px]">
              gringott.
            </div>
            <AuthNav />
          </div>
          <div className="flex flex-col justify-center items-center w-full h-full">{children}</div>
          <div className="text-on-surface-variant flex flex-col justify-center items-center w-full h-full">
            <div className="text-primary flex flex-col gap-[10px] w-[270px] h-fit p-[10px]">
              <div className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] bg-surface rounded-[16px] shadow-md">
                <span className="material-symbols-outlined fill">book_5</span>
                <div className="font-extralight text-on-surface-variant text-[22px]">regulamin</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
