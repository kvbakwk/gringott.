import { redirect } from "next/navigation";

import { getUser } from "@services/user/get";
import { RouteSegments } from "@utils/routes";
import DashboardShell from "@/components/layout/DashboardShell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect(RouteSegments.Login);
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
