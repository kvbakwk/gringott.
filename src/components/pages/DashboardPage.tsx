"use client";

import { UserT } from "@app/utils/db-actions/user";
import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useState } from "react";

import { getWallets } from "@app/api/wallet/get";
import { getTransactions } from "@app/api/transaction/get";

import WalletsList from "../WalletsList";

import HomePage from "./HomePage";
import HistoryPage from "./HistoryPage";

import TransactionsPage from "./transactions/TransactionsPage";
import NewTransactionPage from "./transactions/NewTransactionPage";
import EditTransactionPage from "./transactions/EditTransactionPage";
import DeleteTransactionPage from "./transactions/DeleteTransactionPage";

import SubjectsPage from "./subjects/SubjectsPage";
import NewSubjectPage from "./subjects/NewSubjectPage";
import EditSubjectPage from "./subjects/EditSubjectPage";
import DeleteSubjectPage from "./subjects/DeleteSubjectPage";

import NewWalletPage from "./wallets/NewWalletPage";

export default function DashboardPage({
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
      {slug && slug[0] === "transakcje" && slug[1] === undefined && (
        <TransactionsPage
          wallets={wallets}
          transactions={transactions}
          walletsReady={walletsReady}
          transactionsReady={transactionsReady}
        />
      )}
      {slug && slug[0] === "transakcje" && slug[1] === "nowa" && (
        <NewTransactionPage userId={user.id} />
      )}
      {slug &&
        slug[0] === "transakcje" &&
        slug[1] === "edycja" &&
        !isNaN(parseInt(slug[2])) && (
          <EditTransactionPage
            userId={user.id}
            transactionId={parseInt(slug[2])}
          />
        )}
      {slug &&
        slug[0] === "transakcje" &&
        slug[1] === "usuwanie" &&
        !isNaN(parseInt(slug[2])) && (
          <DeleteTransactionPage
            userId={user.id}
            transactionId={parseInt(slug[2])}
          />
        )}
      {slug &&
        slug[0] === "transakcje" &&
        slug[1] === "podmioty" &&
        slug[2] === undefined && <SubjectsPage userId={user.id} />}
      {slug &&
        slug[0] === "transakcje" &&
        slug[1] === "podmioty" &&
        slug[2] === "nowy" && <NewSubjectPage userId={user.id} />}
      {slug &&
        slug[0] === "transakcje" &&
        slug[1] === "podmioty" &&
        slug[2] === "edycja" &&
        !isNaN(parseInt(slug[3])) && (
          <EditSubjectPage userId={user.id} subjectId={parseInt(slug[3])} />
        )}
      {slug &&
        slug[0] === "transakcje" &&
        slug[1] === "podmioty" &&
        slug[2] === "usuwanie" &&
        !isNaN(parseInt(slug[3])) && (
          <DeleteSubjectPage userId={user.id} subjectId={parseInt(slug[3])} />
        )}
      {slug && slug[0] === "nowe-konto" && <NewWalletPage userId={user.id} />}
    </div>
  );
}
