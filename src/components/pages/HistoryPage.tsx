"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useState } from "react";

import { parseDate, parseMoney } from "@app/utils/parser";
import { generateAllDaysFromOldestTransactionToToday } from "@app/utils/generator";
import { CircularProgress } from "../material/Progress";

export default function HistoryPage({
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
  const [days, setDays] = useState<Date[]>(
    generateAllDaysFromOldestTransactionToToday(transactions)
  );

  useEffect(
    () => setDays(generateAllDaysFromOldestTransactionToToday(transactions)),
    [transactions, transactionsReady]
  );

  return (
    <div className="flex flex-col w-[calc(100%-50px)] h-[calc(100%-50px)] bg-surface rounded-2xl shadow-md">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
        <div className="flex justify-center items-center w-[200px]">DATA</div>
        <div className="flex justify-center items-center w-[200px]">STAN</div>
        <div className="flex justify-center items-center w-[200px]">
          GOTÓWKA
        </div>
        <div className="flex justify-center items-center w-[200px]">KONTA</div>
        <div className="flex justify-center items-center w-[200px]">
          PRZYCHÓD
        </div>
        <div className="flex justify-center items-center w-[200px]">
          ROZCHÓD
        </div>
      </div>
      <div
        className={`flex gap-[5px] w-full h-[calc(100vh-160px)] pb-[30px] overflow-y-auto scroll-none ${
          walletsReady && transactionsReady
            ? "flex-col"
            : "justify-center items-center"
        }`}
      >
        {days.map((day) => (
          <div
            className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-md w-full${
              !(walletsReady && transactionsReady) && " hidden"
            }`}
            key={day.getTime()}
          >
            <div className="flex justify-center items-center w-[200px]">
              {parseDate(day)}
            </div>
            <div className="flex justify-center items-center font-semibold w-[200px]">
              {parseMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.date.getTime() - 86399999 <= day.getTime()
                  )
                  .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0)
              )}{" "}
              zł
            </div>
            <div className="flex justify-center items-center w-[200px]">
              {parseMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.date.getTime() - 86399999 <= day.getTime() &&
                      wallets.filter(
                        (wallet) => wallet.id === transaction.wallet_id
                      )[0].wallet_type_id === 1
                  )
                  .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0)
              )}{" "}
              zł
            </div>
            <div className="flex justify-center items-center w-[200px]">
              {parseMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.date.getTime() - 86399999 <= day.getTime() &&
                      wallets.filter(
                        (wallet) => wallet.id === transaction.wallet_id
                      )[0].wallet_type_id === 2
                  )
                  .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0)
              )}{" "}
              zł
            </div>
            <div className="flex justify-center items-center text-green-700 w-[200px]">
              {parseMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.date.getTime() >= day.getTime() &&
                      transaction.date.getTime() < day.getTime() + 86400000 &&
                      transaction.income
                  )
                  .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0)
              )}{" "}
              zł
            </div>
            <div className="flex justify-center items-center text-red-800 w-[200px]">
              {parseMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.date.getTime() >= day.getTime() &&
                      transaction.date.getTime() < day.getTime() + 86400000 &&
                      !transaction.income
                  )
                  .reduce((a, b) => a + b.amount, 0)
              )}{" "}
              zł
            </div>
          </div>
        ))}
        <div className={`${walletsReady && transactionsReady && " hidden"}`}>
          <CircularProgress indeterminate />
        </div>
      </div>
    </div>
  );
}
