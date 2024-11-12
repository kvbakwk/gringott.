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
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
