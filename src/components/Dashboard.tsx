"use client";

import { UserT } from "@app/utils/db-actions/user";
import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useState } from "react";

import { getWallets } from "@app/api/wallet/get";
import { getTransactions } from "@app/api/transaction/get";
import WalletsList from "./WalletsList";
import HomePage from "./HomePage";
import HistoryPage from "./HistoryPage";
import TransactionsPage from "./TransactionsPage";
import NewTransactionForm from "./forms/NewTransactionForm";
import NewWalletForm from "./forms/NewWalletForm";

export default function Dashboard({
  slug,
  user,
}: {
  slug: string[] | undefined;
  user: UserT;
}) {
  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [transactions, setTransactions] = useState<TransactionT[]>([]);
  const [walletsReady, setWalletsReady] = useState<boolean>(false);
  const [transactionsReady, setTransactionsReady] = useState<boolean>(false);

  useEffect(() => {
    getWallets(user.id)
      .then((wallets) => setWallets(wallets))
      .finally(() => setWalletsReady(true));
    getTransactions(user.id)
      .then((transactions) => setTransactions(transactions))
      .finally(() => setTransactionsReady(true));
  }, []);

  return (
    <div className="grid grid-rows-[110px_1fr]">
      <WalletsList wallets={wallets} walletsReady={walletsReady} />
      {slug === undefined && (
        <HomePage
          wallets={wallets}
          transactions={transactions}
          walletsReady={walletsReady}
          transactionsReady={transactionsReady}
        />
      )}
      {slug && slug[0] === "historia" && (
        <HistoryPage
          wallets={wallets}
          transactions={transactions}
          walletsReady={walletsReady}
          transactionsReady={transactionsReady}
        />
      )}
      {slug && slug[0] === "transakcje" && (
        <TransactionsPage
          wallets={wallets}
          transactions={transactions}
          walletsReady={walletsReady}
          transactionsReady={transactionsReady}
        />
      )}
      {slug && slug[0] === "nowa-transakcja" && (
        <div className="flex justify-center items-center w-full h-full bg-surface rounded-tl-2xl shadow-sm">
          <NewTransactionForm userId={user.id} />
        </div>
      )}
      {slug && slug[0] === "nowe-konto" && (
        <div className="flex justify-center items-center w-full h-full bg-surface rounded-tl-2xl shadow-sm">
          <NewWalletForm userId={user.id} />
        </div>
      )}
    </div>
  );
}
