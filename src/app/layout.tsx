import "@app/globals.css";

import { Metadata } from "next";

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
  return (
    <html lang="pl" className="font-noto">
      <body>
        {children}
      </body>
    </html>
  );
}
