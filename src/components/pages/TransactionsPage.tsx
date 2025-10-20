"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useRef, useState } from "react";

import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Fab } from "@components/material/Fab";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";
import NewTransactionForm from "@components/forms/transactions/NewTransactionForm";
import EditTransactionForm from "@components/forms/transactions/EditTransactionForm";
import DeleteTransactionForm from "@components/forms/transactions/DeleteTransactionForm";
import { MethodT } from "@app/utils/db-actions/method";
import { SubjectT } from "@app/utils/db-actions/subject";
import { SuperCategoryT } from "@app/utils/db-actions/super_category";
import { CategoryT } from "@app/utils/db-actions/category";
import WalletsList from "@components/WalletsList";

export default function TransactionsPage({
  wallets,
  transactions,
  methods,
  subjects,
  superCategories,
  categories,
  walletsReady,
  transactionsReady,
  methodsReady,
  subjectsReady,
  superCategoriesReady,
  categoriesReady,
  reloadWallets,
  reloadTransactions,
  userId,
}: {
  wallets: WalletT[];
  transactions: TransactionT[];
  methods: MethodT[];
  subjects: SubjectT[];
  superCategories: SuperCategoryT[];
  categories: CategoryT[];
  walletsReady: boolean;
  transactionsReady: boolean;
  methodsReady: boolean;
  subjectsReady: boolean;
  superCategoriesReady: boolean;
  categoriesReady: boolean;
  reloadWallets: () => void;
  reloadTransactions: () => void;
  userId: number;
}) {
  const formEl = useRef(null);
  const newTransactionEl = useRef(null);

  const [operation, setOperation] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [focusEl, setFocusEl] = useState<HTMLElement>(null);

  const successOperation = () => {
    hideForm();
    setOperation("");
    reloadWallets();
    reloadTransactions();
  };
  const cancelOperation = () => {
    hideForm();
    setOperation("");
  };

  useEffect(() => {
    if (["new", "edit", "delete"].includes(operation)) {
      formEl.current.classList.remove("hidden");
      formEl.current.classList.add("flex");
      setTimeout(() => {
        formEl.current.classList.remove("opacity-0");
      }, 1);
      if (focusEl) {
        focusEl.classList.add("transition-all");
        focusEl.classList.add("shadow-sm");
        focusEl.classList.add("bg-surface");
        focusEl.classList.add("border-1");
        focusEl.classList.remove("border-surface");
        operation === "new"
          ? focusEl.classList.add("border-green-700")
          : operation === "edit"
          ? focusEl.classList.add("border-yellow-500")
          : focusEl.classList.add("border-error");
      }
    }
  }, [operation]);

  const hideForm = () => {
    formEl.current.classList.remove("flex");
    formEl.current.classList.add("hidden");
    setTimeout(() => {
      formEl.current.classList.add("opacity-0");
    }, 1);
    if (focusEl) {
      if (operation === "new") {
        focusEl.classList.remove("shadow-sm");
        focusEl.classList.add("border-surface");
        focusEl.classList.remove("border-green-700");
        setTimeout(() => {
          focusEl.classList.remove("transition-all");
        }, 10);
      } else {
        focusEl.classList.remove("shadow-sm");
        focusEl.classList.remove("bg-surface");
        focusEl.classList.remove("border-1");
        focusEl.classList.remove("border-green-700");
        focusEl.classList.remove("border-yellow-500");
        focusEl.classList.remove("border-error");
        setTimeout(() => {
          focusEl.classList.remove("transition-all");
        }, 10);
      }
    }
  };

  return (
    <div className="relative grid grid-rows-[50px_1fr] w-full h-full">
      <div className="flex justify-between items-center w-full h-full px-[20px]">
        <div
          ref={newTransactionEl}
          className="flex items-center gap-[18px] text-base text-primary w-[230px] h-[30px] p-[18px] rounded-2xl cursor-pointer bg-surface border-1 border-surface"
          onClick={() => {
            setOperation("new");
            setFocusEl(newTransactionEl.current);
          }}>
          <Icon slot="icon">add</Icon>
          <div className="text-on-surface-variant">nowa transakcja</div>
        </div>
        <WalletsList wallets={wallets} walletsReady={walletsReady} />
      </div>
      <div className="flex flex-col w-[calc(100%-50px)] h-full">
        <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
          <div className="flex justify-center items-center w-[20px]"></div>
          <div className="flex justify-center items-center w-[200px]">data</div>
          <div className="flex justify-center items-center w-[160px]">
            kwota
          </div>
          <div className="flex justify-center items-center w-[200px]">opis</div>
          <div className="flex justify-center items-center w-[200px]">z..</div>
          <div className="flex justify-center items-center w-[200px]">
            kategoria
          </div>
          <div className="flex justify-center items-center w-[120px]">
            portfel
          </div>
          <div className="flex justify-center items-center w-[150px]">
            metoda
          </div>
          <div className="flex justify-center items-center w-[100px]"></div>
        </div>
        <div
          className={`flex w-full h-[calc(100vh-106px)] px-[20px] pb-[106px] overflow-y-auto scroll-none ${
            walletsReady &&
            transactionsReady &&
            methodsReady &&
            subjectsReady &&
            superCategoriesReady &&
            categoriesReady
              ? "flex-col"
              : "justify-center items-center"
          }`}>
          {walletsReady &&
            transactionsReady &&
            methodsReady &&
            subjectsReady &&
            superCategoriesReady &&
            categoriesReady &&
            transactions
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
          <div
            className={`${
              walletsReady &&
              transactionsReady &&
              methodsReady &&
              subjectsReady &&
              superCategoriesReady &&
              categoriesReady &&
              " hidden"
            }`}>
            <CircularProgress indeterminate />
          </div>
        </div>
      </div>
      <div
        ref={formEl}
        className="absolute hidden justify-center items-center w-full h-full opacity-0 transition-all">
        {operation === "new" ? (
          <NewTransactionForm
            userId={userId}
            wallets={wallets.filter(
              (wallet) =>
                wallet.wallet_type_id === 1 || wallet.wallet_type_id === 2
            )}
            methods={methods}
            subjects={subjects}
            superCategories={superCategories}
            categories={categories}
            operation={operation}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        ) : operation === "edit" ? (
          <EditTransactionForm
            userId={userId}
            wallets={wallets.filter(
              (wallet) =>
                wallet.wallet_type_id === 1 || wallet.wallet_type_id === 2
            )}
            transaction={transactions.find(
              (transaction) => transaction.id === id
            )}
            methods={methods}
            subjects={subjects}
            superCategories={superCategories}
            categories={categories}
            operation={operation}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        ) : operation === "delete" ? (
          <DeleteTransactionForm
            userId={userId}
            transaction={transactions.find(
              (transaction) => transaction.id === id
            )}
            operation={operation}
            successOperation={successOperation}
            cancelOperation={cancelOperation}
          />
        ) : (
          <></>
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
  const transactionEl = useRef(null);
  const amountEl = useRef(null);

  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (transaction.income) amountEl.current.classList.add("text-green-800");
    else amountEl.current.classList.add("text-red-800");
    if (transaction.important) amountEl.current.classList.remove("opacity-50");
    else amountEl.current.classList.add("opacity-50");
  }, [transaction]);

  return (
    <div
      ref={transactionEl}
      className="flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] rounded-lg hover:bg-surface"
      key={transaction.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div className="w-[20px] h-full"></div>
      <div className="flex justify-center items-center gap-[6px] w-[200px]">
        <div>{parseDate(transaction.date)}</div>
        <div className="text-[15px]">{parseTime(transaction.date)}</div>
      </div>
      <div
        ref={amountEl}
        className="flex justify-center items-center font-semibold text-xl w-[160px]">
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
        }`}>
        <IconButton
          className="mini"
          onClick={() => {
            setOperation("edit");
            setId(transaction.id);
            setFocusEl(transactionEl.current);
          }}>
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() => {
            setOperation("delete");
            setId(transaction.id);
            setFocusEl(transactionEl.current);
          }}>
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
