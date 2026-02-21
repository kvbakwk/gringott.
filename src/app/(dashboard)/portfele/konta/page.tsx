"use client";
import AccountsPage from "./AccountsPage";
import { useData } from "@app/context/DataContext";

export default function Page() {
  const { wallets, walletsReady, user, reloadWallets } = useData();

  if (!user) return null;

  return (
    <AccountsPage
      wallets={wallets}
      walletsReady={walletsReady}
      userId={user.id}
      reloadWallets={reloadWallets}
    />
  );
}
