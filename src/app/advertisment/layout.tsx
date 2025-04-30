import "@app/utils/globals.css";

import { Metadata } from "next";

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

  return (
    <html lang="pl" className="font-noto">
      <body>
        <div className="flex flex-col justify-center items-center gap-[14px] w-screen h-screen bg-gray-100">
            <div className="justify-self-center self-center flex justify-center items-center font-bold text-gray-900 text-[100px] tracking-tight">
              proste.
            </div>
            {children}
        </div>
      </body>
    </html>
  );
}
