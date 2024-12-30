"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useState } from "react";

import { parseMoney } from "@app/utils/parser";
import { getTimeLimits } from "@app/utils/time";
import { CircularProgress } from "./material/Progress";

export default function HomePage({
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
  const [cashBalance, setCashBalance] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [investmentsBalance, setInvestmentsBalance] = useState(0);
  const [timeLimits, setTimeLimits] = useState(getTimeLimits());

  useEffect(() => {
    if (walletsReady) {
      setCashBalance(
        wallets
          .filter((wallet) => wallet.wallet_type_id === 1)
          .reduce((a, b) => a + b.balance, 0)
      );
      setBankBalance(
        wallets
          .filter((wallet) => wallet.wallet_type_id === 2)
          .reduce((a, b) => a + b.balance, 0)
      );
      setSavingsBalance(
        wallets
          .filter((wallet) => wallet.wallet_type_id === 3)
          .reduce((a, b) => a + b.balance, 0)
      );
      setInvestmentsBalance(
        wallets
          .filter((wallet) => wallet.wallet_type_id === 4)
          .reduce((a, b) => a + b.balance, 0)
      );
    }
  }, [wallets, walletsReady]);

  return (
    <div className="grid grid-cols-12 grid-rows-12 justify-center items-center w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <div className="justify-self-center self-end col-start-3 row-start-2 col-span-2 font-bold text-primary">
        STAN
      </div>
      <div className="justify-self-center self-start col-start-3 row-start-3 col-span-2 font-bold text-4xl">
        <div
          className={`justify-self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="medium" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(+cashBalance + +bankBalance)} zł
        </span>
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-4 font-bold text-primary">
        gotówka
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-4 col-span-2 font-bold text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(cashBalance)} zł
        </span>
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-5 font-bold text-primary">
        konta
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-5 col-span-2 font-bold text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(bankBalance)} zł
        </span>
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-6 font-bold text-primary">
        oszczędności
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-7 col-span-2 font-bold text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(savingsBalance)} zł
        </span>
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-7 font-bold text-primary">
        inwestycje
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-6 col-span-2 font-bold text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(investmentsBalance)} zł
        </span>
      </div>

      <div className="justify-self-center self-end col-start-7 row-start-3 col-span-2 font-bold text-primary">
        PRZYCHÓD
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-4 col-span-2 font-bold text-green-700 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter(
                (transaction) =>
                  transaction.date >= timeLimits.week.startOfWeek &&
                  transaction.date < timeLimits.week.endOfWeek &&
                  transaction.income
              )
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-5 col-span-2 font-bold text-green-700 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter(
                (transaction) =>
                  transaction.date >= timeLimits.month.startOfMonth &&
                  transaction.date < timeLimits.month.endOfMonth &&
                  transaction.income
              )
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-6 col-span-2 font-bold text-green-700 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter(
                (transaction) =>
                  transaction.date >= timeLimits.year.startOfYear &&
                  transaction.date < timeLimits.year.endOfYear &&
                  transaction.income
              )
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-7 col-span-2 font-bold text-green-700 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter((transaction) => transaction.income)
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>
      <div className="justify-self-center self-end col-start-9 row-start-3 col-span-2 font-bold text-primary">
        ROZCHÓD
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-4 col-span-2 font-bold text-red-800 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter(
                (transaction) =>
                  transaction.date >= timeLimits.week.startOfWeek &&
                  transaction.date < timeLimits.week.endOfWeek &&
                  !transaction.income
              )
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-5 col-span-2 font-bold text-red-800 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter(
                (transaction) =>
                  transaction.date >= timeLimits.month.startOfMonth &&
                  transaction.date < timeLimits.month.endOfMonth &&
                  !transaction.income
              )
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-6 col-span-2 font-bold text-red-800 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter(
                (transaction) =>
                  transaction.date >= timeLimits.year.startOfYear &&
                  transaction.date < timeLimits.year.endOfYear &&
                  !transaction.income
              )
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-7 col-span-2 font-bold text-red-800 text-2xl">
        <div
          className={`justify-self-center self-center${
            walletsReady && transactionsReady && " hidden"
          }`}
        >
          <CircularProgress className="mini" indeterminate />
        </div>
        <span className={`${!(walletsReady && transactionsReady) && "hidden"}`}>
          {parseMoney(
            transactions
              .filter((transaction) => !transaction.income)
              .reduce((a, b) => a + b.amount, 0)
          )}{" "}
          zł
        </span>
      </div>

      <div className="justify-self-start self-center col-start-11 row-start-4 font-bold text-primary">
        tydzień
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-5 font-bold text-primary">
        miesiąc
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-6 font-bold text-primary">
        rok
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-7 font-bold text-primary">
        całość
      </div>
    </div>
  );
}
