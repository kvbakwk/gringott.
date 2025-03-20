import { redirect } from "next/navigation";

import { getUser } from "@app/api/user/get";
import { loginCheck } from "@app/api/auth/login";
import DashboardPage from "@components/pages/DashboardPage";

export async function generateMetadata({ params }) {
  const path = await params;
  const title =
    "gringott | " +
    (!path.slug
      ? "strona główna"
      : path.slug[0] === "historia"
      ? "historia"
      : path.slug[0] === "transakcje" && !path.slug[1]
      ? "transakcje"
      : path.slug[0] === "transakcje" && path.slug[1] === "podmioty"
      ? "podmioty"
      : path.slug[0] === "transakcje" && path.slug[1] === "kategorie"
      ? "kategorie"
      : path.slug[0] === "transakcje" && path.slug[1] === "metody"
      ? "metody"
      : path.slug[0] === "transakcje" && path.slug[1] === "nowa"
      ? "nowa transakcja"
      : path.slug[0] === "transakcje" && path.slug[1] === "edycja"
      ? "edycja transakcji"
      : path.slug[0] === "transakcje" && path.slug[1] === "usuwanie"
      ? "usuwanie transakcji"
      : path.slug[0] === "statystyki"
      ? "statystyki"
      : path.slug[0] === "kalkulator"
      ? "kalkulator"
      : "404");

  return {
    title: title,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  if (!(await loginCheck())) redirect("/logowanie");

  return <DashboardPage slug={(await params).slug} user={await getUser()} />;
}
