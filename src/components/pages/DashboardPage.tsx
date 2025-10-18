"use client";

import { UserT } from "@app/utils/db-actions/user";
import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { TradeT } from "@app/utils/db-actions/trade";
import { MethodT } from "@app/utils/db-actions/method";

import { useEffect, useState } from "react";

import { RouteSegments } from "@app/utils/routes";

import { getWallets } from "@app/api/wallet/get";
import { getTransactions } from "@app/api/transaction/get";
import { getTrades } from "@app/api/trade/get";
import { getMethodsAPI } from "@app/api/method/get";

import WalletsList from "../WalletsList";

import HomePage from "./HomePage";
import HistoryPage from "./HistoryPage";

import TransactionsPage from "./TransactionsPage";

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
import { CategoryT } from "@app/utils/db-actions/category";
import { SuperCategoryT } from "@app/utils/db-actions/super_category";
import { SubjectT } from "@app/utils/db-actions/subject";
import { getSubjects } from "@app/api/subject/get";
import { getSuperCategoriesAPI } from "@app/api/super_category/get";
import { getCategoriessAPI } from "@app/api/category/get";

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
  const [methods, setMethods] = useState<MethodT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [superCategories, setSuperCategories] = useState<SuperCategoryT[]>([]);
  const [subjects, setSubjects] = useState<SubjectT[]>([]);

  const [walletsReady, setWalletsReady] = useState<boolean>(false);
  const [transactionsReady, setTransactionsReady] = useState<boolean>(false);
  const [tradesReady, setTradesReady] = useState<boolean>(false);
  const [methodsReady, setMethodsReady] = useState<boolean>(false);
  const [subjectsReady, setSubjectsReady] = useState<boolean>(false);
  const [superCategoriesReady, setSuperCategoriesReady] =
    useState<boolean>(false);
  const [categoriesReady, setCategoriesReady] = useState<boolean>(false);

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
      .catch((err) => console.log("failed to fetch trades:", err))
      .finally(() => setTradesReady(true));
    getMethodsAPI()
      .then((methods) => setMethods(methods))
      .catch((err) => console.log("failed to fetch methods:", err))
      .finally(() => setMethodsReady(true));
    getSubjects(user.id)
      .then((subjects) => setSubjects(subjects))
      .catch((err) => console.log("failed to fetch subjects:", err))
      .finally(() => setSubjectsReady(true));
    getSuperCategoriesAPI()
      .then((superCategories) => setSuperCategories(superCategories))
      .catch((err) => console.log("failed to fetch super categories:", err))
      .finally(() => setSuperCategoriesReady(true));
    getCategoriessAPI()
      .then((categories) => setCategories(categories))
      .catch((err) => console.log("failed to fetch categories:", err))
      .finally(() => setCategoriesReady(true));
  }, [user.id]);

  const reloadWallets = () =>
    getWallets(user.id)
      .then((wallets) => setWallets(wallets))
      .catch((err) => console.log("failed to fetch wallets:", err))
      .finally(() => setWalletsReady(true));
  const reloadTransactions = () =>
    getTransactions(user.id)
      .then((transactions) => setTransactions(transactions))
      .catch((err) => console.log("failed to fetch transactions:", err))
      .finally(() => setTransactionsReady(true));

  return (
    <div className="grid grid-rows-[56px_1fr]">
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
        ![
          RouteSegments.Trades.toString(),
          RouteSegments.Transfers.toString(),
          RouteSegments.Subjects.toString(),
        ].includes(slug[1]) && (
          <TransactionsPage
            wallets={wallets}
            transactions={transactions}
            methods={methods}
            subjects={subjects.filter((subject) => subject.normal)}
            superCategories={superCategories}
            categories={categories}
            walletsReady={walletsReady}
            transactionsReady={transactionsReady}
            methodsReady={methodsReady}
            subjectsReady={subjectsReady}
            superCategoriesReady={superCategoriesReady}
            categoriesReady={categoriesReady}
            reloadWallets={reloadWallets}
            reloadTransactions={reloadTransactions}
            userId={user.id}
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
