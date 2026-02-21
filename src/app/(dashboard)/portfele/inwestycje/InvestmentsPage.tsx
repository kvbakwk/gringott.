"use client";

import { AssetT } from "@app/utils/db-actions/asset";
import { WalletT, WalletTypeT } from "@app/utils/db-actions/wallet";
import { Icon } from "@components/material/Icon";

import PortfolioSummary from "../investments/PortfolioSummary";
import PortfolioDistribution from "../investments/PortfolioDistribution";
import AssetsTable from "../investments/AssetsTable";

export default function InvestmentsPage({
  wallets,
  walletTypes,
  walletsReady,
  assets,
  assetsReady,
}: {
  wallets: WalletT[];
  walletTypes: WalletTypeT[];
  walletsReady: boolean;
  assets: AssetT[];
  assetsReady: boolean;
}) {
  const investments = wallets.filter((w) => [7, 8, 9, 10, 11, 12, 13, 14].includes(w.wallet_type_id));
  const totalBalance = investments.reduce((a, b) => a + b.balance, 0);

  return (
    <div className="flex flex-col w-full h-full px-8 pb-8 pt-8 gap-6 overflow-hidden bg-surface-container/20">
      <div className="flex-shrink-0 flex justify-between items-center w-full">
        <div>
           <h1 className="text-3xl font-bold text-on-surface">inwestycje</h1>
           <p className="text-on-surface-variant text-sm mt-1 lowercase">monitoruj wzrost swojego portfela i dywersyfikację aktywów</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer bg-primary text-on-primary hover:opacity-90 transition-all shadow-sm border border-transparent">
                <Icon className="text-xl">add</Icon>
                <span className="text-sm font-bold lowercase">dodaj aktywo</span>
             </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-6">
        <div className="flex-1 min-h-0">
          <AssetsTable 
            assets={assets} 
            walletTypes={walletTypes} 
            assetsReady={assetsReady}
          />
        </div>

        <div className="flex-shrink-0">
          <PortfolioSummary 
            assets={assets} 
            wallets={investments} 
            walletsReady={walletsReady} 
            assetsReady={assetsReady}
          />
        </div>

        <div className="flex-shrink-0">
          <PortfolioDistribution wallets={investments} walletTypes={walletTypes} />
        </div>
      </div>
    </div>
  );
}
