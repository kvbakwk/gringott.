import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth";
import getUser from "@app/api/user/get";

import Logout from "@components/Logout";
import Link from "next/link";

export const metadata = {
  title: "gringott",
};

export default async function Layout({ children }) {
  if(!(await loginCheck()))
    redirect('/logowanie')

  const user = await getUser();

  return (
    <html lang="pl">
      <head></head>
      <body>
        <Link href="/">gringott</Link>
        <br />
        cześć {user.name} 
        <br />
        <Link href="/przychody">przychody</Link>
        <br />
        <Logout />
        <br /><br /><hr /><br />
        {children}
      </body>
    </html>
  );
}
