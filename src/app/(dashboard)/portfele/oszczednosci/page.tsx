"use client";
import SavingsPage from "./SavingsPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, wallets, walletsReady, transactions, transactionsReady, transfers, transfersReady, methods, reloadWallets, reloadTransactions, reloadTransfers } = useData();

  if (!user) return null;

  return (
    <SavingsPage
      wallets={wallets}
      walletsReady={walletsReady}
      transactions={transactions}
      transactionsReady={transactionsReady}
      transfers={transfers}
      transfersReady={transfersReady}
      methods={methods}
      userId={user.id}
      reloadWallets={reloadWallets}
      reloadTransactions={reloadTransactions}
      reloadTransfers={reloadTransfers}
    />
  );
}
