import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";
import { getUser }from "@app/api/user/get";

import Link from "next/link";

import Logout from "@components/Logout";

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
        <Logout />
        <br />
        <br />
        <Link href="/przychody">przychody</Link>
        <br />
        <Link href="/rozchody">rozchody</Link>
        <br />
        <Link href="/nowe-konto">nowe konto</Link>
        <br /><br /><hr /><br />
        {children}
      </body>
    </html>
  );
}
