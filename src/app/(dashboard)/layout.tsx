import "@app/utils/globals.css";

import { redirect } from "next/navigation";

import { loginCheck } from "@app/api/auth/login";
import { getUser } from "@app/api/user/get";

import Link from "next/link";
import Logout from "@components/Logout";
import { getWallets } from "@app/api/wallet/get";
import { parseMoney } from "@app/utils/parser";
import DashboardNav from "@components/navs/DashboardNav";

export const metadata = {
  title: "gringott",
};

export default async function Layout({ children }) {
  if (!(await loginCheck())) redirect("/logowanie");

  const user = await getUser();
  const wallets = await getWallets(user.id);

  const cashBalance: number = wallets.filter(
    (wallet) => wallet.wallet_type_id === 1
  )[0].balance;

  return (
    <html lang="pl" className="font-noto">
      <head></head>
      <body>
        <div className="grid grid-cols-[300px_1fr] grid-rows-[110px_1fr] w-screen h-screen bg-surface-container">
          <div className="justify-self-center self-center flex justify-center items-center font-bold text-primary text-[45px] tracking-tight w-[250px] h-[70px]">
            gringott.
          </div>
          <div className="flex justify-between items-center gap-[30px] w-full h-full px-[30px]">
            <div className="flex items-end gap-[20px] max-w-[1000px] h-full overflow-x-auto overflow-y-hidden scroll-none">
              <div className="flex justify-center items-center gap-[10px] h-[40px] px-[20px] bg-surface rounded-t-2xl">
                <div className="font-bold text-primary">gotówka</div>
                <div className="flex justify-center items-center gap-[3px]">{parseMoney(cashBalance)}<span>zł</span></div>
              </div>
              {wallets
                .filter((wallet) => wallet.wallet_type_id === 2)
                .map((wallet) => (
                  <div
                    className="flex justify-center items-center gap-[10px] h-[40px] px-[20px] bg-surface rounded-t-2xl"
                    key={wallet.id}
                  >
                    <div className="font-bold text-primary">{wallet.name}</div>
                    <div className="flex justify-center items-center gap-[3px]">{parseMoney(wallet.balance)}<span>zł</span></div>
                  </div>
                ))}
              <Link className="flex justify-center items-center text-primary h-[40px] px-[15px] bg-surface rounded-t-2xl" href="/nowe-konto">
                <span className="material-symbols-outlined">add</span>
              </Link>
            </div>
            <div className="flex justify-center items-center gap-[30px] h-full">
              <div className="font-light text-2xl">{user.name}</div>
              <Logout />
            </div>
          </div>
          <DashboardNav />
          {children}
        </div>
      </body>
    </html>
  );
}
