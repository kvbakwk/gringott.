"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

interface DataContextType {
  user: UserT | null;
  wallets: WalletT[];
  walletTypes: WalletTypeT[];
  transactions: TransactionT[];
  trades: TradeT[];
  transfers: TransferT[];
  methods: MethodT[];
  categories: CategoryT[];
  superCategories: SuperCategoryT[];
  subjects: SubjectT[];
  loans: LoanT[];
  assets: AssetT[];
  
  walletsReady: boolean;
  walletTypesReady: boolean;
  transactionsReady: boolean;
  tradesReady: boolean;
  transfersReady: boolean;
  methodsReady: boolean;
  subjectsReady: boolean;
  superCategoriesReady: boolean;
  categoriesReady: boolean;
  loansReady: boolean;
  assetsReady: boolean;

  reloadWallets: () => Promise<void>;
  reloadTransactions: () => Promise<void>;
  reloadTrades: () => Promise<void>;
  reloadTransfers: () => Promise<void>;
  reloadLoans: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, user }: { children: ReactNode; user: UserT }) {
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
  const [superCategoriesReady, setSuperCategoriesReady] = useState<boolean>(false);
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
    if (!user?.id) return;
    
    loadDataFromDB();

    syncData(user.id)
      .then(() => loadDataFromDB())
      .catch((err) => console.error("Sync failed", err));
  }, [user?.id]);

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

  const value = {
    user,
    wallets,
    walletTypes,
    transactions,
    trades,
    transfers,
    methods,
    categories,
    superCategories,
    subjects,
    loans,
    assets,
    walletsReady,
    walletTypesReady,
    transactionsReady,
    tradesReady,
    transfersReady,
    methodsReady,
    subjectsReady,
    superCategoriesReady,
    categoriesReady,
    loansReady,
    assetsReady,
    reloadWallets,
    reloadTransactions,
    reloadTrades,
    reloadTransfers,
    reloadLoans,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
