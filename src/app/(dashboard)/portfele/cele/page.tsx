"use client";
import GoalsPage from "./GoalsPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, wallets, walletsReady, transactions, transactionsReady, methods, reloadWallets, reloadTransfers } = useData();

  if (!user) return null;

  return (
    <GoalsPage
      wallets={wallets}
      walletsReady={walletsReady}
      transactions={transactions}
      transactionsReady={transactionsReady}
      methods={methods}
      userId={user.id}
      reloadWallets={reloadWallets}
      reloadTransfers={reloadTransfers}
    />
  );
}
