"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { UserT } from "@utils/db-actions/user";
import { WalletT, WalletTypeT } from "@utils/db-actions/wallet";
import { TransactionT } from "@utils/db-actions/transaction";
import { TradeT } from "@utils/db-actions/trade";
import { TransferT } from "@utils/db-actions/transfer";
import { MethodT } from "@utils/db-actions/method";
import { SubjectT } from "@utils/db-actions/subject";
import { CategoryT } from "@utils/db-actions/category";
import { SuperCategoryT } from "@utils/db-actions/super_category";
import { LoanT } from "@utils/db-actions/loan";
import { AssetT } from "@utils/db-actions/asset";
import { syncData } from "@utils/sync";
import { getAllItems, STORES } from "@utils/indexedDB";

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
  
  isReady: boolean;
  sync: () => Promise<void>;
  
  // Backward compatibility for existing components
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

  const [isReady, setIsReady] = useState<boolean>(false);

  const loadDataFromDB = useCallback(async () => {
    const [
        w, wt, tx, tr, tf, sub, meth, cat, scat, ln, ast
    ] = await Promise.all([
        getAllItems<WalletT>(STORES.WALLETS),
        getAllItems<WalletTypeT>(STORES.WALLET_TYPES),
        getAllItems<TransactionT>(STORES.TRANSACTIONS),
        getAllItems<TradeT>(STORES.TRADES),
        getAllItems<TransferT>(STORES.TRANSFERS),
        getAllItems<SubjectT>(STORES.SUBJECTS),
        getAllItems<MethodT>(STORES.METHODS),
        getAllItems<CategoryT>(STORES.CATEGORIES),
        getAllItems<SuperCategoryT>(STORES.SUPER_CATEGORIES),
        getAllItems<LoanT>(STORES.LOANS),
        getAllItems<AssetT>(STORES.ASSETS)
    ]);

    setWallets(w);
    setWalletTypes(wt);
    setTransactions(tx.map(t => ({ ...t, date: new Date(t.date) })));
    setTrades(tr.map(t => ({ ...t, date: new Date(t.date) })));
    setTransfers(tf.map(t => ({ ...t, date: new Date(t.date) })));
    setSubjects(sub);
    setMethods(meth);
    setCategories(cat);
    setSuperCategories(scat);
    setLoans(ln.map(l => ({ ...l, created_at: new Date(l.created_at) })));
    setAssets(ast);

    setIsReady(true);
  }, []);

  const sync = useCallback(async () => {
    await syncData();
    await loadDataFromDB();
  }, [loadDataFromDB]);

  useEffect(() => {
    if (!user?.id) return;
    
    loadDataFromDB().then(() => sync());
  }, [user?.id, loadDataFromDB, sync]);

  // Backward compatibility mappings
  const reloadWallets = sync;
  const reloadTransactions = sync;
  const reloadTrades = sync;
  const reloadTransfers = sync;
  const reloadLoans = sync;

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
    isReady,
    sync,
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
