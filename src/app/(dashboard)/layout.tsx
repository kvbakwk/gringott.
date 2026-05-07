import { redirect } from "next/navigation";

import { getUser } from "@services/user/get";
import DashboardNav from "@components/navs/DashboardNav";
import User from "@components/User";
import { RouteSegments } from "@utils/routes";

import { DataProvider } from "@context/DataContext";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect(RouteSegments.Login);
  }

  return (
    <div className="grid grid-cols-[300px_1fr] w-screen h-screen bg-linear-to-r from-[#79590C33] to-[#0183ff33]">
      <div className="grid grid-rows-[110px_1fr]">
        <div className="justify-self-center self-center flex justify-center items-center font-bold text-primary text-[45px] tracking-tight w-[250px] h-[70px]">
          portfel.
        </div>
        <div className="flex flex-col justify-between items-center">
          <DashboardNav />
          <User name={user?.name} />
        </div>
      </div>
      <DataProvider user={user}>
        {children}
      </DataProvider>
    </div>
  );
}
