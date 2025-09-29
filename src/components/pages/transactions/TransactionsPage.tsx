"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RouteSegments } from "@app/utils/routes";

import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Fab } from "@components/material/Fab";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";

export default function TransactionsPage({
  wallets,
  transactions,
  walletsReady,
  transactionsReady,
}: {
  wallets: WalletT[];
  transactions: TransactionT[];
  walletsReady: boolean;
  transactionsReady: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col w-[calc(100%-50px)] h-full">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
        <div className="flex justify-center items-center w-[20px]"></div>
        <div className="flex justify-center items-center w-[200px]">data</div>
        <div className="flex justify-center items-center w-[160px]">kwota</div>
        <div className="flex justify-center items-center w-[200px]">opis</div>
        <div className="flex justify-center items-center w-[200px]">z..</div>
        <div className="flex justify-center items-center w-[200px]">
          kategoria
        </div>
        <div className="flex justify-center items-center w-[120px]">
          portfel
        </div>
        <div className="flex justify-center items-center w-[150px]">metoda</div>
        <div className="flex justify-center items-center w-[100px]"></div>
      </div>
      <div
        className={`flex w-full h-[calc(100vh-106px)] px-[20px] pb-[106px] overflow-y-auto scroll-none ${
          walletsReady && transactionsReady
            ? "flex-col"
            : "justify-center items-center"
        }`}
      >
        {transactions
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((transaction) => (
            <Transaction
              transaction={transaction}
              wallets={wallets}
              key={transaction.id}
            />
          ))}
        <div className={`${walletsReady && transactionsReady && " hidden"}`}>
          <CircularProgress indeterminate />
        </div>
      </div>
      <div className="absolute bottom-10 right-10">
        <Fab
          lowered
          onClick={() =>
            router.push(`/${RouteSegments.Transactions}/${RouteSegments.New}`)
          }
        >
          <Icon slot="icon">add</Icon>
        </Fab>
      </div>
    </div>
  );
}

export function Transaction({
  transaction,
  wallets,
}: {
  transaction: TransactionT;
  wallets: WalletT[];
}) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  return (
    <div
      className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] border-y-[1px] border-surface-container hover:border-primary  ${
        !transaction.important && "opacity-100"
      }`}
      key={transaction.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-[20px] h-full"></div>
      <div className="flex justify-center items-center gap-[6px] w-[200px]">
        <div>{parseDate(transaction.date)}</div>
        <div className="text-[15px]">{parseTime(transaction.date)}</div>
      </div>
      <div
        className={`flex justify-center items-center font-semibold text-xl w-[160px] ${
          transaction.income ? "text-green-800" : "text-red-800"
        } ${!transaction.important && "opacity-50"}`}
      >
        {parseMoney(transaction.amount)} zł
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {transaction.description}
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {transaction.subject.name}
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {transaction.category.name}
      </div>
      <div className="flex justify-center items-center truncate w-[120px]">
        {wallets.filter(
          (wallet: WalletT) => wallet.id === transaction.wallet_id
        )[0].name ?? "gotówka"}
      </div>
      <div className="flex justify-center items-center w-[150px]">
        {transaction.method.name}
      </div>
      <div
        className={`flex justify-center items-center w-[100px] h-full transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <IconButton
          className="mini"
          onClick={() =>
            router.push(
              `/${RouteSegments.Transactions}/${RouteSegments.Edit}/${transaction.id}`
            )
          }
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() =>
            router.push(
              `/${RouteSegments.Transactions}/${RouteSegments.Delete}/${transaction.id}`
            )
          }
        >
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
