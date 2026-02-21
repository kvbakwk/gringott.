"use client";

import { WalletT } from "@app/utils/db-actions/wallet";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { parseMoney } from "@app/utils/parser";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";
import { useMemo, useState, useRef, useEffect } from "react";

interface GoalCardProps {
  wallet: WalletT;
  transactions?: TransactionT[];
  transactionsLoading?: boolean;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  activeState?: "deposit" | "withdraw" | "edit" | "delete" | null;
}

export default function GoalCard({
  wallet,
  onDeposit,
  onWithdraw,
  onEdit,
  onDelete,
  activeState,
}: GoalCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Icon: use stored icon from database, or fallback to target
  const iconName = useMemo(() => {
    if (wallet.icon) return wallet.icon;
    return "target";
  }, [wallet.icon]);

  // Progress calculation
  const targetAmount = wallet.target_amount || 0;
  const progress = targetAmount > 0 ? Math.min((wallet.balance / targetAmount) * 100, 100) : 0;
  const isComplete = progress >= 100;

  // Determine border and shadow based on active state
  const getBorderClass = () => {
    switch (activeState) {
      case "deposit": return "border-green-500 border-2";
      case "withdraw": return "border-red-500 border-2";
      case "edit": return "border-primary border-2";
      case "delete": return "border-error border-2";
      default: return "border-transparent border-2";
    }
  };

  const getShadowClass = () => {
    if (activeState) return "shadow-md";
    return "";
  };

  const getBackgroundClass = () => {
    if (activeState) return "bg-white";
    return "bg-surface hover:bg-white";
  };

  return (
    <div className={`flex flex-col gap-4 rounded-2xl p-5 transition-all group relative ${getBorderClass()} ${getShadowClass()} ${getBackgroundClass()}`}>
      {/* Top row: Icon + Name + Menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-12 min-w-[48px] h-12 rounded-full flex items-center justify-center ${isComplete ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
            <Icon className="text-2xl">{isComplete ? "check_circle" : iconName}</Icon>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-on-surface truncate leading-tight" title={wallet.name}>
              {wallet.name}
            </h3>
            <div className="text-xs text-on-surface-variant mt-0.5">Cel</div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <IconButton 
            className="mini" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon>more_horiz</Icon>
          </IconButton>
          
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-outline-variant/30 z-30 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  onDeposit?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-black/5 transition-colors"
              >
                <Icon className="text-green-600 text-lg">add</Icon>
                <span>Wpłać</span>
              </button>
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  onWithdraw?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-black/5 transition-colors"
              >
                <Icon className="text-red-600 text-lg">remove</Icon>
                <span>Wypłać</span>
              </button>
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-black/5 transition-colors"
              >
                <Icon className="text-lg">edit</Icon>
                <span>Edytuj</span>
              </button>
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors font-medium"
              >
                <Icon className="text-lg">delete</Icon>
                <span>Usuń</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Balance and Target */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-extrabold text-on-surface">
            {parseMoney(wallet.balance)}{" "}
            <span className="text-sm font-medium text-on-surface-variant">PLN</span>
          </div>
          {targetAmount > 0 && (
            <div className="text-xs text-on-surface-variant mt-1">
              z {parseMoney(targetAmount)} PLN
            </div>
          )}
        </div>
        <div className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-on-surface-variant'}`}>
          {progress.toFixed(0)}%
        </div>
      </div>

      {/* Progress Bar */}
      {targetAmount > 0 && (
        <div className="w-full h-2 bg-surface-variant/50 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
