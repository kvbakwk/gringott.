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
  const [balance, setBalance] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    if (walletsReady) {
      setBalance(
        wallets
          .filter(
            (wallet) =>
              wallet.wallet_type_id === 1 || wallet.wallet_type_id === 2
          )
          .reduce((a, b) => a + b.balance, 0)
      );
      setCashBalance(
        wallets.filter((wallet) => wallet.wallet_type_id === 1)[0].balance
      );
    }
  }, [wallets, walletsReady]);

  return (
    <div className="flex justify-end items-center gap-[30px] w-full h-full">
      <div className="flex items-end gap-[12px] max-w-[calc(100vw-300px)] h-full pl-[40px] pr-[20px] pb-[4px] overflow-x-auto overflow-y-hidden scroll-none">
        {walletsReady && (
          <>
            <WalletItem name="STAN" balance={balance} show={walletsReady} />
            <WalletItem
              name="gotówka"
              balance={cashBalance}
              show={walletsReady}
            />
            {wallets
              .filter((wallet) => wallet.wallet_type_id === 2)
              .map((wallet) => (
                <WalletItem
                  name={wallet.name}
                  balance={wallet.balance}
                  show={walletsReady}
                  key={wallet.id}
                />
              ))}
          </>
        )}
        {!walletsReady && (
          <div className="flex justify-center items-center h-[40px] px-[20px]">
            <CircularProgress className="mini" indeterminate />
          </div>
        )}
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

function WalletItem({
  name,
  balance,
  show,
}: {
  name: string;
  balance: number;
  show: boolean;
}) {
  return (
    <div className="flex justify-center items-center gap-[10px] h-[40px] px-[20px] bg-surface rounded-t-2xl rounded-b-lg">
      <div className="font-bold text-primary">{name}</div>
      <div className="flex justify-center items-center gap-[3px]">
        {parseMoney(balance)}
        <span>zł</span>
      </div>
    </div>
  );
}
