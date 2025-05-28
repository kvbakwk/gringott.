import "@app/utils/globals.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "portfel",
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
        <div className="flex flex-col justify-center items-center gap-[14px] w-screen h-screen bg-surface-container">
            <div className="justify-self-center self-center flex justify-center items-center font-bold text-primary text-[80px] tracking-tight">
              prosty portfel.
            </div>
            {children}
        </div>
      </body>
    </html>
  );
}
