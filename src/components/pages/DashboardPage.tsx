"use client";

import { UserT } from "@app/utils/db-actions/user";
import { WalletT, WalletTypeT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { TradeT } from "@app/utils/db-actions/trade";
import { TransferT } from "@app/utils/db-actions/transfer";
import { MethodT } from "@app/utils/db-actions/method";
import { SubjectT } from "@app/utils/db-actions/subject";
import { CategoryT } from "@app/utils/db-actions/category";
import { SuperCategoryT } from "@app/utils/db-actions/super_category";
import { LoanT } from "@app/utils/db-actions/loan";
import { AssetT } from "@app/utils/db-actions/asset";
import { syncData } from "@app/utils/sync";
import { getAllItems, STORES } from "@app/utils/indexedDB";

import { useEffect, useState } from "react";

import { RouteSegments } from "@app/utils/routes";

import HomePage from "@app/(dashboard)/HomePage";
import AccountsPage from "@app/(dashboard)/portfele/konta/AccountsPage";
import HistoryPage from "@app/(dashboard)/historia/HistoryPage";
import TransactionsPage from "@app/(dashboard)/transakcje/TransactionsPage";
import TradesPage from "@app/(dashboard)/transakcje/wymiany/TradesPage";
import TransfersPage from "@app/(dashboard)/transakcje/transfery/TransfersPage";
import SubjectsPage from "@app/(dashboard)/transakcje/podmioty/SubjectsPage";
import LoansSummaryPage from "@app/(dashboard)/portfele/naleznosci/LoansSummaryPage";
import LoansHistoryPage from "@app/(dashboard)/transakcje/splaty/LoansHistoryPage";
import InvestmentsPage from "@app/(dashboard)/portfele/inwestycje/InvestmentsPage";
import SavingsPage from "@app/(dashboard)/portfele/oszczednosci/SavingsPage";
import PiggybanksPage from "@app/(dashboard)/portfele/skarbonki/PiggybanksPage";
import GoalsPage from "@app/(dashboard)/portfele/cele/GoalsPage";

export default function DashboardPage({
  slug,
  user,
}: {
  slug: string[] | undefined;
  user: UserT;
}) {
  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [walletTypes, setWalletTypes] = useState<WalletTypeT[]>([]);
  const [transactions, setTransactions] = useState<TransactionT[]>([]);
  const [trades, setTrades] = useState<TradeT[]>([]);
  const [transfers, setTransfers] = useState<TransferT[]>([]);
  const [methods, setMethods] = useState<MethodT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [superCategories, setSuperCategories] = useState<SuperCategoryT[]>([]);
  const [subjects, setSubjects] = useState<SubjectT[]>([]);
  const [loans, setLoans] = useState<LoanT[]>([]);
  const [assets, setAssets] = useState<AssetT[]>([]);

  const [walletsReady, setWalletsReady] = useState<boolean>(false);
  const [walletTypesReady, setWalletTypesReady] = useState<boolean>(false);
  const [transactionsReady, setTransactionsReady] = useState<boolean>(false);
  const [tradesReady, setTradesReady] = useState<boolean>(false);
  const [transfersReady, setTransfersReady] = useState<boolean>(false);
  const [methodsReady, setMethodsReady] = useState<boolean>(false);
  const [subjectsReady, setSubjectsReady] = useState<boolean>(false);
  const [superCategoriesReady, setSuperCategoriesReady] =
    useState<boolean>(false);
  const [categoriesReady, setCategoriesReady] = useState<boolean>(false);
  const [loansReady, setLoansReady] = useState<boolean>(false);
  const [assetsReady, setAssetsReady] = useState<boolean>(false);

  const loadDataFromDB = async () => {
    setWallets(await getAllItems<WalletT>(STORES.WALLETS));
    setWalletTypes(await getAllItems<WalletTypeT>(STORES.WALLET_TYPES));
    const txs = await getAllItems<any>(STORES.TRANSACTIONS);
    setTransactions(txs.map((t: any) => ({ ...t, date: new Date(t.date), updated_at: new Date(t.updated_at), deleted_at: t.deleted_at ? new Date(t.deleted_at) : null })));
    const trades = await getAllItems<any>(STORES.TRADES);
    setTrades(trades.map((t: any) => ({ ...t, date: new Date(t.date), updated_at: new Date(t.updated_at), deleted_at: t.deleted_at ? new Date(t.deleted_at) : null })));
    const transfers = await getAllItems<any>(STORES.TRANSFERS);
    setTransfers(transfers.map((t: any) => ({ ...t, date: new Date(t.date), updated_at: new Date(t.updated_at), deleted_at: t.deleted_at ? new Date(t.deleted_at) : null })));
    setSubjects(await getAllItems<SubjectT>(STORES.SUBJECTS));
    setMethods(await getAllItems<MethodT>(STORES.METHODS));
    setCategories(await getAllItems<CategoryT>(STORES.CATEGORIES));
    setSuperCategories(await getAllItems<SuperCategoryT>(STORES.SUPER_CATEGORIES));
    const loans = await getAllItems<any>(STORES.LOANS);
    setLoans(loans.map((l: any) => ({ ...l, created_at: new Date(l.created_at), updated_at: new Date(l.updated_at), deleted_at: l.deleted_at ? new Date(l.deleted_at) : null })));
    setAssets(await getAllItems<AssetT>(STORES.ASSETS));

    setWalletsReady(true);
    setWalletTypesReady(true);
    setTransactionsReady(true);
    setTradesReady(true);
    setTransfersReady(true);
    setSubjectsReady(true);
    setMethodsReady(true);
    setCategoriesReady(true);
    setSuperCategoriesReady(true);
    setLoansReady(true);
    setAssetsReady(true);
  };

  useEffect(() => {
    loadDataFromDB();

    syncData(user.id)
      .then(() => loadDataFromDB())
      .catch((err) => console.error("Sync failed", err));
  }, [user.id]);

  const reloadWallets = () =>
    syncData(user.id).then(() => getAllItems<WalletT>(STORES.WALLETS).then(setWallets));
  const reloadTransactions = () =>
    syncData(user.id).then(() => getAllItems<any>(STORES.TRANSACTIONS).then((txs) => setTransactions(txs.map((t: any) => ({ ...t, date: new Date(t.date), updated_at: new Date(t.updated_at), deleted_at: t.deleted_at ? new Date(t.deleted_at) : null })))));
  const reloadTrades = () =>
    syncData(user.id).then(() => getAllItems<any>(STORES.TRADES).then((trades) => setTrades(trades.map((t: any) => ({ ...t, date: new Date(t.date), updated_at: new Date(t.updated_at), deleted_at: t.deleted_at ? new Date(t.deleted_at) : null })))));
  const reloadTransfers = () =>
    syncData(user.id).then(() => getAllItems<any>(STORES.TRANSFERS).then((transfers) => setTransfers(transfers.map((t: any) => ({ ...t, date: new Date(t.date), updated_at: new Date(t.updated_at), deleted_at: t.deleted_at ? new Date(t.deleted_at) : null })))));
  const reloadLoans = () =>
    syncData(user.id).then(() => getAllItems<any>(STORES.LOANS).then((loans) => setLoans(loans.map((l: any) => ({ ...l, created_at: new Date(l.created_at), updated_at: new Date(l.updated_at), deleted_at: l.deleted_at ? new Date(l.deleted_at) : null })))));

  return (
    <div className="w-full h-full relative overflow-hidden">
      {(slug === undefined || (slug && slug[0] === RouteSegments.HomePage)) && (
        <HomePage
          user={user}
          wallets={wallets}
          transactions={transactions}
          subjects={subjects}
          categories={categories}
          walletsReady={walletsReady}
          transactionsReady={transactionsReady}
          subjectsReady={subjectsReady}
          categoriesReady={categoriesReady}
        />
      )}
      {slug &&
        slug[0] === RouteSegments.Wallets &&
        slug[1] === RouteSegments.Accounts && (
          <AccountsPage 
            wallets={wallets} 
            walletsReady={walletsReady} 
            userId={user.id}
            reloadWallets={reloadWallets}
          />
        )}
      {slug &&
        slug[0] === RouteSegments.Wallets &&
        slug[1] === RouteSegments.Investments && (
          <InvestmentsPage 
            wallets={wallets} 
            walletTypes={walletTypes}
            walletsReady={walletsReady} 
            assets={assets}
            assetsReady={assetsReady}
          />
        )}
      {slug &&
        slug[0] === RouteSegments.Wallets &&
        slug[1] === RouteSegments.Savings && (
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
        )}
      {slug &&
        slug[0] === RouteSegments.Wallets &&
        slug[1] === RouteSegments.Piggybanks && (
          <PiggybanksPage 
            wallets={wallets} 
            walletsReady={walletsReady} 
            transactions={transactions}
            transactionsReady={transactionsReady}
            methods={methods}
            userId={user.id}
            reloadWallets={reloadWallets}
            reloadTransfers={reloadTransfers}
          />
        )}
      {slug &&
        slug[0] === RouteSegments.Wallets &&
        slug[1] === RouteSegments.Goals && (
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
          RouteSegments.Categories.toString(),
          RouteSegments.Methods.toString(),
          RouteSegments.Lending.toString(),
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
        slug[1] === RouteSegments.Trades && (
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
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Transfers && (
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
        )}
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Lending && (
          <LoansHistoryPage
            loans={loans}
            transactions={transactions}
            subjects={subjects}
            wallets={wallets}
            methods={methods}
            categories={categories}
            superCategories={superCategories}
            loansReady={loansReady}
            transactionsReady={transactionsReady}
            walletsReady={walletsReady}
            subjectsReady={subjectsReady}
            methodsReady={methodsReady}
            categoriesReady={categoriesReady}
            superCategoriesReady={superCategoriesReady}
            reloadLoans={reloadLoans}
            reloadTransactions={reloadTransactions}
            userId={user.id}
          />
        )
      }
      {slug &&
        slug[0] === RouteSegments.Transactions &&
        slug[1] === RouteSegments.Subjects &&
        slug[2] === undefined && <SubjectsPage userId={user.id} />}

      {slug &&
        slug[0] === RouteSegments.Wallets &&
        slug[1] === RouteSegments.Loans && (
          <LoansSummaryPage
            loans={loans}
            transactions={transactions}
            subjects={subjects}
            wallets={wallets}
            loansReady={loansReady}
            transactionsReady={transactionsReady}
            walletsReady={walletsReady}
            subjectsReady={subjectsReady}
            reloadLoans={reloadLoans}
            reloadTransactions={reloadTransactions}
            reloadWallets={reloadWallets}
            userId={user.id}
          />
        )
      }
    </div>
  );
}
