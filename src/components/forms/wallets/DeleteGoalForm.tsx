"use client";

import { useState } from "react";
import { deleteWalletAPI } from "@services/wallet/delete";
import { WalletT } from "@utils/db-actions/wallet";
import { parseMoney } from "@utils/parser";

import { FilledButton, OutlinedButton } from "@components/material/Button";
import { Icon } from "@components/material/Icon";

export default function DeleteGoalForm({
  wallet,
  successOperation,
  cancelOperation,
}: {
  wallet: WalletT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleDelete = async () => {
    setPending(true);
    setError(false);
    try {
      const res = await deleteWalletAPI(wallet.id);
      if (res?.success) {
        successOperation();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  const hasBalance = wallet.balance > 0;

  return (
    <div className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 border-error rounded-2xl shadow-lg">
      <div className="flex flex-col gap-[25px] w-[320px] items-center">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
          <Icon className="text-error text-3xl">delete</Icon>
        </div>
        
        <div className="flex flex-col items-center text-center gap-2">
          <h3 className="text-lg font-bold text-on-surface">Usuń cel</h3>
          <p className="text-sm text-on-surface-variant">
            Czy na pewno chcesz usunąć cel <strong>{wallet.name}</strong>?
          </p>
        </div>

        {hasBalance && (
          <div className="w-full p-3 bg-warning/10 border border-warning/30 rounded-xl">
            <div className="flex items-center gap-2 text-warning">
              <Icon className="text-lg">warning</Icon>
              <span className="text-xs font-medium">
                Ten cel ma saldo {parseMoney(wallet.balance)} PLN
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-[10px] w-full">
        <OutlinedButton type="button" onClick={cancelOperation}>
          anuluj
        </OutlinedButton>
        <FilledButton 
          className="bg-error hover:bg-error/90"
          onClick={handleDelete}
          disabled={pending}
        >
          {pending ? "usuwanie..." : "usuń cel"}
        </FilledButton>
      </div>

      {error && (
        <p className="text-error text-xs mt-2">
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie.
        </p>
      )}
    </div>
  );
}
