"use client";
import TradesPage from "./TradesPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { user, wallets, trades, methods, subjects, walletsReady, tradesReady, methodsReady, subjectsReady, reloadWallets, reloadTrades } = useData();

  if (!user) return null;

  return (
    <TradesPage
      wallets={wallets}
      trades={trades}
      methods={methods}
      subjects={subjects}
      walletsReady={walletsReady}
      tradesReady={tradesReady}
      methodsReady={methodsReady}
      subjectsReady={subjectsReady}
      reloadWallets={reloadWallets}
      reloadTrades={reloadTrades}
      userId={user.id}
    />
  );
}
