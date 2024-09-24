import { redirect } from 'next/navigation'

import { loginCheck } from "@app/api/auth";
import "@app/utils/globals.css";

export const metadata = {
  title: "gringott",
};

export default async function Layout({ children }) {
  if(await loginCheck())
    redirect('/')

  return (
    <html lang="pl">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
