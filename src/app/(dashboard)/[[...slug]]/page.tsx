import { redirect } from "next/navigation";

import { getUser } from "@app/api/user/get";
import { loginCheck } from "@app/api/auth/login";
import Dashboard from "@components/Dashboard";

export async function generateMetadata({ params }) {
  const path = await params;
  const title = "gringott | " + (path.slug ?? "strona główna");

  return {
    title: title,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  if (!(await loginCheck())) redirect("/logowanie");

  return <Dashboard slug={(await params).slug} user={await getUser()} />;
}
