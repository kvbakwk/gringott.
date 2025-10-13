"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TradeT } from "@app/utils/db-actions/trade";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RouteSegments } from "@app/utils/routes";

import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Fab } from "@components/material/Fab";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";

export default function TradesPage({
  wallets,
  trades,
  walletsReady,
  tradesReady,
}: {
  wallets: WalletT[];
  trades: TradeT[];
  walletsReady: boolean;
  tradesReady: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col w-[calc(100%-50px)] h-full">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
        <div className="flex justify-center items-center w-[200px]">data</div>
        <div className="flex justify-center items-center w-[160px]">kwota</div>
        <div className="flex justify-center items-center w-[120px]">
          portfel
        </div>
        <div className="flex justify-center items-center w-[150px]">metoda</div>
        <div className="flex justify-center items-center w-[200px]">
          druga strona
        </div>
        <div className="flex justify-center items-center w-[150px]">metoda</div>
      </div>
      <div
        className={`flex w-full h-[calc(100vh-160px)] px-[20px] pb-[30px] overflow-y-auto scroll-none ${
          walletsReady && tradesReady
            ? "flex-col"
            : "justify-center items-center"
        }`}
      >
        {trades
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((trade) => (
            <Trade trade={trade} wallets={wallets} key={trade.id} />
          ))}
        <div className={`${walletsReady && tradesReady && " hidden"}`}>
          <CircularProgress indeterminate />
        </div>
      </div>
      <div className="absolute bottom-10 right-10">
        <Fab
          lowered
          onClick={() =>
            router.push(`/${RouteSegments.Transactions}/${RouteSegments.Trades}/${RouteSegments.New}`)
          }
        >
          <Icon slot="icon">add</Icon>
        </Fab>
      </div>
    </div>
  );
}

export function Trade({
  trade,
  wallets,
}: {
  trade: TradeT;
  wallets: WalletT[];
}) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  return (
    <div
      className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] rounded-lg hover:shadow-sm hover:bg-surface`}
      key={trade.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-[70px] h-full"></div>
      <div className="flex justify-center items-center gap-[6px] w-[200px]">
        <div>{parseDate(trade.date)}</div>
        <div className="text-[15px]">{parseTime(trade.date)}</div>
      </div>
      <div
        className={`flex justify-center items-center font-semibold text-lg w-[160px] ${
          trade.deposit ? "text-green-800" : "text-red-800"
        }`}
      >
        {parseMoney(trade.amount)} zł
      </div>
      <div className="flex justify-center items-center truncate w-[120px]">
        {
          wallets.filter((wallet: WalletT) => wallet.id === trade.wallet_id)[0]
            .name
        }
      </div>
      <div className="flex justify-center items-center w-[150px]">
        {trade.atm ? "-" : trade.user_method.name}
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {trade.subject.name}
      </div>
      <div className="flex justify-center items-center w-[150px]">
        {trade.atm ? "-" : trade.subject_method.name}
      </div>
      <div
        className={`flex justify-between items-center w-[70px] h-full transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <IconButton
          className="mini"
          onClick={() =>
            router.push(
              `/${RouteSegments.Transactions}/${RouteSegments.Trades}/${RouteSegments.Edit}/${trade.id}`
            )
          }
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() =>
            router.push(
              `/${RouteSegments.Transactions}/${RouteSegments.Trades}/${RouteSegments.Delete}/${trade.id}`
            )
          }
        >
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
