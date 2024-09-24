import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth";

export const metadata = {
  title: "gringott",
};

export default async function Layout({ children }) {
  if(!(await loginCheck()))
    redirect('/logowanie')

  return (
    <html lang="pl">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
