"use client";

import { AssetT } from "@utils/db-actions/asset";
import { WalletTypeT } from "@utils/db-actions/wallet";
import { parseMoney } from "@utils/parser";
import { Icon } from "@components/material/Icon";
import { useState, useMemo, useEffect, useRef } from "react";

const ASSET_TYPE_STYLES: Record<string, string> = {
  stock: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  etf: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  crypto: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  currency: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  bond: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  fund: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

type FilterType = "all" | "profitable" | "losing";

export default function AssetsTable({
  assets,
  walletTypes,
  isReady,
}: {
  assets: AssetT[];
  walletTypes: WalletTypeT[];
  isReady: boolean;
}) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrolled(el.scrollTop > 10);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const processedAssets = useMemo(() => {
    return assets.map(asset => {
      const currentPrice = asset.current_price || 0;
      const avgBuyPrice = asset.avg_buy_price || 0;
      const currentValue = asset.quantity * currentPrice;
      const investedValue = asset.quantity * avgBuyPrice;
      
      const profitLoss = currentValue - investedValue;
      const profitLossPercent = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;
      const isPositive = profitLoss >= 0;

      return {
        ...asset,
        currentValue,
        investedValue,
        profitLoss,
        profitLossPercent,
        isPositive,
      };
    });
  }, [assets]);

  const filteredAssets = useMemo(() => {
    if (filter === "profitable") return processedAssets.filter(a => a.isPositive);
    if (filter === "losing") return processedAssets.filter(a => !a.isPositive);
    return processedAssets;
  }, [processedAssets, filter]);

  if (!isReady) {
     return (
        <div className="bg-surface rounded-3xl flex flex-col h-full items-center justify-center text-on-surface-variant/40">
            <Icon className="text-4xl animate-spin mb-4">refresh</Icon>
            <span className="text-sm font-bold lowercase tracking-wide">ładowanie aktywów...</span>
        </div>
     );
  }

  return (
    <div className="bg-surface rounded-3xl flex flex-col h-full relative text-on-surface overflow-hidden">
      {/* Combined Sticky Header (Title, Filters, and Table Headings) */}
      <div className={`flex-shrink-0 bg-surface z-40 transition-all duration-300 rounded-t-3xl ${
        scrolled ? 'shadow-sm border-b border-outline-variant/60' : 'border-b border-white/0'
      }`}>
        {/* Title and FiltersRow */}
        <div className="px-8 pt-6 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-surface lowercase">twoje aktywa</h2>
          <div className="flex gap-2 text-sm">
              <button 
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-full font-bold transition-colors lowercase ${filter === "all" ? "bg-primary/20 text-primary" : "text-on-surface-variant hover:bg-surface-variant/20"}`}
              >
                wszystkie
              </button>
              <button 
                onClick={() => setFilter("profitable")}
                className={`px-3 py-1 rounded-full font-bold transition-colors lowercase ${filter === "profitable" ? "bg-green-100 text-green-700" : "text-on-surface-variant hover:bg-surface-variant/20"}`}
              >
                zyskowne
              </button>
              <button 
                onClick={() => setFilter("losing")}
                className={`px-3 py-1 rounded-full font-bold transition-colors lowercase ${filter === "losing" ? "bg-red-100 text-red-700" : "text-on-surface-variant hover:bg-surface-variant/20"}`}
              >
                stratne
              </button>
          </div>
        </div>

        {/* Table Headings Row */}
        <div className="px-6 pb-3 border-b border-outline-variant/5">
            <div className="grid grid-cols-12 gap-4 text-left text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-black">
                <div className="col-span-4">aktywo</div>
                <div className="col-span-2 text-center">typ</div>
                <div className="col-span-2 text-center">cena</div>
                <div className="col-span-2 text-center">wartość</div>
                <div className="col-span-2 text-right">zysk/strata</div>
            </div>
        </div>
      </div>

      {/* Internal Scrollable Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-none px-4 pb-4 pt-2"
      >
        <div className="flex flex-col gap-1">
            {filteredAssets.map((asset) => {
               const typeBadge = ASSET_TYPE_STYLES[asset.type] || ASSET_TYPE_STYLES.other;

               return (
                <div 
                    key={asset.id} 
                    className="grid grid-cols-12 gap-4 items-center py-4 px-2 hover:bg-surface-variant/10 transition-all rounded-2xl group"
                >
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-surface-variant text-primary flex items-center justify-center font-bold text-xs  flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                        {asset.icon ? (
                            <img src={asset.icon} alt={asset.name} className="w-full h-full object-cover" />
                        ) : (
                             asset.name.substring(0, 2).toUpperCase()
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-on-surface leading-tight truncate">{asset.name}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{asset.ticker}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex justify-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider ${typeBadge}`}>
                        {asset.type.toLowerCase()}
                    </span>
                  </div>

                  <div className="col-span-2 text-center flex flex-col justify-center">
                     <span className="text-sm font-bold text-on-surface">{parseMoney(asset.current_price || 0)} <span className="text-[10px] text-on-surface-variant/60">{asset.currency}</span></span>
                     <span className="text-[10px] text-on-surface-variant/60 font-medium">{asset.quantity} szt.</span>
                  </div>

                  <div className="col-span-2 text-center text-sm font-bold text-on-surface flex flex-col justify-center">
                    <span>{parseMoney(asset.currentValue)} <span className="text-[10px] text-on-surface-variant/60">{asset.currency}</span></span>
                  </div>

                  <div className={`col-span-2 text-right text-sm font-black flex flex-col items-end justify-center ${asset.isPositive ? 'text-green-600' : 'text-error'}`}>
                    <div className="flex items-center gap-1">
                        {asset.isPositive ? '+' : ''}{parseMoney(asset.profitLoss)} {asset.currency}
                        <Icon className="text-sm font-black">{asset.isPositive ? 'trending_up' : 'trending_down'}</Icon>
                    </div>
                    <span className={`text-[10px] font-bold opacity-80`}>
                        {asset.isPositive ? '+' : ''}{asset.profitLossPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
               );
            })}
        </div>
        
        {filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/40">
                <Icon className="text-5xl mb-3 opacity-30">search_off</Icon>
                <p className="text-sm font-bold tracking-tight lowercase">brak aktywów spełniających kryteria.</p>
            </div>
        )}
      </div>
    </div>
  );
}
