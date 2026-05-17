"use client";

import { useMemo, useState, useRef, useEffect } from "react";

import { WalletT } from "@/types/wallet";
import { TransactionT } from "@/types/transaction";

import { parseMoney } from "@utils/parser";

import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";

interface PiggybankCardProps {
  wallet: WalletT;
  transactions?: TransactionT[];
  transactionsLoading?: boolean;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  activeState?: "deposit" | "withdraw" | "edit" | "delete" | null;
}

export default function PiggybankCard({
  wallet,
  onDeposit,
  onWithdraw,
  onEdit,
  onDelete,
  activeState,
}: PiggybankCardProps) {
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

  // Icon: use stored icon from database, or fallback to name-based guessing
  const iconName = useMemo(() => {
    // If icon is stored in the database, use it
    if (wallet.icon) return wallet.icon;

    // Fallback: guess icon from name for older piggybanks
    const n = wallet.name.toLowerCase();
    if (n.includes("wakacje") || n.includes("trip") || n.includes("grecja"))
      return "flight";
    if (n.includes("auto") || n.includes("samochód")) return "directions_car";
    if (n.includes("dom") || n.includes("mieszkanie") || n.includes("remont"))
      return "home";
    if (n.includes("macbook") || n.includes("komputer") || n.includes("laptop"))
      return "laptop_mac";
    if (n.includes("telefon") || n.includes("iphone")) return "smartphone";
    if (n.includes("rower")) return "pedal_bike";
    if (n.includes("prezent") || n.includes("święta")) return "card_giftcard";
    if (n.includes("fundusz") || n.includes("awaryjny")) return "security";
    return "savings";
  }, [wallet.icon, wallet.name]);

  // Determine border and shadow based on active state
  const getBorderClass = () => {
    switch (activeState) {
      case "deposit":
        return "border-green-500 border-2";
      case "withdraw":
        return "border-red-500 border-2";
      case "edit":
        return "border-primary border-2";
      case "delete":
        return "border-error border-2";
      default:
        return "border-transparent border-2";
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
    <div
      className={`flex flex-row items-center justify-between rounded-2xl p-5 transition-all group relative ${getBorderClass()} ${getShadowClass()} ${getBackgroundClass()}`}
    >
      {/* Left side: Icon + Name */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 min-w-[48px] h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
          <Icon className="text-2xl">{iconName}</Icon>
        </div>
        <div className="min-w-0">
          <h3
            className="font-bold text-lg text-on-surface truncate leading-tight"
            title={wallet.name}
          >
            {wallet.name}
          </h3>
          <div className="text-xs text-on-surface-variant mt-0.5">
            Skarbonka
          </div>
        </div>
      </div>

      {/* Right side: Balance + Actions */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="text-2xl font-extrabold text-on-surface">
            {parseMoney(wallet.balance)}{" "}
            <span className="text-sm font-medium text-on-surface-variant">
              PLN
            </span>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <IconButton className="mini" onClick={() => setMenuOpen(!menuOpen)}>
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
    </div>
  );
}
