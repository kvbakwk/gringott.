import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";

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
    <html lang="pl" className="font-roboto">
      <body>
        <div className="w-screen h-screen grid grid-cols-[1fr_500px_1fr] bg-surface-container">
          <div className="flex flex-col gap-[150px] justify-center items-center w-full h-full">
            <div className="text-primary text-lg leading-[64px] text-center w-[250px] h-[70px]">
              gringott
            </div>
            <div className="text-on-surface-variant flex flex-col gap-[10px] w-[270px] h-fit p-[10px]">
              <div className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] bg-surface rounded-[16px] shadow-md">
                <span className="material-symbols-outlined fill">
                  account_circle
                </span>
                <div className="font-extralight text-[22px]">logowanie</div>
              </div>
              <div className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px]">
                <span className="material-symbols-outlined">person_add</span>
                <div className="font-extralight text-[22px]">rejestracja</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center w-full h-full">{children}</div>
          <div className="text-on-surface-variant flex flex-col justify-center items-center w-full h-full">
            <div className="text-on-surface-variant flex flex-col gap-[10px] w-[270px] h-fit p-[10px]">
              <div className="flex items-center gap-[18px] h-[70px] px-[19px] py-[18px] bg-surface rounded-[16px] shadow-md">
                <span className="material-symbols-outlined fill">book_5</span>
                <div className="font-extralight text-[22px]">rejestracja</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
