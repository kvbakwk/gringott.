"use client";
import HistoryPage from "./HistoryPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { wallets, transactions, trades, walletsReady, transactionsReady, tradesReady } = useData();

  return (
    <HistoryPage
      wallets={wallets}
      transactions={transactions}
      trades={trades}
      walletsReady={walletsReady}
      transactionsReady={transactionsReady}
      tradesReady={tradesReady}
    />
  );
}
