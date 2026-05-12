import { redirect } from "next/navigation";

import { RouteSegments } from "@utils/routes";
import { verifySession } from "@utils/session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await verifySession()).isAuth) redirect(`/${RouteSegments.HomePage}`);

  return (
    <div
      className="flex justify-center items-center w-screen min-h-dvh"
      style={{ background: "linear-gradient(225deg, #0183ff33, #79590C33)" }}
    >
      {children}
    </div>
  );
}
