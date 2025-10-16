"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Fab } from "@components/material/Fab";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";
import NewTransactionForm from "@components/forms/transactions/NewTransactionForm";
import EditTransactionForm from "@components/forms/transactions/EditTransactionForm";
import DeleteTransactionForm from "@components/forms/transactions/DeleteTransactionForm";

export default function TransactionsPage({
  wallets,
  transactions,
  walletsReady,
  transactionsReady,
  reloadWallets,
  reloadTransactions,
  userId,
}: {
  wallets: WalletT[];
  transactions: TransactionT[];
  walletsReady: boolean;
  transactionsReady: boolean;
  reloadWallets: () => void;
  reloadTransactions: () => void;
  userId: number;
}) {
  const router = useRouter();

  const formEl = useRef(null);

  const [operation, setOperation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [focusEl, setFocusEl] = useState<HTMLElement>(null);

  const successOperation = () => {
    setOperation("");
    reloadWallets();
    reloadTransactions();
    console.log("xdd")
  };
  const cancelOperation = () => setOperation("");

  useEffect(() => {
    if (["new", "edit", "delete"].includes(operation)) {
      formEl.current.classList.remove("hidden");
      formEl.current.classList.add("flex");
      formEl.current.classList.remove("opacity-0");
      formEl.current.classList.add("opacity-100");
      if (focusEl) {
        focusEl.classList.add("transition-all");
        focusEl.classList.add("shadow-sm");
        focusEl.classList.add("bg-surface");
        focusEl.classList.add("border-1");
        operation === "edit"
          ? focusEl.classList.add("border-yellow-500")
          : focusEl.classList.add("border-error");
      }
    } else {
      formEl.current.classList.remove("flex");
      formEl.current.classList.add("hidden");
      formEl.current.classList.remove("opacity-100");
      formEl.current.classList.add("opacity-0");
      if (focusEl) {
        focusEl.classList.remove("transition-all");
        focusEl.classList.remove("shadow-sm");
        focusEl.classList.remove("bg-surface");
        focusEl.classList.remove("border-1");
        focusEl.classList.remove("border-yellow-500");
        focusEl.classList.remove("border-error");
      }
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
              setFocusEl={setFocusEl}
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
        ref={formEl}
        className="absolute flex justify-center items-center w-full h-full opacity-100 transition-opacity"
      >
        {operation === "new" && (
          <NewTransactionForm
            userId={userId}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        )}
        {operation === "edit" && (
          <EditTransactionForm
            userId={userId}
            wallets={wallets.filter(wallet => wallet.wallet_type_id === 1 || wallet.wallet_type_id === 2)}
            transaction={transactions.find(transaction => transaction.id === id)}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        )}
        {operation === "delete" && (
          <DeleteTransactionForm
            userId={userId}
            transaction={transactions.find(transaction => transaction.id === id)}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        )}
      </div>
    </div>
  );
}

export function Transaction({
  transaction,
  wallets,
  setOperation,
  setId,
  setFocusEl,
}: {
  transaction: TransactionT;
  wallets: WalletT[];
  setOperation: (operation: string) => void;
  setId: (id: number) => void;
  setFocusEl: (focusEl: HTMLElement) => void;
}) {
  const router = useRouter();

  const transactionEl = useRef(null);
  const amountEl = useRef(null);

  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (transaction.income) amountEl.current.classList.add("text-green-800");
    else amountEl.current.classList.add("text-red-800");
    if (transaction.important) amountEl.current.classList.remove("opacity-50");
    else  amountEl.current.classList.add("opacity-50");
  }, [transaction]);

  return (
    <div
      ref={transactionEl}
      className="flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] rounded-lg hover:bg-surface"
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
        ref={amountEl}
        className="flex justify-center items-center font-semibold text-xl w-[160px]"
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
            setFocusEl(transactionEl.current);
          }}
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() => {
            setOperation("delete");
            setId(transaction.id);
            setFocusEl(transactionEl.current);
          }}
        >
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
