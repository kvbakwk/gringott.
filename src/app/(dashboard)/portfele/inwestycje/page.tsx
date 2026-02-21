"use client";
import InvestmentsPage from "./InvestmentsPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { wallets, walletTypes, walletsReady, assets, assetsReady } = useData();

  return (
    <InvestmentsPage
      wallets={wallets}
      walletTypes={walletTypes}
      walletsReady={walletsReady}
      assets={assets}
      assetsReady={assetsReady}
    />
  );
}
