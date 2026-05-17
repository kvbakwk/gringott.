"use client";

import { useEffect, useState } from "react";
import { useData } from "@context/DataContext";

import { parseDate, parseMoney } from "@utils/parser";
import { generateAllDaysFromOldestTransactionToToday } from "@utils/generator";
import { CircularProgress } from "@components/material/Progress";
import { da } from "zod/v4/locales";
import { WalletT } from "@/types/wallet";
import { TransactionT } from "@/types/transaction";
import { TradeT } from "@/types/trade";

export default function HistoryPage() {
  const { wallets, transactions, trades, isReady } = useData();
  const [days, setDays] = useState<Date[]>([]);

  useEffect(
    () =>
      setDays(
        generateAllDaysFromOldestTransactionToToday(transactions, trades),
      ),
    [transactions, trades, isReady],
  );

  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="flex flex-col min-w-[1410px] h-full">
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
        <div className="flex justify-center items-center w-full h-[24px] px-[60px]">
          {days.length && (
            <Day
              day={days[0]}
              wallets={wallets}
              transactions={transactions}
              trades={trades}
              isReady={isReady}
              active={true}
            />
          )}
        </div>
        <div
          className={`flex gap-[5px] w-full flex-1 min-h-0 px-[60px] pt-[6px] pb-[20px] overflow-y-auto scroll-none ${
            isReady ? "flex-col" : "justify-center items-center"
          }`}
        >
          {days
            .filter((day, i) => i !== 0)
            .map((day) => (
              <Day
                day={day}
                wallets={wallets}
                transactions={transactions}
                trades={trades}
                isReady={isReady}
                active={false}
                key={day.getTime()}
              />
            ))}
          <div className={`${isReady && " hidden"}`}>
            <CircularProgress indeterminate />
          </div>
        </div>
      </div>
    </div>
  );
}

function Day({
  day,
  wallets,
  transactions,
  trades,
  isReady,
  active,
}: {
  day: Date;
  wallets: WalletT[];
  transactions: TransactionT[];
  trades: TradeT[];
  isReady: boolean;
  active: boolean;
}) {
  return (
    <div
      className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-md w-full rounded-md ${
        active ? "bg-surface" : "hover:bg-surface"
      } ${!isReady && " hidden"}`}
      key={day.getTime()}
    >
      <div className="flex justify-center items-center w-[110px]">
        {parseDate(day)}
      </div>
      <div className="flex justify-center items-center font-semibold w-[110px]">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date.getTime() - 86399999 <= day.getTime(),
            )
            .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0),
        )}{" "}
        zł
      </div>
      <div className="flex justify-center items-center w-[110px]">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date.getTime() - 86399999 <= day.getTime() &&
                wallets.find((wallet) => wallet.id === transaction.wallet_id)
                  ?.wallet_type_id === 1,
            )
            .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0) +
            trades
              .filter(
                (trade) => trade.date.getTime() - 86399999 <= day.getTime(),
              )
              .reduce((a, b) => (b.deposit ? a - b.amount : a + b.amount), 0),
        )}{" "}
        zł
      </div>
      <div className="flex justify-center items-center w-[110px]">
        {parseMoney(
          transactions
            .filter(
              (transaction) =>
                transaction.date.getTime() - 86399999 <= day.getTime() &&
                wallets.find((wallet) => wallet.id === transaction.wallet_id)
                  ?.wallet_type_id === 2,
            )
            .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0) +
            trades
              .filter(
                (trade) => trade.date.getTime() - 86399999 <= day.getTime(),
              )
              .reduce((a, b) => (b.deposit ? a + b.amount : a - b.amount), 0),
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
                transaction.income,
            )
            .reduce((a, b) => (b.income ? a + b.amount : a - b.amount), 0),
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
                !transaction.income,
            )
            .reduce((a, b) => a + b.amount, 0),
        )}{" "}
        zł
      </div>
      <div className="flex justify-center items-center w-[110px]">
        {parseMoney(0)} zł
      </div>
    </div>
  );
}
