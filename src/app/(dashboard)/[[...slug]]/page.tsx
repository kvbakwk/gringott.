import { redirect } from "next/navigation";

import { getUser } from "@app/api/user/get";
import { loginCheck } from "@app/api/auth/login";
import DashboardPage from "@components/pages/DashboardPage";
import { RouteSegments } from "@app/utils/routes";

export async function generateMetadata({ params }) {
  const path = await params;
  const title =
    "portfel. | " +
    (!path.slug
      ? "strona główna"
      : path.slug[0] === RouteSegments.HistoryPage
      ? "historia"
      : path.slug[0] === RouteSegments.Transactions && !path.slug[1]
      ? "transakcje"
      : path.slug[0] === RouteSegments.Wallets && path.slug[1] === RouteSegments.New
      ? "nowy portfel"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.New
      ? "nowa transakcja"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Edit
      ? "edycja transakcji"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Delete
      ? "usuwanie transakcji"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Trades && !path.slug[2]
      ? "wymiany"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Trades && path.slug[2] === RouteSegments.New
      ? "nowa wymiana"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Trades && path.slug[2] === RouteSegments.Edit
      ? "edycja wymiany"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Trades && path.slug[2] === RouteSegments.Delete
      ? "usuwanie wymiany"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Subjects && !path.slug[2]
      ? "podmioty"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Subjects && path.slug[2] === RouteSegments.New
      ? "nowy podmiot"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Subjects && path.slug[2] === RouteSegments.Edit
      ? "edycja podmiotu"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Subjects && path.slug[2] === RouteSegments.Delete
      ? "usuwanie podmiotu"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Categories
      ? "kategorie"
      : path.slug[0] === RouteSegments.Transactions && path.slug[1] === RouteSegments.Methods
      ? "metody"
      : path.slug[0] === RouteSegments.Statistics
      ? "statystyki"
      : path.slug[0] === RouteSegments.Calculator
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
  if (!(await loginCheck())) redirect(`/${RouteSegments.Login}`);

  return <DashboardPage slug={(await params).slug} user={await getUser()} />;
}
