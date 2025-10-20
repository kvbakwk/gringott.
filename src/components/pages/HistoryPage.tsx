"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { TradeT } from "@app/utils/db-actions/trade";

import { useEffect, useState } from "react";

import { parseDate, parseMoney } from "@app/utils/parser";
import { generateAllDaysFromOldestTransactionToToday } from "@app/utils/generator";
import { CircularProgress } from "../material/Progress";

export default function HistoryPage({
  wallets,
  transactions,
  trades,
  walletsReady,
  transactionsReady,
  tradesReady,
}: {
  wallets: WalletT[];
  transactions: TransactionT[];
  trades: TradeT[];
  walletsReady: boolean;
  transactionsReady: boolean;
  tradesReady: boolean;
}) {
  const [days, setDays] = useState<Date[]>([]);

  useEffect(
    () =>
      setDays(
        generateAllDaysFromOldestTransactionToToday(transactions, trades)
      ),
    [transactions, trades, transactionsReady, tradesReady]
  );

  return (
    <div className="flex flex-col w-[calc(100%-50px)] h-full">
      <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
        <div className="flex justify-center items-center w-[110px]">data</div>
        <div className="flex justify-center items-center w-[110px]">stan</div>
        <div className="flex justify-center items-center w-[110px]">
          gotówka
        </div>
        <div className="flex justify-center items-center w-[110px]">konta</div>
        <div className="flex justify-center items-center w-[110px]">
          inwestycje
        </div>
        <div className="flex justify-center items-center w-[110px]">
          oszczędności
        </div>
        <div className="flex justify-center items-center w-[110px]">
          skarbonki
        </div>
        <div className="flex justify-center items-center w-[110px]">cele</div>
        <div className="flex justify-center items-center w-[110px]">
          zarobek
        </div>
        <div className="flex justify-center items-center w-[110px]">
          wydatek
        </div>
        <div className="flex justify-center items-center w-[110px]">
          należności
        </div>
      </div>
      <div
        className={`flex gap-[5px] w-full h-[calc(100vh-50px)] px-[60px] pb-[50px] overflow-y-auto scroll-none ${
          walletsReady && transactionsReady && tradesReady
            ? "flex-col"
            : "justify-center items-center"
        }`}>
        {days.map((day) => (
          <div
            className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-md w-full rounded-md hover:bg-surface ${
              !(walletsReady && transactionsReady && tradesReady) && " hidden"
            }`}
            key={day.getTime()}>
            <div className="flex justify-center items-center w-[110px]">
              {parseDate(day)}
            </div>
            <div className="flex justify-center items-center font-semibold w-[110px]">
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
            <div className="flex justify-center items-center w-[110px]">
              {parseMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.date.getTime() - 86399999 <= day.getTime() &&
                      wallets.filter(
                        (wallet) => wallet.id === transaction.wallet_id
                      )[0].wallet_type_id === 1
                  )
                  .reduce(
                    (a, b) => (b.income ? a + b.amount : a - b.amount),
                    0
                  ) +
                  trades
                    .filter(
                      (trade) =>
                        trade.date.getTime() - 86399999 <= day.getTime()
                    )
                    .reduce(
                      (a, b) => (b.deposit ? a - b.amount : a + b.amount),
                      0
                    )
              )}{" "}
              zł
            </div>
            <div className="flex justify-center items-center w-[110px]">
              {parseMoney(
                transactions
                  .filter(
                    (transaction) =>
                      transaction.date.getTime() - 86399999 <= day.getTime() &&
                      wallets.filter(
                        (wallet) => wallet.id === transaction.wallet_id
                      )[0].wallet_type_id === 2
                  )
                  .reduce(
                    (a, b) => (b.income ? a + b.amount : a - b.amount),
                    0
                  ) +
                  trades
                    .filter(
                      (trade) =>
                        trade.date.getTime() - 86399999 <= day.getTime()
                    )
                    .reduce(
                      (a, b) => (b.deposit ? a + b.amount : a - b.amount),
                      0
                    )
              )}{" "}
              zł
            </div>
            <div className="flex justify-center items-center text-red-900 w-[110px]">
              {parseMoney(0)} zł
            </div>
            <div className="flex justify-center items-center text-green-900 w-[110px]">
              {parseMoney(0)} zł
            </div>
            <div className="flex justify-center items-center text-orange-900 w-[110px]">
              {parseMoney(0)} zł
            </div>
            <div className="flex justify-center items-center text-purple-900 w-[110px]">
              {parseMoney(0)} zł
            </div>
            <div className="flex justify-center items-center text-green-700 w-[110px]">
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
            <div className="flex justify-center items-center text-red-800 w-[110px]">
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
            <div className="flex justify-center items-center w-[110px]">
              {parseMoney(0)} zł
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
