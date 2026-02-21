"use client";
import TransfersPage from "./TransfersPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, wallets, transfers, methods, subjects, walletsReady, transfersReady, methodsReady, subjectsReady, reloadWallets, reloadTransfers } = useData();

  if (!user) return null;

  return (
    <TransfersPage
      wallets={wallets}
      transfers={transfers}
      methods={methods}
      subjects={subjects}
      walletsReady={walletsReady}
      transfersReady={transfersReady}
      methodsReady={methodsReady}
      subjectsReady={subjectsReady}
      reloadWallets={reloadWallets}
      reloadTransfers={reloadTransfers}
      userId={user.id}
    />
  );
}
