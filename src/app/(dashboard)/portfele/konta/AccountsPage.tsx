"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useData } from "@context/DataContext";
import { WalletT } from "@utils/db-actions/wallet";
import { parseMoney } from "@utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Icon } from "@components/material/Icon";
import NewAccountForm from "@components/forms/wallets/NewAccountForm";
import DeleteAccountForm from "@components/forms/wallets/DeleteAccountForm";

export default function AccountsPage() {
  const { wallets, isReady, user, reloadWallets } = useData();
  const [activeModal, setActiveModal] = useState<"new" | "delete" | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletT | null>(null);
  const formEl = useRef<HTMLDivElement>(null);

  const bankAccounts = wallets.filter((w) => w.wallet_type_id === 2);
  const cashWallets = wallets.filter((w) => w.wallet_type_id === 1);

  useEffect(() => {
    if (activeModal) {
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
  }, [activeModal]);

  const handleSuccess = () => {
    setActiveModal(null);
    setSelectedWallet(null);
    reloadWallets();
  };

  const openDeleteModal = (wallet: WalletT) => {
    setSelectedWallet(wallet);
    setActiveModal("delete");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col w-full h-full p-8 gap-8 overflow-y-auto bg-background relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">konta</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            zarządzaj swoimi kontami bankowymi i portfelami gotówkowymi
          </p>
        </div>
        <button 
            onClick={() => setActiveModal("new")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer bg-primary text-on-primary hover:opacity-90 transition-all shadow-sm border border-transparent"
        >
          <Icon className="text-xl">add</Icon>
          <span className="text-sm font-bold">dodaj konto</span>
        </button>
      </div>

      {/* Gotówka Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-on-surface">gotówka</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cashWallets.map((wallet) => (
            <AccountCard
              key={wallet.id}
              wallet={wallet}
              type="cash"
              ready={isReady}
            />
          ))}
        </div>
      </div>

      {/* Banki Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-on-surface">banki</h2>
          <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant text-sm rounded-full font-medium">
            {isReady ? bankAccounts.length : "-"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAccounts.map((wallet) => (
            <AccountCard
              key={wallet.id}
              wallet={wallet}
              type="bank"
              ready={isReady}
              onDelete={() => openDeleteModal(wallet)}
            />
          ))}
          {isReady && bankAccounts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/50 opacity-50 rounded-3xl border-2 border-dashed border-outline-variant/30 gap-2">
               <div className="w-12 h-12 rounded-full bg-surface-variant/50 flex items-center justify-center text-on-surface-variant mb-1">
                  <Icon className="text-2xl text-on-surface-variant">account_balance</Icon>
               </div>
               <h3 className="text-base font-bold text-on-surface">brak kont bankowych</h3>
               <p className="text-xs text-on-surface-variant max-w-sm text-center opacity-70">
                  nie dodałeś jeszcze żadnego konta bankowego. kliknij &quot;dodaj konto&quot; powyżej, aby zacząć śledzić swoje środki.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      <div
        ref={formEl}
        className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm"
      >
        {activeModal === "new" && (
            <NewAccountForm 
                userId={user?.id}
                successOperation={handleSuccess}
                cancelOperation={() => setActiveModal(null)}
            />
        )}
        {activeModal === "delete" && selectedWallet && (
            <DeleteAccountForm 
                wallet={selectedWallet}
                successOperation={handleSuccess}
                cancelOperation={() => {
                   setActiveModal(null);
                   setSelectedWallet(null);
                }}
            />
        )}
      </div>
    </div>
  );
}

function AccountCard({
  wallet,
  type,
  ready,
  onDelete
}: {
  wallet: WalletT;
  type: "bank" | "cash";
  ready: boolean;
  onDelete?: () => void;
}) {
  const isEuro = wallet.name.toLowerCase().includes("eur") || wallet.name.toLowerCase().includes("revolut");
  const currency = isEuro ? "EUR" : "PLN";

  return (
    <div className="flex items-center justify-between p-5 bg-surface rounded-2xl transition-all group relative">
      {type === "bank" && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant hover:bg-error hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm z-10"
          title="Usuń konto"
        >
          <Icon className="text-lg">close</Icon>
        </button>
      )}

      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${type === 'bank' ? 'bg-blue-900 text-white' : 'bg-surface-variant text-on-surface'}`}>
             {type === 'bank' ? (
                 <span className="text-xl font-bold">{wallet.name.charAt(0).toUpperCase()}</span>
             ) : (
                 <Icon className="text-2xl">payments</Icon>
             )}
        </div>
        <div className="flex flex-col">
            <h3 className="font-bold text-on-surface leading-tight text-lg">{wallet.name}</h3>
        </div>
      </div>

      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-on-surface tracking-tight">
             {ready ? (
                 <>{parseMoney(wallet.balance)} <span className="text-sm font-medium opacity-60">{currency}</span></>
             ) : (
                 <div className="w-6 h-6">
                   <CircularProgress className="small" indeterminate />
                 </div>
             )}
        </div>
      </div>
    </div>
  );
}
