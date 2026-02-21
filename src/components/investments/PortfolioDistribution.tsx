"use client";

import { WalletT, WalletTypeT } from "@app/utils/db-actions/wallet";
import { useMemo, useState } from "react";

const WALLET_TYPE_COLORS: Record<number, string> = {
  7: "#4caf50", // Akcje - Green
  8: "#2196f3", // Obligacje - Blue
  9: "#03a9f4", // ETF - Light Blue
  10: "#9c27b0", // Kryptowaluty - Purple
  11: "#ff9800", // Surowce - Orange
  12: "#00bcd4", // Waluty - Cyan
  13: "#795548", // Nieruchomości - Brown
  14: "#607d8b", // Inne - Grey
};

export default function PortfolioDistribution({
  wallets,
  walletTypes,
}: {
  wallets: WalletT[];
  walletTypes: WalletTypeT[];
}) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const data = useMemo(() => {
    const total = wallets.reduce((acc, w) => acc + w.balance, 0);
    const groups: Record<number, number> = {};

    wallets.forEach((w) => {
      groups[w.wallet_type_id] = (groups[w.wallet_type_id] || 0) + w.balance;
    });

    return Object.entries(groups)
      .map(([typeId, balance]) => {
        const id = parseInt(typeId);
        const walletType = walletTypes.find(t => t.id === id);
        return {
          id,
          label: walletType ? walletType.name : "Nieznane",
          color: WALLET_TYPE_COLORS[id] || "#e0e0e0",
          balance,
          percentage: total > 0 ? (balance / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.balance - a.balance);
  }, [wallets, walletTypes]);

  return (
    <div className="bg-surface p-6 rounded-3xl flex flex-col gap-6">
      <h2 className="text-xl font-bold text-on-surface">dystrybucja portfela</h2>
      
      <div className="flex flex-col gap-4">
        {/* Horizontal Bar */}
        <div className="w-full h-8 flex rounded-xl overflow-hidden shadow-inner bg-surface-variant/20">
          {data.map((item) => (
            <div
              key={item.id}
              className="h-full transition-all duration-300 cursor-pointer relative group"
              style={{ 
                width: `${item.percentage}%`, 
                backgroundColor: item.color,
                opacity: activeId !== null && activeId !== item.id ? 0.6 : 1,
                scale: activeId === item.id ? '1.02' : '1'
              }}
              onMouseEnter={() => setActiveId(item.id)}
              onMouseLeave={() => setActiveId(null)}
            >
                {/* Tooltip on hover if needed, but we have legend */}
            </div>
          ))}
        </div>

        {/* Horizontal Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {data.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div 
                key={item.id} 
                className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-surface-variant/20' : ''}`}
                onMouseEnter={() => setActiveId(item.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: item.color }}
                />
                <span className={`text-sm font-medium transition-colors ${isActive ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                  {item.label.toLowerCase()}
                </span>
                <span className="text-xs font-bold text-on-surface-variant/60">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
