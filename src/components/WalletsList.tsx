"use client";

import { WalletT } from "@app/utils/db-actions/wallet";

import { useEffect, useState } from "react";
import Link from "next/link";

import { parseMoney } from "@app/utils/parser";
import { Icon } from "./material/Icon";
import { CircularProgress } from "./material/Progress";

export default function WalletsList({
  wallets,
  walletsReady,
}: {
  wallets: WalletT[];
  walletsReady: boolean;
}) {
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    if (walletsReady)
      setCashBalance(
        wallets.filter((wallet) => wallet.wallet_type_id === 1)[0].balance
      );
  }, [wallets, walletsReady]);

  return (
    <div className="flex justify-end items-center gap-[30px] w-full h-full">
      <div className="flex items-end gap-[12px] max-w-[calc(100vw-300px)] h-full pl-[40px] pr-[20px] pb-[4px] overflow-x-auto overflow-y-hidden scroll-none">
        <div
          className={`flex justify-center items-center gap-[10px] h-[40px] px-[20px] bg-surface rounded-t-2xl rounded-b-lg transition-opacity${
            !walletsReady && " opacity-0"
          }`}
        >
          <div className="font-bold text-primary">gotówka</div>
          <div className="flex justify-center items-center gap-[3px]">
            {parseMoney(cashBalance)}
            <span>zł</span>
          </div>
        </div>
        {wallets
          .filter((wallet) => wallet.wallet_type_id === 2)
          .map((wallet) => (
            <div
              className={`flex justify-center items-center gap-[10px] h-[40px] px-[20px] bg-surface rounded-t-2xl rounded-b-lg transition-opacity${
                !walletsReady && " opacity-0"
              }`}
              key={wallet.id}
            >
              <div className="font-bold text-primary">{wallet.name}</div>
              <div className="flex justify-center items-center gap-[3px]">
                {parseMoney(wallet.balance)}
                <span>zł</span>
              </div>
            </div>
          ))}
        <div
          className={`flex justify-center items-center h-[40px] px-[20px]${
            walletsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <Link
          className="flex justify-center items-center text-primary h-[40px] px-[15px] bg-surface rounded-t-2xl rounded-b-lg"
          href="/nowe-konto"
        >
          <Icon className="fill mini">settings</Icon>
        </Link>
      </div>
    </div>
  );
}
