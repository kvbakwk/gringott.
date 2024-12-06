import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";
import { getUser } from "@app/api/user/get";

import Link from "next/link";
import Logout from "@components/Logout";

export const metadata = {
  title: "gringott",
};

export default async function Layout({ children }) {
  if (!(await loginCheck())) redirect("/logowanie");

  const user = await getUser();

  return (
    <html lang="pl" className="font-noto">
      <head></head>
      <body>
        <div className="grid grid-cols-[300px_1fr] grid-rows-[110px_1fr] w-screen h-screen bg-surface-container">
          <div className="justify-self-center self-center flex justify-center items-center font-bold text-primary text-[45px] tracking-tight w-[250px] h-[70px]">
            gringott.
          </div>
          <div className="flex justify-end items-center gap-[30px] w-full h-full px-[30px]">
            <div className="font-light text-2xl">{user.name}</div>
            <Logout />
          </div>
          <div className="flex flex-col items-center gap-[10px] text-primary w-full mt-[30px] px-[30px] py-[10px]">
            <Link
              className="flex items-center gap-[18px] font-extralight text-[22px] w-full h-[70px] p-[18px] bg-surface rounded-2xl shadow-sm"
              href="/"
            >
              <span className="material-symbols-outlined fill">home</span>
              <span className="text-on-surface-variant">główna</span>
            </Link>
            <Link
              className="flex items-center gap-[18px] font-extralight text-[22px] w-full h-[70px] p-[18px]"
              href="/historia"
            >
              <span className="material-symbols-outlined">history</span>
              <span className="text-on-surface-variant">historia</span>
            </Link>
            <Link
              className="flex items-center gap-[18px] font-extralight text-[22px] w-full h-[70px] p-[18px]"
              href="/transakcje"
            >
              <span className="material-symbols-outlined">list</span>
              <span className="text-on-surface-variant">transakcje</span>
            </Link>
            <Link
              className="flex items-center gap-[18px] font-extralight text-[22px] w-full h-[70px] p-[18px]"
              href="/nowe-konto"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="text-on-surface-variant">nowe konto</span>
            </Link>
            <Link
              className="flex items-center gap-[18px] font-extralight text-[22px] w-full h-[70px] p-[18px]"
              href="/nowa-transakcja"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="text-on-surface-variant">nowa transakcja</span>
            </Link>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
