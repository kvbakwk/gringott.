"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { RouteSegments } from "@app/utils/routes";

import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Fab } from "@components/material/Fab";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";
import NewTransactionForm from "@components/forms/transactions/NewTransactionForm";
import EditTransactionForm from "@components/forms/transactions/EditTransactionForm";

export default function TransactionsPage({
  wallets,
  transactions,
  walletsReady,
  transactionsReady,
  userId,
}: {
  wallets: WalletT[];
  transactions: TransactionT[];
  walletsReady: boolean;
  transactionsReady: boolean;
  userId: number;
}) {
  const router = useRouter();

  const form = useRef(null);

  const [operation, setOperation] = useState<string>("");
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    if (["new", "edit", "delete"].includes(operation)) {
      form.current.classList.remove("hidden");
      form.current.classList.add("flex");
    } else {
      form.current.classList.remove("flex");
      form.current.classList.add("hidden");
    }
  }, [operation]);

  return (
    <div className="relative flex flex-col w-[calc(100%-50px)] h-full">
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
              setOperation={setOperation}
              setId={setId}
            />
          ))}
        <div className={`${walletsReady && transactionsReady && " hidden"}`}>
          <CircularProgress indeterminate />
        </div>
      </div>
      <div className="absolute bottom-10 right-10">
        <Fab lowered onClick={() => setOperation("new")}>
          <Icon slot="icon">add</Icon>
        </Fab>
      </div>
      <div
        ref={form}
        className="absolute flex justify-center items-center w-full h-full"
      >
        {operation === "new" && <NewTransactionForm userId={userId} />}
        {operation === "edit" && (
          <EditTransactionForm userId={userId} transactionId={id} />
        )}
        {operation === "delete" && <NewTransactionForm userId={userId} />}
      </div>
    </div>
  );
}

export function Transaction({
  transaction,
  wallets,
  setOperation,
  setId,
}: {
  transaction: TransactionT;
  wallets: WalletT[];
  setOperation: (operation: string) => void;
  setId: (id: number) => void;
}) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  return (
    <div
      className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] rounded-lg hover:shadow-sm hover:bg-surface  ${
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
          onClick={() => {
            setOperation("edit");
            setId(transaction.id);
          }}
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
