"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

import { UserT } from "@/types/user";
import { WalletT, WalletTypeT } from "@/types/wallet";
import { TransactionT, TransactionTypeT } from "@/types/transaction";
import { TradeT } from "@/types/trade";
import { TransferT } from "@/types/transfer";
import { MethodT } from "@/types/method";
import { CategoryT, CategoryTypeT } from "@/types/category";
import { SubjectT, SubjectTypeT } from "@/types/subject";
import { LoanT } from "@/types/loan";
import { AssetT, AssetTypeT } from "@/types/asset";

import { syncData } from "@utils/sync";
import { getAllItems, STORES } from "@utils/indexedDB";

interface DataContextType {
  user: UserT | null;
  wallets: WalletT[];
  walletTypes: WalletTypeT[];
  transactions: TransactionT[];
  transactionTypes: TransactionTypeT[];
  trades: TradeT[];
  transfers: TransferT[];
  methods: MethodT[];
  categories: CategoryT[];
  categoryTypes: CategoryTypeT[];
  subjects: SubjectT[];
  subjectTypes: SubjectTypeT[];
  loans: LoanT[];
  assets: AssetT[];
  assetTypes: AssetTypeT[];

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

export function DataProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: UserT;
}) {
  const [wallets, setWallets] = useState<WalletT[]>([]);
  const [walletTypes, setWalletTypes] = useState<WalletTypeT[]>([]);
  const [transactions, setTransactions] = useState<TransactionT[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionTypeT[]>(
    [],
  );
  const [trades, setTrades] = useState<TradeT[]>([]);
  const [transfers, setTransfers] = useState<TransferT[]>([]);
  const [methods, setMethods] = useState<MethodT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryTypeT[]>([]);
  const [subjects, setSubjects] = useState<SubjectT[]>([]);
  const [subjectTypes, setSubjectTypes] = useState<SubjectTypeT[]>([]);
  const [loans, setLoans] = useState<LoanT[]>([]);
  const [assets, setAssets] = useState<AssetT[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetTypeT[]>([]);

  const [isReady, setIsReady] = useState<boolean>(false);

  const loadDataFromDB = useCallback(async () => {
    const [w, wt, tx, txt, tr, tf, sub, subt, meth, cat, ct, ln, ast, astt] =
      await Promise.all([
        getAllItems<WalletT>(STORES.WALLETS),
        getAllItems<WalletTypeT>(STORES.WALLET_TYPES),
        getAllItems<TransactionT>(STORES.TRANSACTIONS),
        getAllItems<TransactionTypeT>(STORES.TRANSACTION_TYPES),
        getAllItems<TradeT>(STORES.TRADES),
        getAllItems<TransferT>(STORES.TRANSFERS),
        getAllItems<SubjectT>(STORES.SUBJECTS),
        getAllItems<SubjectTypeT>(STORES.SUBJECT_TYPES),
        getAllItems<MethodT>(STORES.METHODS),
        getAllItems<CategoryT>(STORES.CATEGORIES),
        getAllItems<CategoryTypeT>(STORES.CATEGORY_TYPES),
        getAllItems<LoanT>(STORES.LOANS),
        getAllItems<AssetT>(STORES.ASSETS),
        getAllItems<AssetTypeT>(STORES.ASSET_TYPES),
      ]);

    setWallets(w);
    setWalletTypes(wt);
    setTransactions(tx.map((t) => ({ ...t, date: new Date(t.date) })));
    setTransactionTypes(txt);
    setTrades(tr.map((t) => ({ ...t, date: new Date(t.date) })));
    setTransfers(tf.map((t) => ({ ...t, date: new Date(t.date) })));
    setSubjects(sub);
    setSubjectTypes(subt);
    setMethods(meth);
    setCategories(cat);
    setCategoryTypes(ct);
    setLoans(ln.map((l) => ({ ...l, created_at: new Date(l.created_at) })));
    setAssets(ast);
    setAssetTypes(astt);

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
    transactionTypes,
    trades,
    transfers,
    methods,
    categories,
    categoryTypes,
    subjects,
    subjectTypes,
    loans,
    assets,
    assetTypes,
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
