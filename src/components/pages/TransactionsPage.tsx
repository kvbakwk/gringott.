"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
        <div className="flex justify-center items-center w-[200px]">DATA</div>
        <div className="flex justify-center items-center w-[160px]">KWOTA</div>
        <div className="flex justify-center items-center w-[200px]">OPIS</div>
        <div className="flex justify-center items-center w-[200px]">
          DRUGA STRONA
        </div>
        <div className="flex justify-center items-center w-[200px]">
          KATEGORIA
        </div>
        <div className="flex justify-center items-center w-[120px]">
          PORTFEL
        </div>
        <div className="flex justify-center items-center w-[150px]">METODA</div>
      </div>
      <div
        className={`flex w-full h-[calc(100vh-160px)] pb-[30px] overflow-y-auto scroll-none ${
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
        <Fab lowered onClick={() => router.push("/transakcje/nowa")}>
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
      className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px]`}
      key={transaction.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-[70px] h-full"></div>
      <div className="flex justify-center items-center gap-[6px] w-[200px]">
        <div>{parseDate(transaction.date)}</div>
        <div className="text-[15px]">{parseTime(transaction.date)}</div>
      </div>
      <div
        className={`flex justify-center items-center font-semibold text-lg w-[160px] ${
          transaction.income ? "text-green-800" : "text-red-800"
        }`}
      >
        {parseMoney(transaction.amount)} zł
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {transaction.description}
      </div>
      <div className="flex justify-center items-center truncate w-[200px]">
        {transaction.counterparty}
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
        className={`flex justify-between items-center w-[70px] h-full transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <IconButton
          className="mini"
          onClick={() => router.push(`/transakcje/edycja/${transaction.id}`)}
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() => router.push(`/transakcje/usuwanie/${transaction.id}`)}
        >
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
