"use client";

import { UserT } from "@app/utils/db-actions/user";
import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { TradeT } from "@app/utils/db-actions/trade";

import { useEffect, useState } from "react";

import { RouteSegments } from "@app/utils/routes";

import { getWallets } from "@app/api/wallet/get";
import { getTransactions } from "@app/api/transaction/get";
import { getTrades } from "@app/api/trade/get";

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
import NewTradePage from "./trades/NewTradePage";
import TradesPage from "./trades/TradesPage";
import DeleteTradePage from "./trades/DeleteTradePage";
import EditTradePage from "./trades/EditTradePage";
import NewTransferPage from "./transfers/NewTransferPage";

export default function DashboardPage({
  slug,
  user,
}: {
  slug: string[] | undefined;
  user: UserT;
}) {
  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [transactions, setTransactions] = useState<TransactionT[]>([]);
  const [trades, setTrades] = useState<TradeT[]>([]);
  const [walletsReady, setWalletsReady] = useState<boolean>(false);
  const [transactionsReady, setTransactionsReady] = useState<boolean>(false);
  const [tradesReady, setTradesReady] = useState<boolean>(false);

  useEffect(() => {
    getWallets(user.id)
      .then((wallets) => setWallets(wallets))
      .catch((err) => console.log("failed to fetch wallets:", err))
      .finally(() => setWalletsReady(true));
    getTransactions(user.id)
      .then((transactions) => setTransactions(transactions))
      .catch((err) => console.log("failed to fetch transactions:", err))
      .finally(() => setTransactionsReady(true));
    getTrades(user.id)
      .then((trades) => setTrades(trades))
      .catch((err) => console.log("failed to fetch transactions:", err))
      .finally(() => setTradesReady(true));
  }, [user.id]);

  return (
    <div className="grid grid-rows-[110px_1fr]">
      <WalletsList wallets={wallets} walletsReady={walletsReady} />
      {(slug === undefined || (slug && slug[0] === RouteSegments.HomePage)) && (
        <HomePage
          wallets={wallets}
          transactions={transactions}
          walletsReady={walletsReady}
          transactionsReady={transactionsReady}
        />
      )}
      {slug && slug[0] === RouteSegments.HistoryPage && (
        <HistoryPage
          wallets={wallets}
          transactions={transactions}
          trades={trades}
          walletsReady={walletsReady}
          transactionsReady={transactionsReady}
          tradesReady={tradesReady}
        />
      )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === undefined && (
          <TransactionsPage
            wallets={wallets}
            transactions={transactions}
            walletsReady={walletsReady}
            transactionsReady={transactionsReady}
          />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.New && (
          <NewTransactionPage userId={user.id} />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Edit &&
        !isNaN(parseInt(slug[2])) && (
          <EditTransactionPage
            userId={user.id}
            transactionId={parseInt(slug[2])}
          />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Delete &&
        !isNaN(parseInt(slug[2])) && (
          <DeleteTransactionPage
            userId={user.id}
            transactionId={parseInt(slug[2])}
          />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Trades &&
        slug[2] === undefined && (
          <TradesPage
            wallets={wallets}
            trades={trades}
            walletsReady={walletsReady}
            tradesReady={transactionsReady}
          />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Trades &&
        slug[2] === RouteSegments.New && <NewTradePage userId={user.id} />}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Trades &&
        slug[2] === RouteSegments.Edit && (
          <EditTradePage userId={user.id} tradeId={parseInt(slug[3])} />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Trades &&
        slug[2] === RouteSegments.Delete && (
          <DeleteTradePage userId={user.id} tradeId={parseInt(slug[3])} />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Transfers &&
        slug[2] === RouteSegments.New && <NewTransferPage userId={user.id} />}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Subjects &&
        slug[2] === undefined && <SubjectsPage userId={user.id} />}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Subjects &&
        slug[2] === RouteSegments.New && <NewSubjectPage userId={user.id} />}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Subjects &&
        slug[2] === RouteSegments.Edit &&
        !isNaN(parseInt(slug[3])) && (
          <EditSubjectPage userId={user.id} subjectId={parseInt(slug[3])} />
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Subjects &&
        slug[2] === RouteSegments.Delete &&
        !isNaN(parseInt(slug[3])) && (
          <DeleteSubjectPage userId={user.id} subjectId={parseInt(slug[3])} />
        )}
      {slug &&
        slug[0] === RouteSegments.Wallets &&
        slug[1] === RouteSegments.New && <NewWalletPage userId={user.id} />}
    </div>
  );
}
