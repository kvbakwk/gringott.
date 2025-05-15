"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useState } from "react";

import { parseMoney, parseMonth } from "@app/utils/parser";
import { generateTimeLimits } from "@app/utils/generator";
import { CircularProgress } from "../material/Progress";

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
  const [timeLimits, setTimeLimits] = useState(generateTimeLimits());

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
    <div className="grid grid-cols-12 grid-rows-12 justify-center items-center w-[calc(100%-50px)] h-[calc(100%-50px)] bg-surface rounded-2xl shadow-md">
      <div className="justify-self-center self-end col-start-3 row-start-2 col-span-2 font-bold text-primary">
        STAN
      </div>
      <div className="justify-self-center self-start col-start-3 row-start-3 col-span-2 font-bold text-4xl">
        <Value
          amount={+cashBalance + +bankBalance}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-4 font-bold text-primary">
        gotówka
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-4 col-span-2 font-bold text-2xl">
        <Value amount={cashBalance} show={walletsReady && transactionsReady} />
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-5 font-bold text-primary">
        konta
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-5 col-span-2 font-bold text-2xl">
        <Value amount={bankBalance} show={walletsReady && transactionsReady} />
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-6 font-bold text-primary">
        oszczędności
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-7 col-span-2 font-bold text-2xl">
        <Value
          amount={savingsBalance}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-end self-center col-start-2 row-start-7 font-bold text-primary">
        inwestycje
      </div>
      <div className="justify-self-center self-center col-start-3 row-start-6 col-span-2 font-bold text-2xl">
        <Value
          amount={investmentsBalance}
          show={walletsReady && transactionsReady}
        />
      </div>

      <div className="justify-self-center self-end col-start-7 row-start-3 col-span-2 font-bold text-primary">
        PRZYCHÓD
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-4 col-span-2 font-bold text-green-700 text-2xl">
        <Value
          amount={transactions
            .filter(
              (transaction) =>
                transaction.date >= timeLimits.week.startOfWeek &&
                transaction.date < timeLimits.week.endOfWeek &&
                transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-5 col-span-2 font-bold text-green-700 text-2xl">
        <Value
          amount={transactions
            .filter(
              (transaction) =>
                transaction.date >= timeLimits.month.startOfMonth &&
                transaction.date < timeLimits.month.endOfMonth &&
                transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-6 col-span-2 font-bold text-green-700 text-2xl">
        <Value
          amount={transactions
            .filter(
              (transaction) =>
                transaction.date >= timeLimits.year.startOfYear &&
                transaction.date < timeLimits.year.endOfYear &&
                transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-center self-center col-start-7 row-start-7 col-span-2 font-bold text-green-700 text-2xl">
        <Value
          amount={transactions
            .filter((transaction) => transaction.income)
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-center self-end col-start-9 row-start-3 col-span-2 font-bold text-primary">
        ROZCHÓD
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-4 col-span-2 font-bold text-red-800 text-2xl">
        <Value
          amount={transactions
            .filter(
              (transaction) =>
                transaction.date >= timeLimits.week.startOfWeek &&
                transaction.date < timeLimits.week.endOfWeek &&
                !transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-5 col-span-2 font-bold text-red-800 text-2xl">
        <Value
          amount={transactions
            .filter(
              (transaction) =>
                transaction.date >= timeLimits.month.startOfMonth &&
                transaction.date < timeLimits.month.endOfMonth &&
                !transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-6 col-span-2 font-bold text-red-800 text-2xl">
        <Value
          amount={transactions
            .filter(
              (transaction) =>
                transaction.date >= timeLimits.year.startOfYear &&
                transaction.date < timeLimits.year.endOfYear &&
                !transaction.income
            )
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>
      <div className="justify-self-center self-center col-start-9 row-start-7 col-span-2 font-bold text-red-800 text-2xl">
        <Value
          amount={transactions
            .filter((transaction) => !transaction.income)
            .reduce((a, b) => a + b.amount, 0)}
          show={walletsReady && transactionsReady}
        />
      </div>

      <div className="justify-self-start self-center col-start-11 row-start-4 font-bold text-primary">
        tydzień
      </div>
      <div className="justify-self-start self-center col-start-11 col-span-2 row-start-5 font-bold text-primary">
        miesiąc{" "}
        <span className="text-on-surface-variant font-semibold">
          ({parseMonth(new Date().getMonth())})
        </span>
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-6 font-bold text-primary">
        rok{" "}
        <span className="text-on-surface-variant font-semibold">
          ({new Date().getFullYear()})
        </span>
      </div>
      <div className="justify-self-start self-center col-start-11 row-start-7 font-bold text-primary">
        całość
      </div>
    </div>
  );
}

function Value({ amount, show }) {
  return (
    <>
      {show ? (
        <>{parseMoney(amount)} zł</>
      ) : (
        <div className="justify-self-center self-center">
          <CircularProgress className="medium" indeterminate />
        </div>
      )}
    </>
  );
}
