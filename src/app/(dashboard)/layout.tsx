import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth";
import getUser from "@app/api/user/get";

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
        cześć {user.name} <Logout /><br /><br />
        {children}
      </body>
    </html>
  );
}
