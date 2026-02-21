"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { TransferT } from "@app/utils/db-actions/transfer";
import { MethodT } from "@app/utils/db-actions/method";
import { parseDate, parseMoney } from "@app/utils/parser";
import { Icon } from "@components/material/Icon";
import { CircularProgress } from "@components/material/Progress";
import NewDepositForm from "@components/forms/transfers/NewDepositForm";
import NewWithdrawalForm from "@components/forms/transfers/NewWithdrawalForm";

export default function SavingsPage({
  wallets,
  walletsReady,
  transactions,
  transactionsReady,
  transfers,
  transfersReady,
  methods,
  userId,
  reloadWallets,
  reloadTransactions,
  reloadTransfers,
}: {
  wallets: WalletT[];
  walletsReady: boolean;
  transactions: TransactionT[];
  transactionsReady: boolean;
  transfers: TransferT[];
  transfersReady: boolean;
  methods: MethodT[];
  userId: number;
  reloadWallets: () => Promise<void>;
  reloadTransactions: () => Promise<void>;
  reloadTransfers: () => Promise<void>;
}) {
  const [activeForm, setActiveForm] = useState<"deposit" | "withdrawal" | null>(null);
  const formEl = useRef<HTMLDivElement>(null);

  // Corrected: 3 is Savings
  const savingsWallets = useMemo(() => wallets.filter((w) => w.wallet_type_id === 3), [wallets]);
  const savingsWalletIds = useMemo(() => new Set(savingsWallets.map(w => w.id)), [savingsWallets]);

  const totalBalance = useMemo(() => savingsWallets.reduce((a, b) => a + b.balance, 0), [savingsWallets]);

  const savingsItems = useMemo(() => {
    const txs = transactions
      .filter(t => savingsWalletIds.has(t.wallet_id))
      .map(t => ({
          id: `tx-${t.id}`,
          date: new Date(t.date),
          description: t.description || (t.income ? "Wpłata" : "Wypłata"),
          amount: t.amount,
          income: t.income,
          type: "transaction"
      }));

    const trs = transfers
      .filter(t => savingsWalletIds.has(t.to_wallet_id) || savingsWalletIds.has(t.from_wallet_id))
      .map(t => {
          const isDeposit = savingsWalletIds.has(t.to_wallet_id);
          return {
            id: `tr-${t.id}`,
            date: new Date(t.date),
            description: isDeposit ? "Wpłata z portfela" : "Wypłata na inne konto",
            amount: t.amount,
            income: isDeposit,
            type: "transfer"
          };
      });

    return [...txs, ...trs].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, transfers, savingsWalletIds]);

  const currentMonthGrowth = useMemo(() => {
     const now = new Date();
     const thisMonth = savingsItems.filter(t => {
        return t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear();
     });
     return thisMonth.reduce((sum, t) => t.income ? sum + t.amount : sum - t.amount, 0);
  }, [savingsItems]);

  useEffect(() => {
    if (activeForm) {
      formEl.current?.classList.remove("hidden");
      formEl.current?.classList.add("flex");
      setTimeout(() => {
        formEl.current?.classList.remove("opacity-0");
      }, 1);
    } else {
      formEl.current?.classList.add("opacity-0");
      setTimeout(() => {
        formEl.current?.classList.remove("flex");
        formEl.current?.classList.add("hidden");
      }, 200);
    }
  }, [activeForm]);

  const handleSuccess = () => {
    setActiveForm(null);
    reloadWallets();
    reloadTransactions();
    reloadTransfers();
  };

  const isLoading = !walletsReady || !transactionsReady || !transfersReady;

  return (
    <div className="flex flex-col w-full h-full p-8 gap-4 overflow-y-auto overflow-x-hidden bg-background">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-on-surface">oszczędności</h1>
            <p className="text-on-surface-variant max-w-2xl">
            twoje centrum finansowego bezpieczeństwa. zarządzaj swoimi oszczędnościami w jednym miejscu.
            </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setActiveForm("deposit")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer bg-green-600 text-white hover:bg-green-700 transition-all shadow-sm border border-transparent"
            >
                <Icon className="text-xl">add_circle</Icon>
                <span className="text-sm font-bold">wpłać</span>
            </button>
            <button 
                onClick={() => setActiveForm("withdrawal")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm border border-transparent"
            >
                <Icon className="text-xl">remove_circle</Icon>
                <span className="text-sm font-bold">wypłać</span>
            </button>
        </div>
      </div>

      {/* Summary Card and List Layout */}
      <div className="flex flex-col gap-4">
          
          {/* Summary Card */}
          <div className="p-8 bg-surface rounded-3xl flex justify-between items-center w-full">
             <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">suma oszczędności</span>
                <div className={`text-4xl font-bold flex items-baseline gap-2 ${totalBalance > 0 ? 'text-green-600' : 'text-on-surface'}`}>
                    <Value amount={totalBalance} show={walletsReady} suffix="" /> 
                    <span className={`text-xl font-medium ${totalBalance > 0 ? 'text-green-600/70' : 'text-on-surface/50'}`}>PLN</span>
                </div>
                 {currentMonthGrowth !== 0 && (
                    <div className={`mt-3 px-3 py-1 rounded-md text-sm font-medium w-fit flex items-center gap-1 ${currentMonthGrowth >= 0 ? 'bg-green-100/50 text-green-800' : 'bg-red-100/50 text-red-800'}`}>
                        <Icon className="text-sm">{currentMonthGrowth >= 0 ? 'trending_up' : 'trending_down'}</Icon>
                        <span>{currentMonthGrowth >= 0 ? '+' : ''}{parseMoney(currentMonthGrowth)} PLN w tym miesiącu</span>
                    </div>
                 )}
             </div>
          </div>

          {/* Activity List */}
          <div className="bg-surface rounded-3xl overflow-hidden mb-8">
             <div className="px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2 text-lg font-bold text-on-surface">
                   <Icon className="text-on-surface-variant">history</Icon>
                   historia operacji
                </div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{savingsItems.length} operacji</span>
             </div>

             <div className="flex flex-col">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <CircularProgress indeterminate />
                    </div>
                ) : savingsItems.length === 0 ? (
                    <div className="mx-8 mb-8 p-12 text-center text-on-surface-variant opacity-50 bg-white/50 rounded-3xl border-2 border-dashed border-outline-variant/30">
                        brak zarejestrowanych operacji.
                    </div>
                ) : (
                    savingsItems.map((item, idx) => (
                        <div 
                            key={item.id}
                            className={`flex justify-between items-center px-8 py-5 hover:bg-surface-variant/10 transition-colors ${idx !== savingsItems.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.income ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    <Icon className="text-2xl">{item.income ? 'south_west' : 'north_east'}</Icon>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-base font-bold text-on-surface tracking-tight">{parseDate(item.date)}</span>
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-70">
                                        {item.income ? 'Zasilenie' : 'Wypłata'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-bold ${item.income ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.income ? '+' : '-'}{parseMoney(item.amount)} <span className="text-xs opacity-60">PLN</span>
                                </span>
                            </div>
                        </div>
                    ))
                )}
             </div>
          </div>
      </div>

      {/* Form Overlay */}
      <div
        ref={formEl}
        className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm"
      >
        {activeForm === "deposit" && (
            <NewDepositForm 
                userId={userId}
                wallets={wallets}
                methods={methods}
                successOperation={handleSuccess}
                cancelOperation={() => setActiveForm(null)}
            />
        )}
        {activeForm === "withdrawal" && (
            <NewWithdrawalForm 
                userId={userId}
                wallets={wallets}
                methods={methods}
                successOperation={handleSuccess}
                cancelOperation={() => setActiveForm(null)}
            />
        )}
      </div>
    </div>
  );
}

function Value({ amount, show, suffix = "" }: { amount: number, show: boolean, suffix?: string }) {
  return (
    <span>
      {show ? (
        <>{parseMoney(amount)} {suffix}</>
      ) : (
        <span className="inline-block w-4 h-4 align-middle">
           <CircularProgress className="tiny" indeterminate />
        </span>
      )}
    </span>
  );
}
